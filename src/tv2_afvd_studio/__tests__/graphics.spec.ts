import { IBlueprintRundownDB, PieceLifespan, PlaylistTimingType, TSR } from '@tv2media/blueprints-integration'
import {
	CueDefinition,
	CueDefinitionBackgroundLoop,
	CueDefinitionGraphic,
	CueDefinitionGraphicDesign,
	CueDefinitionUnpairedPilot,
	CueDefinitionUnpairedTarget,
	GraphicInternal,
	GraphicPilot,
	literal,
	PartDefinition,
	RemoteType
} from 'tv2-common'
import { CueType, PartType, SharedGraphicLLayer, SharedOutputLayers, SourceType } from 'tv2-constants'
import { SegmentUserContext } from '../../__mocks__/context'
import { defaultShowStyleConfig, defaultStudioConfig } from '../../tv2_afvd_showstyle/__tests__/configs'
import { getConfig, parseConfig as parseShowStyleConfig } from '../../tv2_afvd_showstyle/helpers/config'
import { SourceLayer } from '../../tv2_afvd_showstyle/layers'
import { CreatePartGrafik } from '../../tv2_afvd_showstyle/parts/grafik'
import { CreatePartUnknown } from '../../tv2_afvd_showstyle/parts/unknown'
import { parseConfig as parseStudioConfig } from '../helpers/config'
import { AtemLLayer, CasparLLayer } from '../layers'
import mappingsDefaults from '../migrations/mappings-defaults'

const RUNDOWN_EXTERNAL_ID = 'TEST.SOFIE.JEST'
const SEGMENT_EXTERNAL_ID = '00000000'

function makeMockContext() {
	const rundown = literal<IBlueprintRundownDB>({
		externalId: RUNDOWN_EXTERNAL_ID,
		name: RUNDOWN_EXTERNAL_ID,
		_id: '',
		showStyleVariantId: '',
		timing: {
			type: PlaylistTimingType.None
		}
	})
	const mockContext = new SegmentUserContext(
		'mock_context',
		mappingsDefaults,
		parseStudioConfig,
		parseShowStyleConfig,
		rundown._id
	)
	mockContext.studioConfig = defaultStudioConfig as any
	mockContext.showStyleConfig = defaultShowStyleConfig as any

	return mockContext
}

describe('Graphics', () => {
	it('Throws warning for unpaired target and creates invalid part', async () => {
		const context = makeMockContext()
		const config = getConfig(context)

		const cues: CueDefinition[] = [
			literal<CueDefinitionUnpairedTarget>({
				type: CueType.UNPAIRED_TARGET,
				target: 'FULL',
				iNewsCommand: 'GRAFIK'
			})
		]

		const partDefintion: PartDefinition = literal<PartDefinition>({
			type: PartType.Grafik,
			externalId: '',
			segmentExternalId: SEGMENT_EXTERNAL_ID,
			rawType: '',
			cues,
			script: '',
			fields: {},
			modified: 0,
			storyName: ''
		})

		const result = await CreatePartGrafik(context, config, partDefintion, 0)

		expect(context.getNotes().map(msg => msg.message)).toEqual([`No graphic found after GRAFIK cue`])
		expect(result.pieces).toHaveLength(0)
		expect(result.adLibPieces).toHaveLength(0)
		expect(result.actions).toHaveLength(0)
		expect(result.part.invalid).toBe(true)
	})

	it('Throws warning for unpaired pilot', () => {
		const context = makeMockContext()
		const config = getConfig(context)

		const cues: CueDefinition[] = [
			literal<CueDefinitionUnpairedPilot>({
				type: CueType.UNPAIRED_PILOT,
				name: '',
				vcpid: 1234567890,
				continueCount: -1,
				iNewsCommand: ''
			})
		]

		const partDefinition: PartDefinition = literal<PartDefinition>({
			type: PartType.Grafik,
			externalId: '',
			segmentExternalId: SEGMENT_EXTERNAL_ID,
			rawType: '',
			cues,
			script: '',
			fields: {},
			modified: 0,
			storyName: ''
		})

		CreatePartGrafik(context, config, partDefinition, 0)

		expect(context.getNotes().map(msg => msg.message)).toEqual([`Graphic found without target engine`])
	})

	it('Creates FULL graphic correctly', async () => {
		const context = makeMockContext()
		const config = getConfig(context)

		const cues: CueDefinition[] = [
			literal<CueDefinitionGraphic<GraphicPilot>>({
				type: CueType.Graphic,
				target: 'FULL',
				graphic: {
					type: 'pilot',
					name: '',
					vcpid: 1234567890,
					continueCount: -1
				},
				iNewsCommand: 'GRAFIK'
			})
		]

		const partDefinition: PartDefinition = literal<PartDefinition>({
			type: PartType.Grafik,
			externalId: '',
			segmentExternalId: SEGMENT_EXTERNAL_ID,
			rawType: '',
			cues,
			script: '',
			fields: {},
			modified: 0,
			storyName: ''
		})

		const result = await CreatePartGrafik(context, config, partDefinition, 0)
		expect(result.pieces).toHaveLength(2)
		const piece = result.pieces[0]
		expect(piece.sourceLayerId).toBe(SourceLayer.PgmPilot)
		expect(piece.outputLayerId).toBe(SharedOutputLayers.PGM)
		expect(piece.enable).toEqual({ start: 0 })
		// expect(piece.prerollDuration).toBe(config.studio.VizPilotGraphics.PrerollDuration)
		expect(piece.lifespan).toBe(PieceLifespan.WithinPart)
		const content = piece.content!
		const timeline = content.timelineObjects as TSR.TSRTimelineObj[]
		expect(timeline).toHaveLength(5)
		const vizObj = timeline.find(
			t =>
				t.content.deviceType === TSR.DeviceType.VIZMSE && t.content.type === TSR.TimelineContentTypeVizMSE.ELEMENT_PILOT
		)! as TSR.TimelineObjVIZMSEElementPilot
		expect(vizObj.enable).toEqual({ start: 0 })
		expect(vizObj.layer).toEqual(SharedGraphicLLayer.GraphicLLayerPilot)
		expect(vizObj.content.channelName).toBe('FULL1') // TODO: FULL1: Enum / Type
		expect(vizObj.content.templateVcpId).toBe(1234567890)
		expect(vizObj.content.continueStep).toBe(-1)
		expect(vizObj.content.delayTakeAfterOutTransition).toBe(true)
		expect(vizObj.content.outTransition).toEqual({
			type: TSR.VIZMSETransitionType.DELAY,
			delay: config.studio.VizPilotGraphics.OutTransitionDuration
		})
		expect(vizObj.classes).toEqual(['full'])
	})

	it('Creates OVL pilot graphic correctly', async () => {
		const context = makeMockContext()
		const config = getConfig(context)

		const cues: CueDefinition[] = [
			literal<CueDefinitionGraphic<GraphicPilot>>({
				type: CueType.Graphic,
				target: 'OVL',
				graphic: {
					type: 'pilot',
					name: '',
					vcpid: 1234567890,
					continueCount: -1
				},
				iNewsCommand: 'GRAFIK',
				start: {
					seconds: 2
				},
				end: {
					infiniteMode: 'O'
				}
			})
		]

		const partDefinition: PartDefinition = literal<PartDefinition>({
			type: PartType.Grafik,
			externalId: '',
			segmentExternalId: SEGMENT_EXTERNAL_ID,
			rawType: '',
			cues,
			script: '',
			fields: {},
			modified: 0,
			storyName: ''
		})

		const result = await CreatePartGrafik(context, config, partDefinition, 0)
		expect(result.pieces).toHaveLength(1)
		const piece = result.pieces[0]
		expect(piece.sourceLayerId).toBe(SourceLayer.PgmPilotOverlay)
		expect(piece.outputLayerId).toBe(SharedOutputLayers.OVERLAY)
		expect(piece.enable).toEqual({ start: 2000 })
		expect(piece.prerollDuration).toBe(config.studio.VizPilotGraphics.PrerollDuration)
		expect(piece.lifespan).toBe(PieceLifespan.OutOnShowStyleEnd)
		const content = piece.content!
		const timeline = content.timelineObjects as TSR.TSRTimelineObj[]
		expect(timeline).toHaveLength(1)
		const vizObj = timeline.find(
			t =>
				t.content.deviceType === TSR.DeviceType.VIZMSE && t.content.type === TSR.TimelineContentTypeVizMSE.ELEMENT_PILOT
		)! as TSR.TimelineObjVIZMSEElementPilot
		expect(vizObj.enable).toEqual({ while: '!.full' })
		expect(vizObj.layer).toEqual(SharedGraphicLLayer.GraphicLLayerPilotOverlay)
		expect(vizObj.content.channelName).toBe('OVL1') // TODO: OVL1: Enum / Type
		expect(vizObj.content.templateVcpId).toBe(1234567890)
		expect(vizObj.content.continueStep).toBe(-1)
		expect(vizObj.content.delayTakeAfterOutTransition).toBe(true)
		expect(vizObj.content.outTransition).toEqual({
			delay: config.studio.VizPilotGraphics.OutTransitionDuration,
			type: TSR.VIZMSETransitionType.DELAY
		})
	})

	it('Creates WALL graphic correctly', async () => {
		const context = makeMockContext()
		const config = getConfig(context)

		const cues: CueDefinition[] = [
			literal<CueDefinitionGraphic<GraphicPilot>>({
				type: CueType.Graphic,
				target: 'WALL',
				graphic: {
					type: 'pilot',
					name: '',
					vcpid: 1234567890,
					continueCount: -1
				},
				iNewsCommand: 'GRAFIK'
			})
		]

		const partDefinition: PartDefinition = literal<PartDefinition>({
			type: PartType.Grafik,
			externalId: '',
			segmentExternalId: SEGMENT_EXTERNAL_ID,
			rawType: '',
			cues,
			script: '',
			fields: {},
			modified: 0,
			storyName: ''
		})

		const result = await CreatePartGrafik(context, config, partDefinition, 0)
		expect(result.pieces).toHaveLength(1)
		const piece = result.pieces[0]
		expect(piece.sourceLayerId).toBe(SourceLayer.WallGraphics)
		expect(piece.outputLayerId).toBe(SharedOutputLayers.SEC)
		expect(piece.enable).toEqual({ start: 0 })
		expect(piece.prerollDuration).toBe(config.studio.VizPilotGraphics.PrerollDuration)
		expect(piece.lifespan).toBe(PieceLifespan.OutOnShowStyleEnd)
		const content = piece.content!
		const timeline = content.timelineObjects as TSR.TSRTimelineObj[]
		expect(timeline).toHaveLength(1)
		const vizObj = timeline.find(
			t =>
				t.content.deviceType === TSR.DeviceType.VIZMSE && t.content.type === TSR.TimelineContentTypeVizMSE.ELEMENT_PILOT
		)! as TSR.TimelineObjVIZMSEElementPilot
		expect(vizObj.enable).toEqual({ while: '1' })
		expect(vizObj.layer).toEqual(SharedGraphicLLayer.GraphicLLayerWall)
		expect(vizObj.content.channelName).toBe('WALL1') // TODO: OVL1: Enum / Type
		expect(vizObj.content.templateVcpId).toBe(1234567890)
		expect(vizObj.content.continueStep).toBe(-1)
		expect(vizObj.content.delayTakeAfterOutTransition).toBe(undefined)
		expect(vizObj.content.outTransition).toEqual(undefined)
	})

	it('Creates TLF graphic correctly', async () => {
		const context = makeMockContext()
		const config = getConfig(context)

		const cues: CueDefinition[] = [
			literal<CueDefinitionGraphic<GraphicPilot>>({
				type: CueType.Graphic,
				target: 'TLF',
				graphic: {
					type: 'pilot',
					name: '',
					vcpid: 1234567890,
					continueCount: -1
				},
				iNewsCommand: 'TLF'
			})
		]

		const partDefinition: PartDefinition = literal<PartDefinition>({
			type: PartType.Grafik,
			externalId: '',
			segmentExternalId: SEGMENT_EXTERNAL_ID,
			rawType: '',
			cues,
			script: '',
			fields: {},
			modified: 0,
			storyName: ''
		})

		const result = await CreatePartGrafik(context, config, partDefinition, 0)
		expect(result.pieces).toHaveLength(2)
		const piece = result.pieces[0]
		expect(piece.sourceLayerId).toBe(SourceLayer.PgmGraphicsTLF)
		expect(piece.outputLayerId).toBe(SharedOutputLayers.PGM)
		expect(piece.enable).toEqual({ start: 0 })
		expect(piece.prerollDuration).toBe(config.studio.VizPilotGraphics.PrerollDuration)
		expect(piece.lifespan).toBe(PieceLifespan.WithinPart)
		const content = piece.content!
		const timeline = content.timelineObjects as TSR.TSRTimelineObj[]
		expect(timeline).toHaveLength(5)
		const vizObj = timeline.find(
			t =>
				t.content.deviceType === TSR.DeviceType.VIZMSE && t.content.type === TSR.TimelineContentTypeVizMSE.ELEMENT_PILOT
		)! as TSR.TimelineObjVIZMSEElementPilot
		expect(vizObj.enable).toEqual({ start: 0 })
		expect(vizObj.layer).toEqual(SharedGraphicLLayer.GraphicLLayerPilot)
		expect(vizObj.content.channelName).toBe('FULL1') // TODO: FULL1: Enum / Type
		expect(vizObj.content.templateVcpId).toBe(1234567890)
		expect(vizObj.content.continueStep).toBe(-1)
		expect(vizObj.content.delayTakeAfterOutTransition).toBe(true)
		expect(vizObj.content.outTransition).toEqual({
			type: TSR.VIZMSETransitionType.DELAY,
			delay: config.studio.VizPilotGraphics.OutTransitionDuration
		})
		expect(vizObj.classes).toEqual(['full'])
	})

	it('Routes source to engine', async () => {
		const context = makeMockContext()
		const config = getConfig(context)

		const cues: CueDefinition[] = [
			literal<CueDefinitionGraphic<GraphicPilot>>({
				type: CueType.Graphic,
				target: 'TLF',
				routing: {
					type: CueType.Routing,
					target: 'TLF',
					INP1: { sourceType: SourceType.REMOTE, id: '1', name: 'LIVE 1', raw: 'LIVE 1', remoteType: RemoteType.LIVE },
					iNewsCommand: ''
				},
				graphic: {
					type: 'pilot',
					name: '',
					vcpid: 1234567890,
					continueCount: -1
				},
				iNewsCommand: 'TLF'
			})
		]

		const partDefinition: PartDefinition = literal<PartDefinition>({
			type: PartType.Grafik,
			externalId: '',
			segmentExternalId: SEGMENT_EXTERNAL_ID,
			rawType: '',
			cues,
			script: '',
			fields: {},
			modified: 0,
			storyName: ''
		})

		const result = await CreatePartGrafik(context, config, partDefinition, 0)
		expect(result.pieces).toHaveLength(3)
		const auxPiece = result.pieces.find(p => p.outputLayerId === SharedOutputLayers.AUX)!
		expect(auxPiece.enable).toEqual({ start: 0 })
		expect(auxPiece.sourceLayerId).toBe(SourceLayer.VizFullIn1)
		expect(auxPiece.lifespan).toBe(PieceLifespan.WithinPart)
		const auxObj = (auxPiece.content?.timelineObjects as TSR.TSRTimelineObj[]).find(
			obj => obj.content.deviceType === TSR.DeviceType.ATEM && obj.content.type === TSR.TimelineContentTypeAtem.AUX
		) as TSR.TimelineObjAtemAUX | undefined
		expect(auxObj).toBeTruthy()
		expect(auxObj?.enable).toEqual({ start: 0 })
		expect(auxObj?.layer).toBe(AtemLLayer.AtemAuxVizOvlIn1)
		expect(auxObj?.content.aux.input).toBe(1)
	})

	it('Creates design element', async () => {
		const context = makeMockContext()
		const config = getConfig(context)

		const cues: CueDefinition[] = [
			literal<CueDefinitionGraphicDesign>({
				type: CueType.GraphicDesign,
				design: 'DESIGN_FODBOLD',
				iNewsCommand: 'KG'
			})
		]

		const partDefinition: PartDefinition = literal<PartDefinition>({
			type: PartType.Unknown,
			externalId: '',
			segmentExternalId: SEGMENT_EXTERNAL_ID,
			rawType: '',
			cues,
			script: '',
			fields: {},
			modified: 0,
			storyName: ''
		})

		const result = await CreatePartUnknown(context, config, partDefinition, 0)
		expect(result.pieces).toHaveLength(1)
		const piece = result.pieces[0]
		expect(piece).toBeTruthy()
		expect(piece.outputLayerId).toBe(SharedOutputLayers.SEC)
		expect(piece.sourceLayerId).toBe(SourceLayer.PgmDesign)
		expect(piece.lifespan).toBe(PieceLifespan.OutOnShowStyleEnd)
		expect(piece.enable).toEqual({ start: 0 })
	})

	it('Creates background loop', async () => {
		const context = makeMockContext()
		const config = getConfig(context)

		const cues: CueDefinition[] = [
			literal<CueDefinitionBackgroundLoop>({
				type: CueType.BackgroundLoop,
				target: 'DVE',
				backgroundLoop: 'DESIGN_SC',
				iNewsCommand: 'VIZ'
			})
		]

		const partDefinition: PartDefinition = literal<PartDefinition>({
			type: PartType.Unknown,
			externalId: '',
			segmentExternalId: SEGMENT_EXTERNAL_ID,
			rawType: '',
			cues,
			script: '',
			fields: {},
			modified: 0,
			storyName: ''
		})

		const result = await CreatePartUnknown(context, config, partDefinition, 0)
		expect(result.pieces).toHaveLength(1)
		const piece = result.pieces[0]
		expect(piece).toBeTruthy()
		expect(piece.name).toBe('DESIGN_SC')
		expect(piece.outputLayerId).toBe(SharedOutputLayers.SEC)
		expect(piece.sourceLayerId).toBe(SourceLayer.PgmDVEBackground)
		expect(piece.lifespan).toBe(PieceLifespan.OutOnShowStyleEnd)
		const tlObj = (piece.content?.timelineObjects as TSR.TSRTimelineObj[]).find(
			obj =>
				obj.content.deviceType === TSR.DeviceType.CASPARCG && obj.content.type === TSR.TimelineContentTypeCasparCg.MEDIA
		) as TSR.TimelineObjCCGMedia | undefined
		expect(tlObj).toBeTruthy()
		expect(tlObj?.layer).toBe(CasparLLayer.CasparCGDVELoop)
		expect(tlObj?.content.file).toBe('dve/DESIGN_SC')
		expect(tlObj?.content.loop).toBe(true)
	})

	it('Creates overlay internal graphic', async () => {
		const context = makeMockContext()
		const config = getConfig(context)

		const cues: CueDefinition[] = [
			literal<CueDefinitionGraphic<GraphicInternal>>({
				type: CueType.Graphic,
				target: 'OVL',
				graphic: {
					type: 'internal',
					template: 'bund',
					cue: '#kg',
					textFields: ['Some Person', 'Some Info']
				},
				iNewsCommand: '#kg',
				start: {
					seconds: 5
				}
			})
		]

		const partDefinition: PartDefinition = literal<PartDefinition>({
			type: PartType.Unknown,
			externalId: '',
			segmentExternalId: SEGMENT_EXTERNAL_ID,
			rawType: '',
			cues,
			script: '',
			fields: {},
			modified: 0,
			storyName: ''
		})

		const result = await CreatePartUnknown(context, config, partDefinition, 0)
		expect(result.pieces).toHaveLength(1)
		const piece = result.pieces[0]
		expect(piece).toBeTruthy()
		expect(piece.enable).toEqual({ start: 5000, duration: 4000 })
		expect(piece.outputLayerId).toBe(SharedOutputLayers.OVERLAY)
		expect(piece.sourceLayerId).toBe(SourceLayer.PgmGraphicsLower)
		expect(piece.lifespan).toBe(PieceLifespan.WithinPart)
		const tlObj = (piece.content?.timelineObjects as TSR.TSRTimelineObj[]).find(
			obj =>
				obj.content.deviceType === TSR.DeviceType.VIZMSE &&
				obj.content.type === TSR.TimelineContentTypeVizMSE.ELEMENT_INTERNAL
		) as TSR.TimelineObjVIZMSEElementInternal | undefined
		expect(tlObj).toBeTruthy()
		expect(tlObj?.layer).toBe(SharedGraphicLLayer.GraphicLLayerOverlayLower)
		expect(tlObj?.content.templateName).toBe('bund')
		expect(tlObj?.content.templateData).toStrictEqual(['Some Person', 'Some Info'])
		expect(tlObj?.content.channelName).toBe('OVL1')
	})
})
