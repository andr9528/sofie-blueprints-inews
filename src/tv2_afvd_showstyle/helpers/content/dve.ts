import {
	AtemTransitionStyle,
	DeviceType,
	TimelineContentTypeAtem,
	TimelineContentTypeCasparCg,
	TimelineObjAtemME,
	TimelineObjAtemSsrc,
	TimelineObjAtemSsrcProps,
	TimelineObjCCGMedia,
	TSRTimelineObj
} from 'timeline-state-resolver-types'
import {
	CameraContent,
	GraphicsContent,
	PartContext,
	RemoteContent,
	SourceLayerType,
	SplitsContent,
	VTContent
} from 'tv-automation-sofie-blueprints-integration'
import * as _ from 'underscore'
import { literal } from '../../../common/util'
import { BlueprintConfig } from '../../../tv2_afvd_showstyle/helpers/config'
import { atemNextObject } from '../../../tv2_afvd_studio/helpers/objects'
import { FindSourceInfoStrict, SourceInfo } from '../../../tv2_afvd_studio/helpers/sources'
import { AtemLLayer, CasparLLayer } from '../../../tv2_afvd_studio/layers'
import { AtemSourceIndex } from '../../../types/atem'
import { CueDefinitionDVE } from '../../inewsConversion/converters/ParseCue'
import { DVEConfig, DVEConfigBox } from '../pieces/dve'
import { GetSisyfosTimelineObjForCamera, GetSisyfosTimelineObjForEkstern } from '../sisyfos/sisyfos'

export function MakeContentDVE(
	context: PartContext,
	config: BlueprintConfig,
	partId: string,
	parsedCue: CueDefinitionDVE,
	template: DVEConfig,
	background: string
): { content: SplitsContent; valid: boolean } {
	const boxes: DVEConfigBox[] = []
	let audioTimeline: TSRTimelineObj[] = []
	const boxSources: Array<
		(VTContent | CameraContent | RemoteContent | GraphicsContent) & {
			type: SourceLayerType
			studioLabel: string
			switcherInput: number | string
			/** Geometry information for a given box item in the Split. X,Y are relative to center of Box, Scale is 0...1, where 1 is Full-Screen */
			geometry?: {
				x: number
				y: number
				scale: number
				crop?: {
					left: number
					top: number
					right: number
					bottom: number
				}
			}
		}
	> = []

	let valid = true

	parsedCue.sources.forEach((source, index) => {
		const props = source.split(' ')
		const sourceType = props[0]
		const sourceInput = props[1]
		if (!sourceType || !sourceInput) {
			context.warning(`Invalid DVE source: ${source}`)
			return
		}
		if (sourceType.match(/KAM/i)) {
			const sourceInfoCam = FindSourceInfoStrict(context, config.sources, SourceLayerType.CAMERA, source)
			if (sourceInfoCam === undefined) {
				context.warning(`Invalid source: ${source}`)
				valid = false
				return
			}
			boxSources.push({
				...boxSource(sourceInfoCam, source),
				...literal<CameraContent>({
					studioLabel: '',
					switcherInput: sourceInfoCam.port,
					timelineObjects: []
				})
			})
			boxes.push({ ...template.boxes[index], ...{ source: sourceInfoCam.port } })

			audioTimeline = [...audioTimeline, ...GetSisyfosTimelineObjForCamera(source)]
		} else if (sourceType.match(/LIVE/i) || sourceType.match(/SKYPE/i)) {
			const sourceInfoLive = FindSourceInfoStrict(context, config.sources, SourceLayerType.REMOTE, source)
			if (sourceInfoLive === undefined) {
				context.warning(`Invalid source: ${source}`)
				valid = false
				return
			}
			boxSources.push({
				...boxSource(sourceInfoLive, source),
				...literal<RemoteContent>({
					studioLabel: '',
					switcherInput: sourceInfoLive.port,
					timelineObjects: []
				})
			})
			boxes.push({ ...template.boxes[index], ...{ source: sourceInfoLive.port } })

			audioTimeline = [...audioTimeline, ...GetSisyfosTimelineObjForEkstern(source)]
		} else {
			context.warning(`Unknown source type for DVE: ${source}`)
			valid = false
		}
	})
	return {
		valid,
		content: literal<SplitsContent>({
			boxSourceConfiguration: boxSources,
			dveConfiguration: {},
			timelineObjects: _.compact<TSRTimelineObj>([
				// setup ssrc
				literal<TimelineObjAtemSsrc>({
					id: `${partId}_DVE_ATEMSSRC`,
					enable: { start: 0 },
					priority: 1,
					layer: AtemLLayer.AtemSSrcDefault,
					content: {
						deviceType: DeviceType.ATEM,
						type: TimelineContentTypeAtem.SSRC,
						ssrc: { boxes }
					}
				}),

				literal<TimelineObjAtemME>({
					id: '',
					enable: { start: `#${partId}_DVE_ATEMSSRC.start + 80` }, // give the ssrc 2 frames to get configured
					priority: 1,
					layer: AtemLLayer.AtemMEProgram,
					content: {
						deviceType: DeviceType.ATEM,
						type: TimelineContentTypeAtem.ME,
						me: {
							input: AtemSourceIndex.SSrc,
							transition: AtemTransitionStyle.CUT
						}
					}
				}),

				...(background
					? [
							literal<TimelineObjCCGMedia>({
								id: '',
								enable: { start: 0 },
								priority: 1,
								layer: CasparLLayer.CasparCGDVELoop,
								content: {
									deviceType: DeviceType.CASPARCG,
									type: TimelineContentTypeCasparCg.MEDIA,
									file: background,
									loop: true
								}
							}),
							literal<TimelineObjAtemSsrcProps>({
								id: '',
								enable: { start: 0 },
								priority: 1,
								layer: AtemLLayer.AtemSSrcArt,
								content: {
									deviceType: DeviceType.ATEM,
									type: TimelineContentTypeAtem.SSRCPROPS,
									ssrcProps: {
										artFillSource: config.studio.AtemSource.SplitArtF,
										artCutSource: config.studio.AtemSource.SplitArtK,
										artOption: 0, // Background
										artPreMultiplied: false
									}
								}
							})
					  ]
					: []),

				// TODO: Graphic overlay

				...audioTimeline,

				atemNextObject(AtemSourceIndex.SSrc)
			])
		})
	}
}

function boxSource(
	info: SourceInfo,
	label: string
): {
	studioLabel: string
	switcherInput: number
	type: SourceLayerType.CAMERA | SourceLayerType.REMOTE | SourceLayerType.AUDIO
} {
	return {
		studioLabel: label,
		switcherInput: info.port,
		type: info.type
	}
}

/*function makeBox(
	configBox: DVEConfigBox
): {
	x: number
	y: number
	scale: number
	crop?: {
		left: number
		top: number
		right: number
		bottom: number
	}
} {
	return {
		x: configBox.x,
		y: configBox.y,
		scale: configBox.size / 1000,
		...(configBox.cropped
			? {
					crop: {
						left: configBox.cropLeft,
						top: configBox.cropTop,
						right: configBox.cropRight,
						bottom: configBox.cropBottom
					}
			  }
			: {})
	}
}*/
