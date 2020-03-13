import {
	IBlueprintAdLibPiece,
	IBlueprintPart,
	IBlueprintPiece,
	PartContext
} from 'tv-automation-sofie-blueprints-integration'
import { PartDefinition, PartType } from '../../common/inewsConversion/converters/ParseBody'
import { CueType } from '../../common/inewsConversion/converters/ParseCue'
import { literal } from '../../common/util'
import { BlueprintConfig } from '../helpers/config'
import { EvaluateCues } from '../helpers/pieces/evaluateCues'
import { AddScript } from '../helpers/pieces/script'
import { CreateEffektForpart, GetJinglePartProperties } from './effekt'
import { PartTime } from './time/partTime'

export function CreatePartUnknown(
	context: PartContext,
	config: BlueprintConfig,
	partDefinition: PartDefinition,
	totalWords: number,
	asAdlibs?: boolean
) {
	const partTime = PartTime(config, partDefinition, totalWords)

	let part = literal<IBlueprintPart>({
		externalId: partDefinition.externalId,
		title: PartType[partDefinition.type] + ' - ' + partDefinition.rawType,
		metaData: {},
		typeVariant: '',
		autoNext: false,
		expectedDuration: partTime
	})

	const adLibPieces: IBlueprintAdLibPiece[] = []
	const pieces: IBlueprintPiece[] = []

	part = { ...part, ...CreateEffektForpart(context, config, partDefinition, pieces) }

	EvaluateCues(context, config, pieces, adLibPieces, partDefinition.cues, partDefinition, asAdlibs)
	if (!asAdlibs) {
		AddScript(partDefinition, pieces, partTime)
	}
	part = { ...part, ...GetJinglePartProperties(context, config, partDefinition) }

	if (
		partDefinition.cues.filter(
			cue => cue.type === CueType.MOS || cue.type === CueType.Telefon || cue.type === CueType.TargetEngine
		).length &&
		!partDefinition.cues.filter(c => c.type === CueType.Jingle).length
	) {
		part.prerollDuration = config.studio.PilotPrerollDuration
		part.transitionKeepaliveDuration = config.studio.PilotKeepaliveDuration
			? Number(config.studio.PilotKeepaliveDuration)
			: 60000
	} else if (partDefinition.cues.filter(cue => cue.type === CueType.DVE).length) {
		part.prerollDuration = config.studio.CasparPrerollDuration
	}

	if (pieces.length === 0) {
		part.invalid = true
	}

	return {
		part,
		adLibPieces,
		pieces
	}
}
