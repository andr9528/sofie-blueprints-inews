import {
	GraphicsContent,
	IBlueprintActionManifest,
	IBlueprintAdLibPiece,
	IBlueprintPiece,
	PieceLifespan,
	TSR
} from 'tv-automation-sofie-blueprints-integration'
import {
	CalculateTime,
	CueDefinition,
	CueDefinitionGraphic,
	GetDefaultOut,
	GetFullGrafikTemplateNameFromCue,
	GetInfiniteModeForGrafik,
	GraphicInternal,
	GraphicInternalOrPilot,
	GraphicIsInternal,
	GraphicIsPilot,
	GraphicLLayer,
	GraphicPilot,
	literal,
	PartContext2,
	PartDefinition,
	PartToParentClass
} from 'tv2-common'
import { ControlClasses, GraphicEngine } from 'tv2-constants'
import { SourceLayer } from '../../layers'
import { BlueprintConfig } from '../config'

export function EvaluateCueGraphic(
	config: BlueprintConfig,
	context: PartContext2,
	pieces: IBlueprintPiece[],
	adlibPieces: IBlueprintAdLibPiece[],
	actions: IBlueprintActionManifest[],
	partId: string,
	parsedCue: CueDefinitionGraphic<GraphicInternalOrPilot>,
	adlib: boolean,
	partDefinition?: PartDefinition,
	rank?: number
) {
	if (GraphicIsInternal(parsedCue)) {
		EvaluateCueGraphicInternal(
			config,
			context,
			pieces,
			adlibPieces,
			actions,
			partId,
			parsedCue,
			adlib,
			partDefinition,
			rank
		)
	} else if (GraphicIsPilot(parsedCue)) {
		EvaluateCueGraphicPilot(parsedCue)
	}
}

function EvaluateCueGraphicInternal(
	config: BlueprintConfig,
	context: PartContext2,
	pieces: IBlueprintPiece[],
	adlibPieces: IBlueprintAdLibPiece[],
	_actions: IBlueprintActionManifest[],
	partId: string,
	parsedCue: CueDefinitionGraphic<GraphicInternal>,
	adlib: boolean,
	partDefinition?: PartDefinition,
	rank?: number
) {
	// Whether this graphic "sticks" to the source it was first assigned to.
	// e.g. if this is attached to Live 1, when Live 1 is recalled later in a segment,
	//  this graphic should be shown again.
	const isStickyIdent = !!parsedCue.graphic.template.match(/direkte/i)

	const mappedTemplate = GetFullGrafikTemplateNameFromCue(config, parsedCue)

	if (!mappedTemplate || !mappedTemplate.length) {
		context.warning(`No valid template found for ${parsedCue.graphic.template}`)
		return
	}

	const sourceLayerId =
		parsedCue.target === 'TLF'
			? SourceLayer.PgmGraphicsTLF
			: GetSourceLayerForGrafik(config, GetFullGrafikTemplateNameFromCue(config, parsedCue), isStickyIdent)

	const outputLayerId = parsedCue.target === 'WALL' ? 'sec' : 'overlay'

	if (adlib) {
		adlibPieces.push(
			literal<IBlueprintAdLibPiece>({
				_rank: rank || 0,
				externalId: partId,
				name: grafikName(config, parsedCue),
				sourceLayerId,
				outputLayerId,
				...(parsedCue.target === 'TLF' || (parsedCue.end && parsedCue.end.infiniteMode)
					? {}
					: { expectedDuration: CreateTimingGrafik(config, parsedCue).duration || GetDefaultOut(config) }),
				lifespan: GetInfiniteModeForGrafik(parsedCue.target, config, parsedCue, isStickyIdent),
				content: literal<GraphicsContent>({
					fileName: parsedCue.graphic.template,
					path: parsedCue.graphic.template,
					ignoreMediaObjectStatus: true,
					timelineObjects: literal<TSR.TimelineObjVIZMSEAny[]>([
						literal<TSR.TimelineObjVIZMSEElementInternal>({
							id: '',
							enable: GetEnableForGrafik(config, parsedCue.target, parsedCue, isStickyIdent, partDefinition),
							priority: 1,
							layer: GetTimelineLayerForGrafik(config, GetFullGrafikTemplateNameFromCue(config, parsedCue)),
							content: {
								deviceType: TSR.DeviceType.VIZMSE,
								type: TSR.TimelineContentTypeVizMSE.ELEMENT_INTERNAL,
								templateName: mappedTemplate,
								templateData: parsedCue.graphic.textFields,
								channelName: parsedCue.target === 'WALL' ? 'WALL1' : 'OVL1' // TODO: TranslateEngine
							}
						})
					])
				})
			})
		)
	} else {
		const piece = literal<IBlueprintPiece>({
			externalId: partId,
			name: grafikName(config, parsedCue),
			...(parsedCue.target === 'TLF' || parsedCue.target === 'WALL'
				? { enable: { start: 0 } }
				: {
						enable: {
							...CreateTimingGrafik(config, parsedCue, !isStickyIdent)
						}
				  }),
			outputLayerId,
			sourceLayerId,
			lifespan: GetInfiniteModeForGrafik(parsedCue.target, config, parsedCue, isStickyIdent),
			content: literal<GraphicsContent>({
				fileName: parsedCue.graphic.template,
				path: parsedCue.graphic.template,
				ignoreMediaObjectStatus: true,
				timelineObjects: literal<TSR.TimelineObjVIZMSEAny[]>([
					literal<TSR.TimelineObjVIZMSEElementInternal>({
						id: '',
						enable: GetEnableForGrafik(config, parsedCue.target, parsedCue, isStickyIdent, partDefinition),
						priority: 1,
						layer: GetTimelineLayerForGrafik(config, GetFullGrafikTemplateNameFromCue(config, parsedCue)),
						content: {
							deviceType: TSR.DeviceType.VIZMSE,
							type: TSR.TimelineContentTypeVizMSE.ELEMENT_INTERNAL,
							templateName: mappedTemplate,
							templateData: parsedCue.graphic.textFields,
							channelName: parsedCue.target === 'WALL' ? 'WALL1' : 'OVL1' // TODO: TranslateEngine
						}
					})
				])
			})
		})
		pieces.push(piece)

		if (
			sourceLayerId === SourceLayer.PgmGraphicsIdentPersistent &&
			(piece.lifespan === PieceLifespan.OutOnSegmentEnd || piece.lifespan === PieceLifespan.OutOnRundownEnd) &&
			isStickyIdent
		) {
			// Special case for the ident. We want it to continue to exist in case the Live gets shown again, but we dont want the continuation showing in the ui.
			// So we create the normal object on a hidden layer, and then clone it on another layer without content for the ui
			pieces.push(
				literal<IBlueprintPiece>({
					...piece,
					enable: { ...CreateTimingGrafik(config, parsedCue, true) }, // Allow default out for visual representation
					sourceLayerId: SourceLayer.PgmGraphicsIdent,
					lifespan: PieceLifespan.WithinPart,
					content: undefined
				})
			)
		}
	}
}

function EvaluateCueGraphicPilot(cue: CueDefinitionGraphic<GraphicPilot>) {}

export function GetEnableForGrafik(
	config: BlueprintConfig,
	engine: GraphicEngine,
	cue: CueDefinition,
	isStickyIdent: boolean,
	partDefinition?: PartDefinition
): { while: string } | { start: number } {
	if (engine === 'WALL') {
		return {
			while: '1'
		}
	}
	if (isStickyIdent) {
		return {
			while: `.${ControlClasses.ShowIdentGraphic} & !.full`
		}
	}

	if (cue.end && cue.end.infiniteMode && cue.end.infiniteMode === 'B' && partDefinition) {
		return { while: `.${PartToParentClass('studio0', partDefinition)} & !.adlib_deparent & !.full` }
	}

	if (config.studio.PreventOverlayWithFull) {
		return {
			while: '!.full'
		}
	} else {
		return {
			start: 0
		}
	}
}

export function GetSourceLayerForGrafik(config: BlueprintConfig, name: string, isStickyIdent: boolean) {
	const conf = config.showStyle.GFXTemplates
		? config.showStyle.GFXTemplates.find(gfk => gfk.VizTemplate.toString() === name)
		: undefined

	if (!conf) {
		return SourceLayer.PgmGraphicsOverlay
	}

	switch (conf.SourceLayer) {
		// TODO: When adding more sourcelayers
		// This is here to guard against bad user input
		case SourceLayer.PgmGraphicsHeadline:
			return SourceLayer.PgmGraphicsHeadline
		case SourceLayer.PgmGraphicsIdent:
			if (isStickyIdent) {
				return SourceLayer.PgmGraphicsIdentPersistent
			}

			return SourceLayer.PgmGraphicsIdent
		case SourceLayer.PgmGraphicsLower:
			return SourceLayer.PgmGraphicsLower
		case SourceLayer.PgmGraphicsOverlay:
			return SourceLayer.PgmGraphicsOverlay
		case SourceLayer.PgmGraphicsTLF:
			return SourceLayer.PgmGraphicsTLF
		case SourceLayer.PgmGraphicsTema:
			return SourceLayer.PgmGraphicsTema
		case SourceLayer.PgmGraphicsTop:
			return SourceLayer.PgmGraphicsTop
		case SourceLayer.WallGraphics:
			return SourceLayer.WallGraphics
		default:
			return SourceLayer.PgmGraphicsOverlay
	}
}

export function GetTimelineLayerForGrafik(config: BlueprintConfig, name: string) {
	const conf = config.showStyle.GFXTemplates
		? config.showStyle.GFXTemplates.find(gfk => gfk.VizTemplate.toString() === name)
		: undefined

	if (!conf) {
		return GraphicLLayer.GraphicLLayerDesign
	}

	switch (conf.LayerMapping) {
		// TODO: When adding more output layers
		case GraphicLLayer.GraphicLLayerOverlayIdent:
			return GraphicLLayer.GraphicLLayerOverlayIdent
		case GraphicLLayer.GraphicLLayerOverlayTopt:
			return GraphicLLayer.GraphicLLayerOverlayTopt
		case GraphicLLayer.GraphicLLayerOverlayLower:
			return GraphicLLayer.GraphicLLayerOverlayLower
		case GraphicLLayer.GraphicLLayerOverlayHeadline:
			return GraphicLLayer.GraphicLLayerOverlayHeadline
		case GraphicLLayer.GraphicLLayerOverlayTema:
			return GraphicLLayer.GraphicLLayerOverlayTema
		case GraphicLLayer.GraphicLLayerWall:
			return GraphicLLayer.GraphicLLayerWall
		default:
			return GraphicLLayer.GraphicLLayerOverlay
	}
}

export function grafikName(config: BlueprintConfig, parsedCue: CueDefinitionGraphic<GraphicInternalOrPilot>): string {
	if (GraphicIsInternal(parsedCue)) {
		return `${
			parsedCue.graphic.template ? `${GetFullGrafikTemplateNameFromCue(config, parsedCue)}` : ''
		}${parsedCue.graphic.textFields.filter(txt => !txt.match(/^;.\.../i)).map(txt => ` - ${txt}`)}`.replace(/,/gi, '')
	} else if (GraphicIsPilot(parsedCue)) {
		return `${parsedCue.graphic.name ? parsedCue.graphic.name : ''}`
	}

	// Shouldn't be possible
	return parsedCue.iNewsCommand
}

export function CreateTimingGrafik(
	config: BlueprintConfig,
	cue: CueDefinitionGraphic<GraphicInternalOrPilot>,
	defaultTime: boolean = true
): { start: number; duration?: number } {
	const ret: { start: number; duration?: number } = { start: 0, duration: 0 }
	const start = cue.start ? CalculateTime(cue.start) : 0
	start !== undefined ? (ret.start = start) : (ret.start = 0)

	const duration = GetGrafikDuration(config, cue, defaultTime)
	const end = cue.end
		? cue.end.infiniteMode
			? undefined
			: CalculateTime(cue.end)
		: duration
		? ret.start + duration
		: undefined
	ret.duration = end ? end - ret.start : undefined

	return ret
}

export function GetGrafikDuration(
	config: BlueprintConfig,
	cue: CueDefinitionGraphic<GraphicInternalOrPilot>,
	defaultTime: boolean
): number | undefined {
	if (config.showStyle.GFXTemplates) {
		if (GraphicIsInternal(cue)) {
			const template = config.showStyle.GFXTemplates.find(templ =>
				templ.INewsName ? templ.INewsName.toString().toUpperCase() === cue.graphic.template.toUpperCase() : false
			)
			if (template) {
				if (template.OutType && !template.OutType.toString().match(/default/i)) {
					return undefined
				}
			}
		} else if (GraphicIsPilot(cue)) {
			const template = config.showStyle.GFXTemplates.find(templ =>
				templ.INewsName
					? templ.INewsName.toString().toUpperCase() === cue.graphic.vcpid.toString().toUpperCase()
					: false
			)
			if (template) {
				if (template.OutType && !template.OutType.toString().match(/default/i)) {
					return undefined
				}
			}
		}
	}

	return defaultTime ? GetDefaultOut(config) : undefined
}
