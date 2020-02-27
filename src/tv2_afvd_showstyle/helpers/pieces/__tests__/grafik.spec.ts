import {
	DeviceType,
	TimelineContentTypeVizMSE,
	TimelineObjVIZMSEAny,
	TimelineObjVIZMSEElementInternal
} from 'timeline-state-resolver-types'
import {
	GraphicsContent,
	IBlueprintAdLibPiece,
	IBlueprintPiece,
	PieceLifespan
} from 'tv-automation-sofie-blueprints-integration'
import { SegmentContext } from '../../../../__mocks__/context'
import { literal } from '../../../../common/util'
import { defaultShowStyleConfig, defaultStudioConfig } from '../../../../tv2_afvd_showstyle/__tests__/configs'
import { PartContext2 } from '../../../../tv2_afvd_showstyle/getSegment'
import { PartDefinitionKam, PartType } from '../../../../tv2_afvd_showstyle/inewsConversion/converters/ParseBody'
import { CueDefinitionGrafik, CueType } from '../../../../tv2_afvd_showstyle/inewsConversion/converters/ParseCue'
import { SourceLayer } from '../../../../tv2_afvd_showstyle/layers'
import { StudioConfig } from '../../../../tv2_afvd_studio/helpers/config'
import { VizLLayer } from '../../../../tv2_afvd_studio/layers'
import mappingsDefaults from '../../../../tv2_afvd_studio/migrations/mappings-defaults'
import { ShowStyleConfig } from '../../config'
import { EvaluateGrafik } from '../grafik'

const mockContext = new SegmentContext(
	{
		_id: '',
		externalId: '',
		name: '',
		showStyleVariantId: ''
	},
	mappingsDefaults
)
mockContext.studioConfig = defaultStudioConfig as any
mockContext.showStyleConfig = defaultShowStyleConfig as any

const partContext = new PartContext2(mockContext, '00001')

const dummyPart = literal<PartDefinitionKam>({
	type: PartType.Kam,
	variant: {
		name: '1'
	},
	externalId: '0001',
	rawType: 'Kam 1',
	cues: [],
	script: '',
	storyName: '',
	fields: {},
	modified: 0
})

describe('grafik piece', () => {
	test('kg bund', () => {
		const cue: CueDefinitionGrafik = {
			type: CueType.Grafik,
			template: 'bund',
			cue: 'kg',
			textFields: ['Odense', 'Copenhagen'],
			start: {
				seconds: 0
			}
		}
		const pieces: IBlueprintPiece[] = []
		const adLibPieces: IBlueprintAdLibPiece[] = []
		const partId = '0000000001'
		EvaluateGrafik(
			{
				showStyle: (defaultShowStyleConfig as unknown) as ShowStyleConfig,
				studio: (defaultStudioConfig as unknown) as StudioConfig,
				sources: [],
				mediaPlayers: []
			},
			partContext,
			pieces,
			adLibPieces,
			partId,
			cue,
			cue.adlib ? cue.adlib : false,
			dummyPart,
			false
		)
		expect(pieces).toEqual([
			literal<IBlueprintPiece>({
				_id: '',
				externalId: partId,
				name: 'bund - Odense - Copenhagen',
				enable: {
					start: 0,
					duration: 4000
				},
				infiniteMode: PieceLifespan.Normal,
				outputLayerId: 'overlay',
				sourceLayerId: SourceLayer.PgmGraphicsOverlay,
				content: literal<GraphicsContent>({
					fileName: 'bund',
					path: 'bund',
					timelineObjects: literal<TimelineObjVIZMSEAny[]>([
						literal<TimelineObjVIZMSEElementInternal>({
							id: '',
							enable: {
								while: '!.full'
							},
							priority: 1,
							layer: VizLLayer.VizLLayerOverlay,
							content: {
								deviceType: DeviceType.VIZMSE,
								type: TimelineContentTypeVizMSE.ELEMENT_INTERNAL,
								templateName: 'bund',
								templateData: ['Odense', 'Copenhagen'],
								channelName: 'OVL1'
							}
						})
					])
				})
			})
		])
	})

	test('adlib kg bund', () => {
		const cue: CueDefinitionGrafik = {
			type: CueType.Grafik,
			template: 'bund',
			cue: 'kg',
			textFields: ['Odense', 'Copenhagen'],
			adlib: true
		}
		const pieces: IBlueprintPiece[] = []
		const adLibPieces: IBlueprintAdLibPiece[] = []
		const partId = '0000000001'
		EvaluateGrafik(
			{
				showStyle: (defaultShowStyleConfig as unknown) as ShowStyleConfig,
				studio: (defaultStudioConfig as unknown) as StudioConfig,
				sources: [],
				mediaPlayers: []
			},
			partContext,
			pieces,
			adLibPieces,
			partId,
			cue,
			cue.adlib ? cue.adlib : false,
			dummyPart,
			false
		)
		expect(adLibPieces).toEqual([
			literal<IBlueprintAdLibPiece>({
				_rank: 0,
				externalId: partId,
				name: 'bund - Odense - Copenhagen',
				infiniteMode: PieceLifespan.Normal,
				outputLayerId: 'overlay',
				sourceLayerId: SourceLayer.PgmGraphicsOverlay,
				expectedDuration: 4000,
				content: literal<GraphicsContent>({
					fileName: 'bund',
					path: 'bund',
					timelineObjects: literal<TimelineObjVIZMSEAny[]>([
						literal<TimelineObjVIZMSEElementInternal>({
							id: '',
							enable: {
								start: 0
							},
							priority: 1,
							layer: VizLLayer.VizLLayerOverlay,
							content: {
								deviceType: DeviceType.VIZMSE,
								type: TimelineContentTypeVizMSE.ELEMENT_INTERNAL,
								templateName: 'bund',
								templateData: ['Odense', 'Copenhagen'],
								channelName: 'OVL1'
							}
						})
					])
				})
			})
		])
	})

	test('kg bund length', () => {
		const cue: CueDefinitionGrafik = {
			type: CueType.Grafik,
			template: 'bund',
			cue: 'kg',
			textFields: ['Odense', 'Copenhagen'],
			start: {
				seconds: 10
			}
		}
		const pieces: IBlueprintPiece[] = []
		const adLibPieces: IBlueprintAdLibPiece[] = []
		const partId = '0000000001'
		EvaluateGrafik(
			{
				showStyle: (defaultShowStyleConfig as unknown) as ShowStyleConfig,
				studio: (defaultStudioConfig as unknown) as StudioConfig,
				sources: [],
				mediaPlayers: []
			},
			partContext,
			pieces,
			adLibPieces,
			partId,
			cue,
			cue.adlib ? cue.adlib : false,
			dummyPart,
			false
		)
		expect(pieces).toEqual([
			literal<IBlueprintPiece>({
				_id: '',
				externalId: partId,
				name: 'bund - Odense - Copenhagen',
				enable: {
					start: 10000,
					duration: 4000
				},
				infiniteMode: PieceLifespan.Normal,
				outputLayerId: 'overlay',
				sourceLayerId: SourceLayer.PgmGraphicsOverlay,
				content: literal<GraphicsContent>({
					fileName: 'bund',
					path: 'bund',
					timelineObjects: literal<TimelineObjVIZMSEAny[]>([
						literal<TimelineObjVIZMSEElementInternal>({
							id: '',
							enable: {
								while: '!.full'
							},
							priority: 1,
							layer: VizLLayer.VizLLayerOverlay,
							content: {
								deviceType: DeviceType.VIZMSE,
								type: TimelineContentTypeVizMSE.ELEMENT_INTERNAL,
								templateName: 'bund',
								templateData: ['Odense', 'Copenhagen'],
								channelName: 'OVL1'
							}
						})
					])
				})
			})
		])
	})

	test('kg bund infinite', () => {
		const cue: CueDefinitionGrafik = {
			type: CueType.Grafik,
			template: 'bund',
			cue: 'kg',
			textFields: ['Odense', 'Copenhagen'],
			start: {
				seconds: 10
			},
			end: {
				infiniteMode: 'B'
			}
		}
		const pieces: IBlueprintPiece[] = []
		const adLibPieces: IBlueprintAdLibPiece[] = []
		const partId = '0000000001'
		EvaluateGrafik(
			{
				showStyle: (defaultShowStyleConfig as unknown) as ShowStyleConfig,
				studio: (defaultStudioConfig as unknown) as StudioConfig,
				sources: [],
				mediaPlayers: []
			},
			partContext,
			pieces,
			adLibPieces,
			partId,
			cue,
			cue.adlib ? cue.adlib : false,
			dummyPart,
			false
		)
		expect(pieces).toEqual([
			literal<IBlueprintPiece>({
				_id: '',
				externalId: partId,
				name: 'bund - Odense - Copenhagen',
				enable: {
					start: 10000
				},
				infiniteMode: PieceLifespan.OutOnNextPart,
				outputLayerId: 'overlay',
				sourceLayerId: SourceLayer.PgmGraphicsOverlay,
				content: literal<GraphicsContent>({
					fileName: 'bund',
					path: 'bund',
					timelineObjects: literal<TimelineObjVIZMSEAny[]>([
						literal<TimelineObjVIZMSEElementInternal>({
							id: '',
							enable: {
								while: `.studio0_parent_camera_1 & !.adlib_deparent & !.full`
							},
							priority: 1,
							layer: VizLLayer.VizLLayerOverlay,
							content: {
								deviceType: DeviceType.VIZMSE,
								type: TimelineContentTypeVizMSE.ELEMENT_INTERNAL,
								templateName: 'bund',
								templateData: ['Odense', 'Copenhagen'],
								channelName: 'OVL1'
							}
						})
					])
				})
			})
		])
	})
})
