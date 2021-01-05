import {
	ActionExecutionContext,
	ActionUserData,
	IBlueprintPiece,
	PieceLifespan,
	TSR
} from 'tv-automation-sofie-blueprints-integration'
import { ActionClearGraphics, executeAction, GraphicLLayer, literal } from 'tv2-common'
import { TallyTags } from 'tv2-constants'
import _ = require('underscore')
import { AtemLLayer, CasparLLayer, SisyfosLLAyer, VirtualAbstractLLayer } from '../tv2_afvd_studio/layers'
import { getConfig } from './helpers/config'
import { AFVD_DVE_GENERATOR_OPTIONS } from './helpers/content/dve'
import { EvaluateCues } from './helpers/pieces/evaluateCues'
import { createJingleContentAFVD } from './helpers/pieces/jingle'
import { SourceLayer } from './layers'
import { postProcessPieceTimelineObjects } from './postProcessTimelineObjects'

const STOPPABLE_GRAPHICS_LAYERS = [
	SourceLayer.PgmGraphicsIdent,
	SourceLayer.PgmGraphicsIdentPersistent,
	SourceLayer.PgmGraphicsTop,
	SourceLayer.PgmGraphicsLower,
	SourceLayer.PgmGraphicsHeadline,
	SourceLayer.PgmGraphicsTema,
	SourceLayer.PgmGraphicsOverlay,
	SourceLayer.PgmPilotOverlay,
	SourceLayer.PgmGraphicsTLF
]

export function executeActionAFVD(context: ActionExecutionContext, actionId: string, userData: ActionUserData): void {
	executeAction(
		context,
		{
			getConfig,
			postProcessPieceTimelineObjects,
			EvaluateCues,
			DVEGeneratorOptions: AFVD_DVE_GENERATOR_OPTIONS,
			SourceLayers: {
				Server: SourceLayer.PgmServer,
				VO: SourceLayer.PgmVoiceOver,
				DVE: SourceLayer.PgmDVE,
				DVEAdLib: SourceLayer.PgmDVEAdLib,
				Cam: SourceLayer.PgmCam,
				Live: SourceLayer.PgmLive,
				Effekt: SourceLayer.PgmJingle,
				EVS: SourceLayer.PgmDelayed
			},
			OutputLayer: {
				PGM: 'pgm',
				EFFEKT: 'jingle'
			},
			LLayer: {
				Caspar: {
					ClipPending: CasparLLayer.CasparPlayerClipPending,
					Effekt: CasparLLayer.CasparPlayerJingle
				},
				Sisyfos: {
					ClipPending: SisyfosLLAyer.SisyfosSourceClipPending,
					Effekt: SisyfosLLAyer.SisyfosSourceJingle,
					StudioMics: SisyfosLLAyer.SisyfosGroupStudioMics,
					PersistedLevels: SisyfosLLAyer.SisyfosPersistedLevels
				},
				Atem: {
					MEProgram: AtemLLayer.AtemMEProgram,
					MEClean: AtemLLayer.AtemMEClean,
					Next: AtemLLayer.AtemAuxLookahead,
					SSrcDefault: AtemLLayer.AtemSSrcDefault,
					Effekt: AtemLLayer.AtemDSKEffect,
					cutOnclean: false
				},
				Abstract: {
					ServerEnable: VirtualAbstractLLayer.AbstractLLayerServerEnable
				}
			},
			SelectedAdlibs: {
				SourceLayer: {
					Server: SourceLayer.SelectedServer,
					VO: SourceLayer.SelectedVoiceOver
				},
				OutputLayer: {
					SelectedAdLib: 'sec'
				},
				SELECTED_ADLIB_LAYERS: [SourceLayer.SelectedServer, SourceLayer.SelectedVoiceOver]
			},
			ServerAudioLayers: [
				SisyfosLLAyer.SisyfosSourceClipPending,
				SisyfosLLAyer.SisyfosSourceServerA,
				SisyfosLLAyer.SisyfosSourceServerB
			],
			StoppableGraphicsLayers: STOPPABLE_GRAPHICS_LAYERS,
			executeActionClearGraphics,
			createJingleContent: createJingleContentAFVD
		},
		actionId,
		userData
	)
}

function executeActionClearGraphics(context: ActionExecutionContext, _actionId: string, userData: ActionClearGraphics) {
	context.stopPiecesOnLayers(STOPPABLE_GRAPHICS_LAYERS)
	context.insertPiece(
		'current',
		literal<IBlueprintPiece>({
			enable: {
				start: 'now',
				duration: 3000
			},
			externalId: 'clearAllGFX',
			name: userData.label,
			sourceLayerId: SourceLayer.PgmAdlibVizCmd,
			outputLayerId: 'sec',
			lifespan: PieceLifespan.WithinPart,
			content: {
				timelineObjects: _.compact<TSR.TSRTimelineObj>([
					literal<TSR.TimelineObjVIZMSEClearAllElements>({
						id: '',
						enable: {
							start: 0
						},
						priority: 100,
						layer: GraphicLLayer.GraphicLLayerAdLibs,
						content: {
							deviceType: TSR.DeviceType.VIZMSE,
							type: TSR.TimelineContentTypeVizMSE.CLEAR_ALL_ELEMENTS,
							channelsToSendCommands: userData.sendCommands ? ['OVL1', 'FULL1', 'WALL1'] : undefined
						}
					})
				])
			},
			tags: userData.sendCommands ? [TallyTags.GFX_CLEAR] : [TallyTags.GFX_ALTUD]
		})
	)
}
