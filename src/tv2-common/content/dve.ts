import {
	CameraContent,
	GraphicsContent,
	NotesContext,
	RemoteContent,
	SourceLayerType,
	SplitsContent,
	SplitsContentBoxProperties,
	TSR,
	VTContent
} from 'tv-automation-sofie-blueprints-integration'
import {
	createEmptyObject,
	CueDefinitionDVE,
	DVEConfigInput,
	DVEParentClass,
	DVESources,
	FindSourceInfoStrict,
	GetSisyfosTimelineObjForCamera,
	GetSisyfosTimelineObjForEVS,
	literal,
	PartDefinition,
	SourceInfo,
	SourceInfoType,
	TimelineBlueprintExt,
	TV2BlueprintConfigBase,
	TV2StudioConfigBase
} from 'tv2-common'
import { ControlClasses, MEDIA_PLAYER_AUTO } from 'tv2-constants'
import * as _ from 'underscore'
import { AtemSourceIndex } from '../../types/atem'
import { ActionSelectDVE } from '../actions'
import { PartContext2 } from '../partContext2'

export interface DVEConfigBox {
	enabled: boolean
	source: number
	x: number
	y: number
	size: number
	cropped: boolean
	cropTop: number
	cropBottom: number
	cropLeft: number
	cropRight: number
}

export interface DVEConfig {
	boxes: {
		[key: number]: DVEConfigBox
	}
	index: number
	properties: {
		artFillSource: number
		artCutSource: number
		artOption: number
		artPreMultiplied: boolean
		artClip: number
		artGain: number
		artInvertKey: boolean
	}
	border: {
		borderEnabled: boolean
		borderBevel: number
		borderOuterWidth: number
		borderInnerWidth: number
		borderOuterSoftness: number
		borderInnerSoftness: number
		borderBevelSoftness: number
		borderBevelPosition: number
		borderHue: number
		borderSaturation: number
		borderLuma: number
		borderLightSourceDirection: number
		borderLightSourceAltitude: number
	}
}

export interface DVELayers {
	ATEM: {
		SSrcDefault: string
		SSrcArt: string
		MEProgram: string
	}
	CASPAR: {
		CGDVEKey: string
		CGDVEFrame: string
		CGDVETemplate: string
	}
	SisyfosLLayer: {
		ClipPending: string
		StudioMics: string
		PersistedLevels: string
	}
	CasparLLayer: {
		ClipPending: string
	}
}

export interface DVEMetaData {
	mediaPlayerSession?: string
}

export interface DVEPieceMetaData {
	config: DVEConfigInput
	sources: DVESources
	userData: ActionSelectDVE
}

export interface DVEBoxInfo {
	rawType: string
}

export interface DVETimelineObjectGenerators {
	GetSisyfosTimelineObjForEkstern: (
		context: NotesContext,
		sources: SourceInfo[],
		sourceType: string,
		getLayersForEkstern: (context: NotesContext, sources: SourceInfo[], sourceType: string) => string[],
		enable?: TSR.Timeline.TimelineEnable
	) => TSR.TSRTimelineObj[]
	GetLayersForEkstern: (context: NotesContext, sources: SourceInfo[], sourceType: string) => string[]
}

export interface DVEOptions {
	dveLayers: DVELayers
	dveTimelineGenerators: DVETimelineObjectGenerators
	boxMappings: [string, string, string, string]
	boxLayers: {
		INP1: string
		INP2: string
		INP3: string
		INP4: string
	}
	/** All audio layers */
	AUDIO_LAYERS: string[]
	/** Layers to exclude from filter */
	EXCLUDED_LAYERS: string[]
}

export function MakeContentDVEBase<
	StudioConfig extends TV2StudioConfigBase,
	ShowStyleConfig extends TV2BlueprintConfigBase<StudioConfig>
>(
	context: PartContext2,
	config: ShowStyleConfig,
	partDefinition: PartDefinition,
	parsedCue: CueDefinitionDVE,
	dveConfig: DVEConfigInput | undefined,
	dveGeneratorOptions: DVEOptions,
	addClass?: boolean,
	adlib?: boolean
): { content: SplitsContent; valid: boolean; stickyLayers: string[] } {
	if (!dveConfig) {
		context.warning(`DVE ${parsedCue.template} is not configured`)
		return {
			valid: false,
			content: {
				boxSourceConfiguration: [],
				timelineObjects: [],
				dveConfiguration: []
			},
			stickyLayers: []
		}
	}

	// console.log('boxmap1', boxMap)
	// boxMap = boxMap.filter(map => map !== '')
	// console.log('boxmap2', boxMap)

	const graphicsTemplateContent: { [key: string]: string } = {}
	parsedCue.labels.forEach((label, i) => {
		graphicsTemplateContent[`locator${i + 1}`] = label
	})

	return MakeContentDVE2(
		context,
		config,
		dveConfig,
		graphicsTemplateContent,
		parsedCue.sources,
		dveGeneratorOptions,
		addClass ? DVEParentClass('studio0', dveConfig.DVEName) : undefined,
		adlib,
		partDefinition.fields.videoId,
		partDefinition.segmentExternalId
	)
}

export function MakeContentDVE2<
	StudioConfig extends TV2StudioConfigBase,
	ShowStyleConfig extends TV2BlueprintConfigBase<StudioConfig>
>(
	context: NotesContext,
	config: ShowStyleConfig,
	dveConfig: DVEConfigInput,
	graphicsTemplateContent: { [key: string]: string },
	sources: DVESources | undefined,
	dveGeneratorOptions: DVEOptions,
	className?: string,
	adlib?: boolean,
	videoId?: string,
	segmentExternalId?: string
): { content: SplitsContent; valid: boolean; stickyLayers: string[] } {
	let template: DVEConfig
	try {
		template = JSON.parse(dveConfig.DVEJSON) as DVEConfig
	} catch (e) {
		context.warning(`DVE Config JSON is not valid for ${dveConfig.DVEName}`)
		return {
			valid: false,
			content: {
				boxSourceConfiguration: [],
				timelineObjects: [],
				dveConfiguration: []
			},
			stickyLayers: []
		}
	}

	const inputs = dveConfig.DVEInputs
		? dveConfig.DVEInputs.toString().split(';')
		: '1:INP1;2:INP2;3:INP3;4:INP4'.split(';')
	const boxMap: Array<{ source: string; sourceLayer: string }> = []

	const classes: string[] = []

	inputs.forEach(source => {
		const sourceProps = source.split(':')
		const fromCue = sourceProps[1]
		const targetBox = Number(sourceProps[0])
		if (!fromCue || !targetBox || isNaN(targetBox)) {
			context.warning(`Invalid DVE mapping: ${sourceProps}`)
			return
		}

		const sourceLayer = dveGeneratorOptions.boxLayers[fromCue as keyof DVESources] as string
		classes.push(`${sourceLayer}_${dveGeneratorOptions.boxMappings[targetBox - 1]}`)

		let usedServer = false

		if (sources) {
			const prop = sources[fromCue as keyof DVESources]
			if (prop?.match(/[K|C]AM(?:era)? ?.*/i)) {
				const match = prop.match(/[K|C]AM(?:era)? ?(.*)/i) as RegExpExecArray

				boxMap[targetBox - 1] = { source: `KAM ${match[1]}`, sourceLayer }
			} else if (prop?.match(/LIVE ?.*/i)) {
				const match = prop.match(/LIVE ?(.*)/i) as RegExpExecArray

				boxMap[targetBox - 1] = { source: `LIVE ${match[1]}`, sourceLayer }
			} else if (prop?.match(/full/i)) {
				boxMap[targetBox - 1] = { source: `ENGINE FULL`, sourceLayer }
			} else if (prop?.match(/EVS ?.*/i)) {
				const match = prop.match(/EVS ?(.*)/i) as RegExpExecArray

				boxMap[targetBox - 1] = { source: `EVS ${match[1]}`, sourceLayer }
			} else if (prop?.match(/DEFAULT/)) {
				boxMap[targetBox - 1] = { source: `DEFAULT SOURCE`, sourceLayer }
			} else if (prop) {
				if (videoId && !usedServer) {
					boxMap[targetBox - 1] = { source: `SERVER ${videoId}`, sourceLayer }
					usedServer = true
				} else {
					boxMap[targetBox - 1] = { source: prop, sourceLayer }
				}
			} else {
				if (videoId && !usedServer) {
					boxMap[targetBox - 1] = { source: `SERVER ${videoId}`, sourceLayer }
					usedServer = true
				} else {
					context.warning(`Missing mapping for ${targetBox}`)
					boxMap[targetBox - 1] = { source: '', sourceLayer }
				}
			}
		} else {
			// Need something to keep the layout etc
			boxMap[targetBox - 1] = { source: '', sourceLayer }
		}
	})

	const boxes = _.map(template.boxes, box => ({ ...box, source: config.studio.AtemSource.Default }))
	const dveTimeline: TSR.TSRTimelineObj[] = []
	const boxSources: Array<(VTContent | CameraContent | RemoteContent | GraphicsContent) &
		SplitsContentBoxProperties &
		DVEBoxInfo> = []

	const setBoxSource = (num: number, sourceInfo: SourceInfo, rawType: string, mappingFrom: string) => {
		if (boxes[num]) {
			boxes[num].source = Number(sourceInfo.port)

			boxSources.push({
				// TODO - draw box geometry
				...boxSource(sourceInfo, mappingFrom),
				...literal<CameraContent | RemoteContent>({
					studioLabel: '',
					switcherInput: Number(sourceInfo.port),
					timelineObjects: []
				}),
				rawType: rawType
					.replace(/kam /i, 'Kamera ')
					.replace('kamera', 'Kamera')
					.replace(/cam /i, 'Kamera ')
					.replace('camera', 'Kamera')
			})
		}
	}

	let valid = true
	let server = false

	boxMap.forEach((mappingFrom, num) => {
		if (mappingFrom === undefined || mappingFrom.source === '') {
			if (sources) {
				// If it is intentional there are no sources, then ignore
				// TODO - should this warn?
				context.warning(`Missing source type for DVE box: ${num + 1}`)
				valid = false
			}
		} else {
			const props = mappingFrom.source.split(' ')
			const sourceType = props[0]
			const sourceInput = props[1]
			if ((!sourceType || !sourceInput) && !mappingFrom.source.match(/SERVER/)) {
				context.warning(`Invalid DVE source: ${mappingFrom.source}`)
				return
			}
			const audioEnable: TSR.Timeline.TimelineEnable = {
				while: `1`
			}
			if (sourceType.match(/DEFAULT/)) {
				setBoxSource(
					num,
					{
						type: SourceLayerType.UNKNOWN,
						id: 'DEFAULT',
						port: config.studio.AtemSource.Default
					},
					mappingFrom.source,
					mappingFrom.source
				)
			} else if (sourceType.match(/KAM/i)) {
				const sourceInfoCam = FindSourceInfoStrict(context, config.sources, SourceLayerType.CAMERA, mappingFrom.source)
				if (sourceInfoCam === undefined) {
					context.warning(`Invalid source: ${mappingFrom.source}`)
					valid = false
					return
				}

				setBoxSource(num, sourceInfoCam, mappingFrom.source, mappingFrom.source)
				dveTimeline.push(
					GetSisyfosTimelineObjForCamera(
						context,
						config,
						mappingFrom.source,
						dveGeneratorOptions.dveLayers.SisyfosLLayer.StudioMics,
						audioEnable
					)
				)
			} else if (sourceType.match(/LIVE/i) || sourceType.match(/SKYPE/i)) {
				const sourceInfoLive = FindSourceInfoStrict(context, config.sources, SourceLayerType.REMOTE, mappingFrom.source)
				if (sourceInfoLive === undefined) {
					context.warning(`Invalid source: ${mappingFrom.source}`)
					valid = false
					return
				}

				setBoxSource(num, sourceInfoLive, mappingFrom.source, mappingFrom.source)
				dveTimeline.push(
					...dveGeneratorOptions.dveTimelineGenerators.GetSisyfosTimelineObjForEkstern(
						context,
						config.sources,
						mappingFrom.source,
						dveGeneratorOptions.dveTimelineGenerators.GetLayersForEkstern,
						audioEnable
					)
				)
			} else if (sourceType.match(/EVS/i)) {
				const sourceInfoDelayedPlayback = FindSourceInfoStrict(
					context,
					config.sources,
					SourceLayerType.REMOTE,
					mappingFrom.source
				)
				if (sourceInfoDelayedPlayback === undefined) {
					context.warning(`Invalid source: ${mappingFrom.source}`)
					valid = false
					return
				}

				setBoxSource(num, sourceInfoDelayedPlayback, mappingFrom.source, mappingFrom.source)
				dveTimeline.push(
					GetSisyfosTimelineObjForEVS(sourceInfoDelayedPlayback, !!sourceType.match(/VO/i)),
					GetSisyfosTimelineObjForCamera(context, config, 'evs', dveGeneratorOptions.dveLayers.SisyfosLLayer.StudioMics)
				)
			} else if (sourceType.match(/ENGINE/i)) {
				if (sourceInput.match(/full/i)) {
					const sourceInfoFull: SourceInfo = {
						type: SourceLayerType.GRAPHICS,
						id: 'full',
						port: config.studio.AtemSource.DSK1F
					}
					setBoxSource(num, sourceInfoFull, mappingFrom.source, mappingFrom.source)
					dveTimeline.push(
						GetSisyfosTimelineObjForCamera(
							context,
							config,
							'full',
							dveGeneratorOptions.dveLayers.SisyfosLLayer.StudioMics
						)
					)
				} else {
					context.warning(`Unsupported engine for DVE: ${sourceInput}`)
				}
			} else if (sourceType.match(/SERVER/i)) {
				const file: string | undefined = videoId

				server = true
				setBoxSource(
					num,
					{
						type: SourceLayerType.VT,
						id: 'SERVER',
						port: -1
					},
					mappingFrom.source,
					mappingFrom.source
				)
				dveTimeline.push(
					literal<TSR.TimelineObjCCGMedia & TimelineBlueprintExt>({
						id: '',
						enable: getDVEEnable(undefined, true),
						priority: 1,
						layer: dveGeneratorOptions.dveLayers.CasparLLayer.ClipPending,
						content: {
							deviceType: TSR.DeviceType.CASPARCG,
							type: TSR.TimelineContentTypeCasparCg.MEDIA,
							file: adlib ? 'continue' : file ? file : 'continue', // If adlib, or if no file, continue existing file // TODO: Adlib with clip specified?
							loop: true
						},
						metaData: {
							mediaPlayerSession: server ? (segmentExternalId ? segmentExternalId : MEDIA_PLAYER_AUTO) : undefined
						},
						classes: file ? [] : [ControlClasses.DVEPlaceholder]
					}),
					literal<TSR.TimelineObjSisyfosChannel & TimelineBlueprintExt>({
						id: '',
						enable: getDVEEnable(undefined, true),
						priority: 1,
						layer: dveGeneratorOptions.dveLayers.SisyfosLLayer.ClipPending,
						content: {
							deviceType: TSR.DeviceType.SISYFOS,
							type: TSR.TimelineContentTypeSisyfos.CHANNEL,
							isPgm: 1
						},
						metaData: {
							mediaPlayerSession: server ? (segmentExternalId ? segmentExternalId : MEDIA_PLAYER_AUTO) : undefined
						},
						classes: file ? [] : [ControlClasses.DVEPlaceholder]
					})
				)
				return
			} else {
				context.warning(`Unknown source type for DVE: ${mappingFrom.source}`)
				valid = false
			}
		}
	})

	const graphicsTemplateName = dveConfig.DVEGraphicsTemplate ? dveConfig.DVEGraphicsTemplate.toString() : ''
	let graphicsTemplateStyle: any = ''
	try {
		if (dveConfig.DVEGraphicsTemplateJSON) {
			graphicsTemplateStyle = JSON.parse(dveConfig.DVEGraphicsTemplateJSON.toString())
		}
	} catch {
		context.warning(`DVE Graphics Template JSON is not valid for ${dveConfig.DVEName}`)
	}

	const keyFile = dveConfig.DVEGraphicsKey ? dveConfig.DVEGraphicsKey.toString() : ''
	const frameFile = dveConfig.DVEGraphicsFrame ? dveConfig.DVEGraphicsFrame.toString() : ''

	if (adlib) {
		dveTimeline.push(
			literal<TSR.TimelineObjSisyfosChannels & TimelineBlueprintExt>({
				id: '',
				enable: getDVEEnable(),
				priority: 1,
				layer: dveGeneratorOptions.dveLayers.SisyfosLLayer.PersistedLevels,
				content: {
					deviceType: TSR.DeviceType.SISYFOS,
					type: TSR.TimelineContentTypeSisyfos.CHANNELS,
					overridePriority: 1,
					channels: config.stickyLayers
						.filter(layer => dveTimeline.map(obj => obj.layer).indexOf(layer) === -1)
						.filter(layer => config.liveAudio.indexOf(layer) === -1)
						.map<TSR.TimelineObjSisyfosChannels['content']['channels'][0]>(layer => {
							return {
								mappedLayer: layer,
								isPgm: 0
							}
						})
				},
				metaData: {
					sisyfosPersistLevel: true
				}
			})
		)
	}

	return {
		valid,
		content: literal<SplitsContent>({
			boxSourceConfiguration: boxSources,
			dveConfiguration: {},
			timelineObjects: _.compact<TSR.TSRTimelineObj>([
				// Setup classes for adlibs to be able to override boxes
				createEmptyObject({
					enable: getDVEEnable(),
					layer: 'dve_lookahead_control',
					classes: [ControlClasses.DVEOnAir]
				}),

				// setup ssrc
				literal<TSR.TimelineObjAtemSsrc & TimelineBlueprintExt>({
					id: '',
					enable: {
						while: '1'
					},
					priority: 1,
					layer: dveGeneratorOptions.dveLayers.ATEM.SSrcDefault,
					content: {
						deviceType: TSR.DeviceType.ATEM,
						type: TSR.TimelineContentTypeAtem.SSRC,
						ssrc: { boxes }
					},
					classes: className ? [...classes, className] : classes,
					metaData: literal<DVEMetaData>({
						mediaPlayerSession: server ? (segmentExternalId ? segmentExternalId : MEDIA_PLAYER_AUTO) : undefined
					})
				}),
				literal<TSR.TimelineObjAtemSsrcProps>({
					id: '',
					enable: getDVEEnable(Number(config.studio.CasparPrerollDuration) - 10), // TODO - why 10ms?
					priority: 1,
					layer: dveGeneratorOptions.dveLayers.ATEM.SSrcArt,
					content: {
						deviceType: TSR.DeviceType.ATEM,
						type: TSR.TimelineContentTypeAtem.SSRCPROPS,
						ssrcProps: {
							artFillSource: config.studio.AtemSource.SplitArtF,
							artCutSource: config.studio.AtemSource.SplitArtK,
							artOption: 1,
							artPreMultiplied: true
						}
					}
				}),
				literal<TSR.TimelineObjAtemME>({
					id: '',
					enable: getDVEEnable(Number(config.studio.CasparPrerollDuration)),
					priority: 1,
					layer: dveGeneratorOptions.dveLayers.ATEM.MEProgram,
					content: {
						deviceType: TSR.DeviceType.ATEM,
						type: TSR.TimelineContentTypeAtem.ME,
						me: {
							input: AtemSourceIndex.SSrc,
							transition: TSR.AtemTransitionStyle.CUT
						}
					},
					...(adlib ? { classes: ['adlib_deparent'] } : {})
				}),
				...(graphicsTemplateName
					? [
							literal<TSR.TimelineObjCCGTemplate>({
								id: '',
								enable: getDVEEnable(),
								priority: 1,
								layer: dveGeneratorOptions.dveLayers.CASPAR.CGDVETemplate,
								content: {
									deviceType: TSR.DeviceType.CASPARCG,
									type: TSR.TimelineContentTypeCasparCg.TEMPLATE,
									templateType: 'html',
									name: graphicsTemplateName,
									data: {
										display: {
											isPreview: false,
											displayState: 'locators'
										},
										locators: {
											style: graphicsTemplateStyle ? graphicsTemplateStyle : {},
											content: graphicsTemplateContent
										}
									},
									useStopCommand: false
								}
							})
					  ]
					: []),
				...(keyFile
					? [
							literal<TSR.TimelineObjCCGMedia>({
								id: '',
								enable: getDVEEnable(),
								priority: 1,
								layer: dveGeneratorOptions.dveLayers.CASPAR.CGDVEKey,
								content: {
									deviceType: TSR.DeviceType.CASPARCG,
									type: TSR.TimelineContentTypeCasparCg.MEDIA,
									file: keyFile,
									mixer: {
										keyer: true
									},
									loop: true
								}
							})
					  ]
					: []),
				...(frameFile
					? [
							literal<TSR.TimelineObjCCGMedia>({
								id: '',
								enable: getDVEEnable(),
								priority: 1,
								layer: dveGeneratorOptions.dveLayers.CASPAR.CGDVEFrame,
								content: {
									deviceType: TSR.DeviceType.CASPARCG,
									type: TSR.TimelineContentTypeCasparCg.MEDIA,
									file: frameFile,
									loop: true
								}
							})
					  ]
					: []),

				...dveTimeline
			])
		}),
		stickyLayers: [
			...dveTimeline
				.filter(obj => obj.content.deviceType === TSR.DeviceType.SISYFOS)
				.filter(obj => dveGeneratorOptions.AUDIO_LAYERS.includes(obj.layer.toString()))
				.filter(obj => !dveGeneratorOptions.EXCLUDED_LAYERS.includes(obj.layer.toString()))
				.map<string>(obj => obj.layer.toString())
		]
	}
}

function boxSource(
	info: SourceInfo,
	label: string
): {
	studioLabel: string
	switcherInput: number
	type: SourceInfoType
} {
	return {
		studioLabel: label,
		switcherInput: info.port,
		type: info.type
	}
}

function getDVEEnable(offsetFromStart?: number, media?: boolean): TSR.TSRTimelineObj['enable'] {
	if (offsetFromStart) {
		return { start: offsetFromStart ?? 0 }
	}
	return media ? { while: '1' } : { start: offsetFromStart ?? 0 }
}
