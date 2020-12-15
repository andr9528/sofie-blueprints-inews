import {
	IBlueprintActionManifest,
	IBlueprintAdLibPiece,
	SplitsContent,
	TimelineObjectCoreExt,
	TSR
} from 'tv-automation-sofie-blueprints-integration'
import {
	ActionSelectDVE,
	CreateAdlibServer,
	CueDefinitionAdLib,
	CueDefinitionDVE,
	GetDVETemplate,
	literal,
	PartContext2,
	PartDefinition,
	SanitizeString,
	TemplateIsValid
} from 'tv2-common'
import { AdlibActionType, AdlibTags, CueType } from 'tv2-constants'
import _ = require('underscore')
import { OfftubeAtemLLayer, OfftubeCasparLLayer, OfftubeSisyfosLLayer } from '../../tv2_offtube_studio/layers'
import { OfftubeMakeContentDVE } from '../content/OfftubeDVEContent'
import { OfftubeShowstyleBlueprintConfig } from '../helpers/config'
import { OfftubeOutputLayers, OfftubeSourceLayer } from '../layers'

export function OfftubeEvaluateAdLib(
	context: PartContext2,
	config: OfftubeShowstyleBlueprintConfig,
	_adLibPieces: IBlueprintAdLibPiece[],
	actions: IBlueprintActionManifest[],
	_partId: string,
	parsedCue: CueDefinitionAdLib,
	partDefinition: PartDefinition,
	rank: number
) {
	if (parsedCue.variant.match(/server/i)) {
		// Create server AdLib
		const file = partDefinition.fields.videoId

		if (!file) {
			return
		}

		const duration = Number(partDefinition.fields.tapeTime) * 1000 || 0

		actions.push(
			CreateAdlibServer(
				config,
				rank,
				SanitizeString(`adlib_server_${file}`),
				partDefinition,
				file,
				false,
				{
					PgmServer: OfftubeSourceLayer.PgmServer,
					PgmVoiceOver: OfftubeSourceLayer.PgmVoiceOver,
					Caspar: {
						ClipPending: OfftubeCasparLLayer.CasparPlayerClipPending
					},
					Sisyfos: {
						ClipPending: OfftubeSisyfosLLayer.SisyfosSourceClipPending
					},
					ATEM: {
						MEPGM: OfftubeAtemLLayer.AtemMEProgram
					},
					STICKY_LAYERS: config.stickyLayers,
					OutputLayerId: OfftubeOutputLayers.PGM,
					SourceLayerId: OfftubeSourceLayer.PgmServer
				},
				duration,
				{
					isOfftube: true,
					tagAsAdlib: true
				}
			)
		)
	} else {
		// DVE
		if (!parsedCue.variant) {
			return
		}

		const rawTemplate = GetDVETemplate(config.showStyle.DVEStyles, parsedCue.variant)
		if (!rawTemplate) {
			context.warning(`Could not find template ${parsedCue.variant}`)
			return
		}

		if (!TemplateIsValid(JSON.parse(rawTemplate.DVEJSON as string))) {
			context.warning(`Invalid DVE template ${parsedCue.variant}`)
			return
		}

		const cueDVE: CueDefinitionDVE = {
			type: CueType.DVE,
			template: parsedCue.variant,
			sources: parsedCue.inputs ? parsedCue.inputs : {},
			labels: parsedCue.bynavn ? [parsedCue.bynavn] : [],
			iNewsCommand: 'DVE'
		}

		const adlibContent = OfftubeMakeContentDVE(context, config, partDefinition, cueDVE, rawTemplate, false, true)

		let sticky: { [key: string]: { value: number; followsPrevious: boolean } } = {}

		adlibContent.stickyLayers.forEach(layer => {
			sticky = {
				...sticky,
				[layer]: {
					value: 1,
					followsPrevious: false
				}
			}
		})

		actions.push(
			literal<IBlueprintActionManifest>({
				actionId: AdlibActionType.SELECT_DVE,
				userData: literal<ActionSelectDVE>({
					type: AdlibActionType.SELECT_DVE,
					config: cueDVE,
					videoId: partDefinition.fields.videoId
				}),
				userDataManifest: {},
				display: {
					sourceLayerId: OfftubeSourceLayer.PgmDVE,
					outputLayerId: OfftubeOutputLayers.PGM,
					label: `${partDefinition.storyName}`,
					tags: [AdlibTags.ADLIB_KOMMENTATOR, AdlibTags.ADLIB_FLOW_PRODUCER],
					content: literal<SplitsContent>({
						...adlibContent.content,
						timelineObjects: []
					})
				}
			})
		)
	}
}

export function makeofftubeDVEIDsUniqueForFlow(timeline: TimelineObjectCoreExt[]): TimelineObjectCoreExt[] {
	const startIdObj = timeline.find(tlObj => tlObj.layer === OfftubeAtemLLayer.AtemSSrcDefault)

	if (!startIdObj) {
		return timeline
	}

	const startId = startIdObj.id

	if (!startId.length) {
		return timeline
	}

	const newId = `${startId}_flow`

	return timeline.map(tlObj => {
		const enable = _.clone(tlObj.enable) as TSR.Timeline.TimelineEnable

		if (enable.start && typeof enable.start === 'string') {
			enable.start = enable.start.replace(startId, newId)
		}

		return {
			...tlObj,
			id: tlObj.id.replace(startId, newId),
			enable
		}
	})
}
