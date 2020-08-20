import {
	IBlueprintActionManifest,
	IBlueprintAdLibPiece,
	IBlueprintPiece,
	PieceLifespan
} from 'tv-automation-sofie-blueprints-integration'
import {
	ActionSelectJingle,
	CreateJingleContentBase,
	CueDefinitionJingle,
	GetJinglePartProperties,
	GetTagForJingle,
	GetTagForJingleNext,
	literal,
	PartContext2,
	PartDefinition
} from 'tv2-common'
import { AdlibActionType, AdlibTags } from 'tv2-constants'
import { OfftubeAtemLLayer, OfftubeCasparLLayer, OfftubeSisyfosLLayer } from '../../tv2_offtube_studio/layers'
import { OfftubeShowstyleBlueprintConfig } from '../helpers/config'
import { OfftubeOutputLayers, OfftubeSourceLayer } from '../layers'

export function OfftubeEvaluateJingle(
	context: PartContext2,
	config: OfftubeShowstyleBlueprintConfig,
	pieces: IBlueprintPiece[],
	_adlibPieces: IBlueprintAdLibPiece[],
	actions: IBlueprintActionManifest[],
	parsedCue: CueDefinitionJingle,
	part: PartDefinition,
	_adlib?: boolean,
	_rank?: number,
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

	actions.push(
		literal<IBlueprintActionManifest>({
			actionId: AdlibActionType.SELECT_JINGLE,
			userData: literal<ActionSelectJingle>({
				type: AdlibActionType.SELECT_JINGLE,
				clip: parsedCue.clip,
				segmentExternalId: part.segmentExternalId
			}),
			userDataManifest: {},
			display: {
				label: effekt ? `EFFEKT ${parsedCue.clip}` : parsedCue.clip,
				sourceLayerId: OfftubeSourceLayer.PgmJingle,
				outputLayerId: OfftubeOutputLayers.JINGLE,
				content: { ...createJingleContentOfftube(config, file, jingle.LoadFirstFrame), timelineObjects: [] },
				tags: [AdlibTags.OFFTUBE_100pc_SERVER, AdlibTags.ADLIB_KOMMENTATOR],
				onAirTags: [GetTagForJingle(part.segmentExternalId, parsedCue.clip)],
				setNextTags: [GetTagForJingleNext(part.segmentExternalId, parsedCue.clip)]
			}
		})
	)

	pieces.push(
		literal<IBlueprintPiece>({
			_id: '',
			externalId: `${part.externalId}-JINGLE`,
			name: effekt ? `EFFEKT ${parsedCue.clip}` : parsedCue.clip,
			enable: {
				start: 0
			},
			infiniteMode: PieceLifespan.OutOnNextPart,
			outputLayerId: 'jingle',
			sourceLayerId: OfftubeSourceLayer.PgmJingle,
			content: createJingleContentOfftube(config, file, jingle.LoadFirstFrame)
		})
	)
}

export function createJingleContentOfftube(
	config: OfftubeShowstyleBlueprintConfig,
	file: string,
	loadFirstFrame: boolean
) {
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
