import {
	DeviceType,
	TimelineContentTypeAtem,
	TimelineContentTypeCasparCg,
	TimelineContentTypeSisyfos,
	TimelineObjAtemDSK,
	TimelineObjCCGMedia,
	TimelineObjSisyfosAny
} from 'timeline-state-resolver-types'
import {
	IBlueprintAdLibPiece,
	IBlueprintPiece,
	PartContext,
	PieceLifespan,
	TimelineObjectCoreExt,
	VTContent
} from 'tv-automation-sofie-blueprints-integration'
import { literal } from '../../../common/util'
import { PartDefinition } from '../../../tv2_afvd_showstyle/inewsConversion/converters/ParseBody'
import { CueDefinitionJingle } from '../../../tv2_afvd_showstyle/inewsConversion/converters/ParseCue'
import { SourceLayer } from '../../../tv2_afvd_showstyle/layers'
import { AtemLLayer, CasparLLayer, SisyfosLLAyer } from '../../../tv2_afvd_studio/layers'
import { TimelineBlueprintExt } from '../../../tv2_afvd_studio/onTimelineGenerate'
import { BlueprintConfig } from '../config'

export function EvaluateJingle(
	context: PartContext,
	config: BlueprintConfig,
	pieces: IBlueprintPiece[],
	_adlibPieces: IBlueprintAdLibPiece[],
	parsedCue: CueDefinitionJingle,
	part: PartDefinition,
	adlib?: boolean,
	_rank?: number
) {
	if (!config.showStyle.BreakerConfig) {
		context.warning(`Jingles have not been configured`)
		return
	}

	let file = ''

	const jingle = config.showStyle.BreakerConfig.find(brkr =>
		brkr.BreakerName ? brkr.BreakerName.toString().toUpperCase() === parsedCue.clip.toUpperCase() : false
	)
	if (!jingle) {
		context.warning(`Jingle ${parsedCue.clip} is not configured`)
		return
	} else {
		file = jingle.ClipName.toString()
	}

	if (adlib) {
		context.warning(`Jingles should never be adlibs`)
	} else {
		pieces.push(
			literal<IBlueprintPiece>({
				_id: '',
				externalId: part.externalId,
				name: parsedCue.clip,
				enable: {
					start: 0
				},
				infiniteMode: PieceLifespan.OutOnNextPart,
				outputLayerId: 'jingle',
				sourceLayerId: SourceLayer.PgmJingle,
				isTransition: true,
				content: literal<VTContent>({
					studioLabel: '',
					fileName: file,
					path: file,
					firstWords: '',
					lastWords: '',
					timelineObjects: literal<TimelineObjectCoreExt[]>([
						literal<TimelineObjCCGMedia & TimelineBlueprintExt>({
							id: '',
							enable: {
								start: 0
							},
							priority: 1,
							layer: CasparLLayer.CasparPlayerJingle,
							content: {
								deviceType: DeviceType.CASPARCG,
								type: TimelineContentTypeCasparCg.MEDIA,
								file
							}
						}),

						literal<TimelineObjAtemDSK>({
							id: '',
							enable: { while: '1' },
							priority: 0,
							layer: AtemLLayer.AtemDSKEffect,
							content: {
								deviceType: DeviceType.ATEM,
								type: TimelineContentTypeAtem.DSK,
								dsk: {
									onAir: true,
									sources: {
										fillSource: config.studio.AtemSource.JingleFill,
										cutSource: config.studio.AtemSource.JingleKey
									},
									properties: {
										tie: false,
										preMultiply: false,
										clip: 393,
										gain: 209,
										mask: {
											enabled: false
										}
									}
								}
							}
						}),

						literal<TimelineObjSisyfosAny & TimelineBlueprintExt>({
							id: '',
							enable: {
								start: 0
							},
							priority: 1,
							layer: SisyfosLLAyer.SisyfosSourceJingle,
							content: {
								deviceType: DeviceType.SISYFOS,
								type: TimelineContentTypeSisyfos.SISYFOS,
								isPgm: 1
							}
						})
					])
				})
			})
		)
	}
}
