import {
	DeviceType,
	TimelineContentTypeVizMSE,
	TimelineObjVIZMSEElementInternal,
	TSRTimelineObj
} from 'timeline-state-resolver-types'
import {
	GraphicsContent,
	IBlueprintAdLibPiece,
	IBlueprintPiece,
	PartContext,
	PieceLifespan
} from 'tv-automation-sofie-blueprints-integration'
import * as _ from 'underscore'
import { CalculateTime } from '../../../common/cueTiming'
import { CueDefinitionDesign } from '../../../common/inewsConversion/converters/ParseCue'
import { literal } from '../../../common/util'
import { SourceLayer } from '../../../tv2_afvd_showstyle/layers'
import { BlueprintConfig } from '../../../tv2_afvd_studio/helpers/config'
import { VizLLayer } from '../../../tv2_afvd_studio/layers'

export function EvaluateDesign(
	_config: BlueprintConfig,
	context: PartContext,
	pieces: IBlueprintPiece[],
	adlibPieces: IBlueprintAdLibPiece[],
	partId: string,
	parsedCue: CueDefinitionDesign,
	adlib?: boolean,
	rank?: number
) {
	if (!parsedCue.design || !parsedCue.design.length) {
		context.warning(`No valid design found for ${parsedCue.design}`)
		return
	}

	if (adlib) {
		adlibPieces.push(
			literal<IBlueprintAdLibPiece>({
				_rank: rank || 0,
				externalId: partId,
				name: parsedCue.design,
				outputLayerId: 'sec',
				sourceLayerId: SourceLayer.PgmDesign,
				infiniteMode: PieceLifespan.Infinite,
				content: literal<GraphicsContent>({
					fileName: parsedCue.design,
					path: parsedCue.design,
					timelineObjects: _.compact<TSRTimelineObj>([
						literal<TimelineObjVIZMSEElementInternal>({
							id: '',
							enable: { start: 0 },
							priority: 100,
							layer: VizLLayer.VizLLayerDesign,
							content: {
								deviceType: DeviceType.VIZMSE,
								type: TimelineContentTypeVizMSE.ELEMENT_INTERNAL,
								templateName: parsedCue.design,
								templateData: []
							}
						})
					])
				})
			})
		)
	} else {
		pieces.push(
			literal<IBlueprintPiece>({
				_id: '',
				externalId: partId,
				name: parsedCue.design,
				enable: {
					start: parsedCue.start ? CalculateTime(parsedCue.start) : 0
				},
				outputLayerId: 'sec',
				sourceLayerId: SourceLayer.PgmDesign,
				infiniteMode: PieceLifespan.Infinite,
				content: literal<GraphicsContent>({
					fileName: parsedCue.design,
					path: parsedCue.design,
					timelineObjects: _.compact<TSRTimelineObj>([
						literal<TimelineObjVIZMSEElementInternal>({
							id: '',
							enable: { start: 0 },
							priority: 100,
							layer: VizLLayer.VizLLayerDesign,
							content: {
								deviceType: DeviceType.VIZMSE,
								type: TimelineContentTypeVizMSE.ELEMENT_INTERNAL,
								templateName: parsedCue.design,
								templateData: []
							}
						})
					])
				})
			})
		)
	}
}
