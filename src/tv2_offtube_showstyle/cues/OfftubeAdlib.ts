import {
	HackPartMediaObjectSubscription,
	IBlueprintActionManifest,
	ISegmentUserContext,
	SplitsContent,
	TimelineObjectCoreExt,
	TSR
} from '@tv2media/blueprints-integration'
import {
	ActionSelectDVE,
	CreateAdlibServer,
	CueDefinitionAdLib,
	CueDefinitionDVE,
	generateExternalId,
	GetDVETemplate,
	getUniquenessIdDVE,
	literal,
	PartDefinition,
	t,
	TemplateIsValid
} from 'tv2-common'
import { AdlibActionType, AdlibTags, CueType } from 'tv2-constants'
import _ = require('underscore')
import { OfftubeAtemLLayer, OfftubeCasparLLayer, OfftubeSisyfosLLayer } from '../../tv2_offtube_studio/layers'
import { OfftubeMakeContentDVE } from '../content/OfftubeDVEContent'
import { OfftubeShowstyleBlueprintConfig } from '../helpers/config'
import { OfftubeOutputLayers, OfftubeSourceLayer } from '../layers'

export async function OfftubeEvaluateAdLib(
	context: ISegmentUserContext,
	config: OfftubeShowstyleBlueprintConfig,
	actions: IBlueprintActionManifest[],
	mediaSubscriptions: HackPartMediaObjectSubscription[],
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

		actions.push(
			await CreateAdlibServer(
				context,
				config,
				rank,
				partDefinition,
				file,
				false,
				true,
				{
					SourceLayer: {
						PgmServer: OfftubeSourceLayer.PgmServer,
						SelectedServer: OfftubeSourceLayer.SelectedServer
					},
					Caspar: {
						ClipPending: OfftubeCasparLLayer.CasparPlayerClipPending
					},
					Sisyfos: {
						ClipPending: OfftubeSisyfosLLayer.SisyfosSourceClipPending
					},
					AtemLLayer: {
						MEPgm: OfftubeAtemLLayer.AtemMEClean
					},
					ATEM: {
						ServerLookaheadAux: OfftubeAtemLLayer.AtemAuxServerLookahead
					}
				},
				true
			)
		)

		mediaSubscriptions.push({ mediaId: file.toUpperCase() })
	} else {
		// DVE
		if (!parsedCue.variant) {
			return
		}

		const rawTemplate = GetDVETemplate(config.showStyle.DVEStyles, parsedCue.variant)
		if (!rawTemplate) {
			context.notifyUserWarning(`Could not find template ${parsedCue.variant}`)
			return
		}

		if (!TemplateIsValid(rawTemplate.DVEJSON)) {
			context.notifyUserWarning(`Invalid DVE template ${parsedCue.variant}`)
			return
		}

		const cueDVE: CueDefinitionDVE = {
			type: CueType.DVE,
			template: parsedCue.variant,
			sources: parsedCue.inputs ? parsedCue.inputs : {},
			labels: parsedCue.bynavn ? parsedCue.bynavn : [],
			iNewsCommand: 'DVE'
		}

		const adlibContent = OfftubeMakeContentDVE(context, config, partDefinition, cueDVE, rawTemplate, false, true)

		const userData: ActionSelectDVE = {
			type: AdlibActionType.SELECT_DVE,
			config: cueDVE,
			name: `DVE: ${cueDVE.template}`,
			videoId: partDefinition.fields.videoId,
			segmentExternalId: partDefinition.segmentExternalId
		}
		actions.push({
			externalId: generateExternalId(context, userData),
			actionId: AdlibActionType.SELECT_DVE,
			userData,
			userDataManifest: {},
			display: {
				sourceLayerId: OfftubeSourceLayer.PgmDVE,
				outputLayerId: OfftubeOutputLayers.PGM,
				uniquenessId: getUniquenessIdDVE(cueDVE),
				label: t(`${partDefinition.storyName}`),
				tags: [AdlibTags.ADLIB_KOMMENTATOR, AdlibTags.ADLIB_FLOW_PRODUCER],
				content: literal<SplitsContent>({
					...adlibContent.content
				})
			}
		})
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
