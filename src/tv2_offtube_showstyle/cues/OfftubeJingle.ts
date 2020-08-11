import {
	IBlueprintActionManifest,
	IBlueprintAdLibPiece,
	IBlueprintPart,
	IBlueprintPiece,
	PieceLifespan
} from 'tv-automation-sofie-blueprints-integration'
import {
	CreateJingleContentBase,
	CueDefinitionJingle,
	GetJinglePartProperties,
	literal,
	PartContext2,
	PartDefinition
} from 'tv2-common'
import { AdlibTags } from 'tv2-constants'
import { OfftubeAtemLLayer, OfftubeCasparLLayer, OfftubeSisyfosLLayer } from '../../tv2_offtube_studio/layers'
import { OfftubeShowstyleBlueprintConfig } from '../helpers/config'
import { OfftubeSourceLayer } from '../layers'

export function OfftubeEvaluateJingle(
	context: PartContext2,
	config: OfftubeShowstyleBlueprintConfig,
	pieces: IBlueprintPiece[],
	adlibPieces: IBlueprintAdLibPiece[],
	_actions: IBlueprintActionManifest[],
	parsedCue: CueDefinitionJingle,
	part: PartDefinition,
	_adlib?: boolean,
	rank?: number,
	effekt?: boolean
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

	const p = GetJinglePartProperties(context, config, part)

	if (JSON.stringify(p) === JSON.stringify({})) {
		context.warning(`Could not create adlib for ${parsedCue.clip}`)
		return
	}

	const props = p as Pick<
		IBlueprintPart,
		'autoNext' | 'expectedDuration' | 'prerollDuration' | 'autoNextOverlap' | 'disableOutTransition'
	>

	adlibPieces.push(
		literal<IBlueprintAdLibPiece>({
			_rank: rank ?? 0,
			externalId: `${part.externalId}-JINGLE-adlib`,
			name: effekt ? `EFFEKT ${parsedCue.clip}` : parsedCue.clip,
			sourceLayerId: OfftubeSourceLayer.PgmJingle,
			outputLayerId: 'jingle',
			content: createJingleContent(config, file, jingle.LoadFirstFrame),
			toBeQueued: true,
			adlibAutoNext: props.autoNext,
			adlibAutoNextOverlap: props.autoNextOverlap,
			adlibPreroll: props.prerollDuration,
			expectedDuration: props.expectedDuration,
			adlibDisableOutTransition: false,
			lifespan: PieceLifespan.WithinPart,
			tags: [AdlibTags.OFFTUBE_100pc_SERVER, AdlibTags.ADLIB_KOMMENTATOR] // TODO: Maybe this should be different?
		})
	)

	pieces.push(
		literal<IBlueprintPiece>({
			externalId: `${part.externalId}-JINGLE`,
			name: effekt ? `EFFEKT ${parsedCue.clip}` : parsedCue.clip,
			enable: {
				start: 0
			},
			lifespan: PieceLifespan.WithinPart,
			outputLayerId: 'jingle',
			sourceLayerId: OfftubeSourceLayer.PgmJingle,
			content: createJingleContent(config, file, jingle.LoadFirstFrame)
		})
	)
}

function createJingleContent(config: OfftubeShowstyleBlueprintConfig, file: string, loadFirstFrame: boolean) {
	return CreateJingleContentBase(
		config,
		file,
		loadFirstFrame,
		{
			Caspar: {
				PlayerJingle: OfftubeCasparLLayer.CasparPlayerJingle,
				PlayerJingleLookahead: OfftubeCasparLLayer.CasparPlayerJingleLookahead
			},
			ATEM: {
				DSKJingle: OfftubeAtemLLayer.AtemDSKGraphics,
				USKJinglePreview: OfftubeAtemLLayer.AtemMENextJingle
			},
			Sisyfos: {
				PlayerJingle: OfftubeSisyfosLLayer.SisyfosSourceJingle
			},
			basePath: config.studio.JingleBasePath
		},
		true
	)
}
