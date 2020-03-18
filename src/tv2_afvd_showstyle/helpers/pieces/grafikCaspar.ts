import { IBlueprintAdLibPiece, IBlueprintPiece, PartContext } from 'tv-automation-sofie-blueprints-integration'
import { CueDefinitionGrafik, PartDefinition } from 'tv2-common'
import { Enablers } from 'tv2-constants'
import { BlueprintConfig } from '../../../tv2_afvd_showstyle/helpers/config'
import { SourceLayer } from '../../../tv2_afvd_showstyle/layers'
import { CreateAdlibServer } from './adlibServer'

export function EvaluateGrafikCaspar(
	config: BlueprintConfig,
	_context: PartContext,
	_pieces: IBlueprintPiece[],
	adlibPieces: IBlueprintAdLibPiece[],
	parsedCue: CueDefinitionGrafik,
	partDefinition: PartDefinition,
	adlib: boolean
) {
	if (config.showStyle.GFXTemplates) {
		const template = config.showStyle.GFXTemplates.find(
			templ =>
				templ.INewsName === parsedCue.template &&
				templ.INewsCode.toString()
					.replace(/=/gi, '')
					.toUpperCase() === parsedCue.cue.toUpperCase()
		)
		if (template) {
			console.log(JSON.stringify(template))
			if (template.IsDesign) {
				if (config.showStyle.IsOfftube) {
					return
				}
			}
		}
	}

	if (adlib) {
		const piece = CreateAdlibServer(
			config,
			0,
			partDefinition.externalId,
			partDefinition.externalId,
			partDefinition,
			parsedCue.template,
			false,
			false,
			Enablers.OFFTUBE_ENABLE_FULL
		)
		piece.sourceLayerId = SourceLayer.PgmGraphicsOverlay
		adlibPieces.push(piece)
	}
}
