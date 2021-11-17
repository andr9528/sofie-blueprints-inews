import {
	BlueprintResultSegment,
	IBlueprintActionManifest,
	IBlueprintActionManifestDisplayContent,
	IngestSegment
} from '@sofie-automation/blueprints-integration'
import { INewsStory, literal, UnparsedCue } from 'tv2-common'
import { SharedSourceLayers } from 'tv2-constants'
import { SegmentUserContext } from '../../__mocks__/context'
import { defaultShowStyleConfig, defaultStudioConfig } from '../../tv2_afvd_showstyle/__tests__/configs'
import { parseConfig as parseStudioConfig } from '../../tv2_afvd_studio/helpers/config'
import mappingsDefaults from '../../tv2_afvd_studio/migrations/mappings-defaults'
import { getSegment } from '../getSegment'
import { parseConfig as parseShowStyleConfig } from '../helpers/config'
import { SourceLayer } from '../layers'

const SEGMENT_EXTERNAL_ID = '00000000'

function makeMockContext(preventOverlay?: boolean) {
	const mockContext = new SegmentUserContext('test', mappingsDefaults, parseStudioConfig, parseShowStyleConfig)
	mockContext.studioConfig =
		preventOverlay === undefined
			? defaultStudioConfig
			: ({ ...defaultStudioConfig, PreventOverlayWithFull: preventOverlay } as any)
	mockContext.showStyleConfig = defaultShowStyleConfig as any

	return mockContext
}

function makeIngestSegment(cues: UnparsedCue[], body: string) {
	return literal<IngestSegment>({
		externalId: SEGMENT_EXTERNAL_ID,
		name: 'TEST SEGMENT',
		rank: 0,
		parts: [],
		payload: {
			iNewsStory: literal<INewsStory>({
				id: '00000000',
				identifier: '00000000',
				locator: '01',
				fields: {
					title: 'TEST SEGMENT',
					modifyDate: '0',
					tapeTime: '0',
					audioTime: '0',
					totalTime: '0',
					cumeTime: '0',
					backTime: '0',
					pageNumber: '01'
				},
				meta: {},
				cues,
				body
			})
		}
	})
}

function expectNotesToBe(context: SegmentUserContext, notes: string[]) {
	expect(context.getNotes().map(msg => msg.message)).toEqual(notes)
}

function expectAllPartsToBeValid(result: BlueprintResultSegment) {
	const invalid = result.parts.filter(part => part.part.invalid === true)
	expect(invalid).toHaveLength(0)
}

describe('AFVD Blueprint', () => {
	it('Accepts KAM CS 3', () => {
		const ingestSegment = makeIngestSegment([], `\r\n<pi>Kam CS 3</pi>\r\n`)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)
		expectAllPartsToBeValid(result)

		const kamPart = result.parts[0]
		expect(kamPart).toBeTruthy()
		expect(kamPart.pieces).toHaveLength(1)
		expect(kamPart.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmJingle])
		expect(kamPart.pieces[0].name).toEqual('CS 3 (JINGLE)')
	})

	it('Accepts KAM CS3', () => {
		const ingestSegment = makeIngestSegment([], `\r\n<pi>Kam CS3</pi>\r\n`)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)
		expectAllPartsToBeValid(result)

		const kamPart = result.parts[0]
		expect(kamPart).toBeTruthy()
		expect(kamPart.pieces).toHaveLength(1)
		expect(kamPart.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmJingle])
		expect(kamPart.pieces[0].name).toEqual('CS 3 (JINGLE)')
	})

	it('Shows warning for Pilot without destination', () => {
		const ingestSegment = makeIngestSegment(
			[
				[
					'#cg4 pilotdata',
					'News/Citast/ARFG/LIVE/stoppoints_3',
					'VCPID=2547768',
					'ContinueCount=8',
					'News/Citat/ARFG/LIVE/stoppoints_3'
				]
			],
			`\r\n<pi>Kam 1</pi>\r\n<p>Some script</p>\r\n<p><a idref="0"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, ['Graphic found without target engine'])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)
		expectAllPartsToBeValid(result)

		const kamPart = result.parts[0]
		expect(kamPart).toBeTruthy()
		expect(kamPart.pieces).toHaveLength(2)
		expect(kamPart.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam, SharedSourceLayers.PgmScript])
		expect(kamPart.adLibPieces).toHaveLength(0)
		expect(kamPart.actions).toHaveLength(0)
	})

	it('Creates invalid part for standalone GRAFIK=FULL', () => {
		const ingestSegment = makeIngestSegment(
			[['GRAFIK=FULL']],
			`\r\n<pi>Kam 1</pi>\r\n<p>Some script</p>\r\n<p><a idref="0"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, ['No graphic found after GRAFIK cue'])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(2)

		const kamPart = result.parts[0]
		expect(kamPart).toBeTruthy()
		expect(kamPart.pieces).toHaveLength(2)
		expect(kamPart.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam, SharedSourceLayers.PgmScript])
		expect(kamPart.adLibPieces).toHaveLength(0)
		expect(kamPart.actions).toHaveLength(0)

		const fullPart = result.parts[1]
		expect(fullPart).toBeTruthy()
		expect(fullPart.part.invalid).toBe(true)
	})

	it('Creates graphic for GRAFIK=FULL with Pilot', () => {
		const ingestSegment = makeIngestSegment(
			[
				['GRAFIK=FULL'],
				[
					'#cg4 pilotdata',
					'News/Citast/ARFG/LIVE/stoppoints_3',
					'VCPID=2547768',
					'ContinueCount=8',
					'News/Citat/ARFG/LIVE/stoppoints_3'
				]
			],
			`\r\n<pi>Kam 1</pi>\r\n<p>Some script</p>\r\n<p><a idref="0"></a></p>\r\n<p><a idref="1"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(2)
		expectAllPartsToBeValid(result)

		const kamPart = result.parts[0]
		expect(kamPart).toBeTruthy()
		expect(kamPart.pieces).toHaveLength(2)
		expect(kamPart.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam, SharedSourceLayers.PgmScript])
		expect(kamPart.adLibPieces).toHaveLength(0)
		expect(kamPart.actions).toHaveLength(0)

		const fullPart = result.parts[1]
		expect(fullPart).toBeTruthy()
		expect(fullPart.pieces).toHaveLength(2)
		expect(fullPart.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmPilot,
			SharedSourceLayers.SelectedAdlibGraphicsFull
		])
		expect(fullPart.adLibPieces).toHaveLength(0)
		expect(fullPart.actions).toHaveLength(1)
		const fullAdlibAction = fullPart.actions![0] as IBlueprintActionManifest
		expect(fullAdlibAction).toBeTruthy()
		expect((fullAdlibAction.display as IBlueprintActionManifestDisplayContent).sourceLayerId).toBe(
			SharedSourceLayers.PgmPilot
		)
	})

	it("Doesn't merge MOSART=L with GRAFIK=FULL", () => {
		const ingestSegment = makeIngestSegment(
			[
				['GRAFIK=FULL'],
				[
					']] S3.0 M 0 [[',
					'cg4 ]] 1 YNYAB 0 [[ pilotdata',
					'LgfxWeb/-ETKAEM_07-05-2019_17:55:42/MOSART=L|M|O',
					'VCPID=2520177',
					'ContinueCount=-1',
					'LgfxWeb/-ETKAEM_07-05-2019_17:55:42/MOSART=L|M|O'
				]
			],
			`\r\n<pi>Kam 1</pi>\r\n<p>Some script</p>\r\n<p><a idref="0"></a></p>\r\n<p><a idref="1"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, ['No graphic found after GRAFIK cue'])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(2)

		const kamPart = result.parts[0]
		expect(kamPart).toBeTruthy()
		expect(kamPart.pieces).toHaveLength(2)
		expect(kamPart.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam, SharedSourceLayers.PgmScript])
		expect(kamPart.adLibPieces).toHaveLength(0)
		expect(kamPart.actions).toHaveLength(0)

		const fullPart = result.parts[1]
		expect(fullPart).toBeTruthy()
		expect(fullPart.part.invalid).toBe(true)
	})

	it('Creates full when cues are correct and shows warning when OVL with FULL is disabled', () => {
		const ingestSegment = makeIngestSegment(
			[
				['GRAFIK=FULL'],
				[
					'#cg4 pilotdata',
					'News/Citast/ARFG/LIVE/stoppoints_3',
					'VCPID=2547768',
					'ContinueCount=8',
					'News/Citat/ARFG/LIVE/stoppoints_3'
				],
				[
					']] S3.0 M 0 [[',
					'cg4 ]] 1 YNYAB 0 [[ pilotdata',
					'LgfxWeb/-ETKAEM_07-05-2019_17:55:42/MOSART=L|00:00|O',
					'VCPID=2520177',
					'ContinueCount=-1',
					'LgfxWeb/-ETKAEM_07-05-2019_17:55:42/MOSART=L|00:00|O'
				]
			],
			`\r\n<pi>Kam 1</pi>\r\n<p>Some script</p>\r\n<p><a idref="0"></a></p>\r\n<p><a idref="1"></a></p>\r\n<p><a idref="2"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, ['Cannot create overlay graphic with FULL'])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(2)
		expectAllPartsToBeValid(result)

		const kamPart = result.parts[0]
		expect(kamPart).toBeTruthy()
		expect(kamPart.pieces).toHaveLength(2)
		expect(kamPart.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam, SharedSourceLayers.PgmScript])
		expect(kamPart.adLibPieces).toHaveLength(0)
		expect(kamPart.actions).toHaveLength(0)

		const fullPart = result.parts[1]
		expect(fullPart).toBeTruthy()
		expect(fullPart.pieces).toHaveLength(2)
		expect(fullPart.adLibPieces).toHaveLength(0)
		expect(fullPart.actions).toHaveLength(1)
		const fullAdlibAction = fullPart.actions![0] as IBlueprintActionManifest
		expect(fullAdlibAction).toBeTruthy()
		expect((fullAdlibAction.display as IBlueprintActionManifestDisplayContent).sourceLayerId).toBe(
			SharedSourceLayers.PgmPilot
		)
		expect(fullPart.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmPilot,
			SharedSourceLayers.SelectedAdlibGraphicsFull
		])
	})

	it('Creates full when cues are correct and creates overlay when allowed', () => {
		const ingestSegment = makeIngestSegment(
			[
				['GRAFIK=FULL'],
				[
					'#cg4 pilotdata',
					'News/Citast/ARFG/LIVE/stoppoints_3',
					'VCPID=2547768',
					'ContinueCount=8',
					'News/Citat/ARFG/LIVE/stoppoints_3'
				],
				[
					']] S3.0 M 0 [[',
					'cg4 ]] 1 YNYAB 0 [[ pilotdata',
					'LgfxWeb/-ETKAEM_07-05-2019_17:55:42/MOSART=L|00:00|O',
					'VCPID=2520177',
					'ContinueCount=-1',
					'LgfxWeb/-ETKAEM_07-05-2019_17:55:42/MOSART=L|00:00|O'
				]
			],
			`\r\n<pi>Kam 1</pi>\r\n<p>Some script</p>\r\n<p><a idref="0"></a></p>\r\n<p><a idref="1"></a></p>\r\n<p><a idref="2"></a></p>\r\n`
		)
		const context = makeMockContext(false)
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(2)
		expectAllPartsToBeValid(result)

		const kamPart = result.parts[0]
		expect(kamPart).toBeTruthy()
		expect(kamPart.pieces).toHaveLength(2)
		expect(kamPart.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam, SharedSourceLayers.PgmScript])
		expect(kamPart.adLibPieces).toHaveLength(0)
		expect(kamPart.actions).toHaveLength(0)

		const fullPart = result.parts[1]
		expect(fullPart).toBeTruthy()
		expect(fullPart.pieces).toHaveLength(3)
		expect(fullPart.adLibPieces).toHaveLength(0)
		expect(fullPart.actions).toHaveLength(1)
		const fullAdlibAction = fullPart.actions![0] as IBlueprintActionManifest
		expect(fullAdlibAction).toBeTruthy()
		expect((fullAdlibAction.display as IBlueprintActionManifestDisplayContent).sourceLayerId).toBe(
			SharedSourceLayers.PgmPilot
		)
		expect(fullPart.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmPilot,
			SharedSourceLayers.SelectedAdlibGraphicsFull,
			SharedSourceLayers.PgmPilotOverlay
		])
	})

	it('Creates graphic for GRAFIK=FULL with Pilot with space', () => {
		const ingestSegment = makeIngestSegment(
			[
				['GRAFIK=FULL'],
				null,
				[
					'#cg4 pilotdata',
					'News/Citast/ARFG/LIVE/stoppoints_3',
					'VCPID=2547768',
					'ContinueCount=8',
					'News/Citat/ARFG/LIVE/stoppoints_3'
				]
			],
			`\r\n<pi>Kam 1</pi>\r\n<p>Some script</p>\r\n<p>Some script</p>\r\n<p>Some script</p>\r\n<p>Some script</p>\r\n<p>Some script</p>\r\n<p><a idref="0"></a></p>\r\n<p><a idref="2"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(2)
		expectAllPartsToBeValid(result)

		const kamPart = result.parts[0]
		expect(kamPart).toBeTruthy()
		expect(kamPart.pieces).toHaveLength(2)
		expect(kamPart.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam, SharedSourceLayers.PgmScript])
		expect(kamPart.adLibPieces).toHaveLength(0)
		expect(kamPart.actions).toHaveLength(0)

		const fullPart = result.parts[1]
		expect(fullPart).toBeTruthy()
		expect(fullPart.pieces).toHaveLength(2)
		expect(fullPart.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmPilot,
			SharedSourceLayers.SelectedAdlibGraphicsFull
		])
		expect(fullPart.adLibPieces).toHaveLength(0)
		expect(fullPart.actions).toHaveLength(1)
		expect(fullPart.actions).toHaveLength(1)
		const fullAdlibAction = fullPart.actions![0] as IBlueprintActionManifest
		expect(fullAdlibAction).toBeTruthy()
		expect((fullAdlibAction.display as IBlueprintActionManifestDisplayContent).sourceLayerId).toBe(
			SharedSourceLayers.PgmPilot
		)
	})

	it("Creates invalid part for GRAFIK=FULL with Pilot with 'notes'", () => {
		const ingestSegment = makeIngestSegment(
			[
				['GRAFIK=FULL'],
				['These are some notes for the floor manager'],
				[
					'#cg4 pilotdata',
					'News/Citast/ARFG/LIVE/stoppoints_3',
					'VCPID=2547768',
					'ContinueCount=8',
					'News/Citat/ARFG/LIVE/stoppoints_3'
				]
			],
			`\r\n<pi>Kam 1</pi>\r\n<p>Some script</p>\r\n<p>Some script</p>\r\n<p>Some script</p>\r\n<p>Some script</p>\r\n<p>Some script</p>\r\n<p><a idref="0"></a></p>\r\n<p><a idref="1"></a></p>\r\n<p><a idref="2"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, ['No graphic found after GRAFIK cue', 'Graphic found without target engine'])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(2)

		const kamPart = result.parts[0]
		expect(kamPart).toBeTruthy()
		expect(kamPart.pieces).toHaveLength(2)
		expect(kamPart.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam, SharedSourceLayers.PgmScript])
		expect(kamPart.adLibPieces).toHaveLength(0)
		expect(kamPart.actions).toHaveLength(0)

		const fullPart = result.parts[1]
		expect(fullPart).toBeTruthy()
		expect(fullPart.part.invalid).toBe(true)
		expect(fullPart.pieces).toHaveLength(0)
		expect(fullPart.adLibPieces).toHaveLength(0)
		expect(fullPart.actions).toHaveLength(0)
	})

	it('Creates invalid part for GRAFIK=FULL with Pilot and bund in between', () => {
		const ingestSegment = makeIngestSegment(
			[
				['GRAFIK=FULL'],
				['#kg bund some person', ';0.00'],
				[
					'#cg4 pilotdata',
					'News/Citast/ARFG/LIVE/stoppoints_3',
					'VCPID=2547768',
					'ContinueCount=8',
					'News/Citat/ARFG/LIVE/stoppoints_3'
				]
			],
			`\r\n<pi>Kam 1</pi>\r\n<p>Some script</p>\r\n<p>Some script</p>\r\n<p>Some script</p>\r\n<p>Some script</p>\r\n<p>Some script</p>\r\n<p><a idref="0"></a></p>\r\n<p><a idref="1"></a></p>\r\n<p><a idref="2"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, ['No graphic found after GRAFIK cue', 'Graphic found without target engine'])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(2)

		const kamPart = result.parts[0]
		expect(kamPart).toBeTruthy()
		expect(kamPart.pieces).toHaveLength(2)
		expect(kamPart.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam, SharedSourceLayers.PgmScript])
		expect(kamPart.adLibPieces).toHaveLength(0)
		expect(kamPart.actions).toHaveLength(0)

		const fullPart = result.parts[1]
		expect(fullPart).toBeTruthy()
		expect(fullPart.part.invalid).toBe(true)
		expect(fullPart.pieces).toHaveLength(0)
		expect(fullPart.adLibPieces).toHaveLength(2)
		expect(fullPart.actions).toHaveLength(0)
	})

	it('Creates invalid part and show warning when GRAFIK=FULL and Pilot in different parts', () => {
		const ingestSegment = makeIngestSegment(
			[
				['GRAFIK=FULL'],
				[
					'#cg4 pilotdata',
					'News/Citast/ARFG/LIVE/stoppoints_3',
					'VCPID=2547768',
					'ContinueCount=8',
					'News/Citat/ARFG/LIVE/stoppoints_3'
				]
			],
			`\r\n<pi>Kam 1</pi>\r\n<p>Some script</p>\r\n<p><a idref="0"></a></p>\r\n<pi>Kam 2</pi>\r\n<p><a idref="1"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, ['No graphic found after GRAFIK cue', 'Graphic found without target engine'])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(3)

		const kamPart1 = result.parts[0]
		expect(kamPart1).toBeTruthy()
		expect(kamPart1.pieces).toHaveLength(2)
		expect(kamPart1.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam, SharedSourceLayers.PgmScript])
		expect(kamPart1.adLibPieces).toHaveLength(0)
		expect(kamPart1.actions).toHaveLength(0)

		const fullPart = result.parts[1]
		expect(fullPart).toBeTruthy()
		expect(fullPart.part.invalid).toBe(true)
		expect(fullPart.pieces).toHaveLength(0)
		expect(fullPart.adLibPieces).toHaveLength(0)
		expect(fullPart.actions).toHaveLength(0)

		const kamPart2 = result.parts[2]
		expect(kamPart2).toBeTruthy()
		expect(kamPart2.pieces).toHaveLength(1)
		expect(kamPart2.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam])
		expect(kamPart2.adLibPieces).toHaveLength(0)
		expect(kamPart2.actions).toHaveLength(0)
	})

	it('Creates overlay graphic for MOSART=L', () => {
		const ingestSegment = makeIngestSegment(
			[
				[
					']] S3.0 M 0 [[',
					'cg4 ]] 1 YNYAB 0 [[ pilotdata',
					'LgfxWeb/-ETKAEM_07-05-2019_17:55:42/MOSART=L|00:00|O',
					'VCPID=2520177',
					'ContinueCount=-1',
					'LgfxWeb/-ETKAEM_07-05-2019_17:55:42/MOSART=L|00:00|O'
				]
			],
			`\r\n<pi>Kam 1</pi>\r\n<p>Some script</p>\r\n<p><a idref="0"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)
		expectAllPartsToBeValid(result)

		const kamPart = result.parts[0]
		expect(kamPart).toBeTruthy()
		expect(kamPart.pieces).toHaveLength(3)
		expect(kamPart.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmCam,
			SharedSourceLayers.PgmPilotOverlay,
			SharedSourceLayers.PgmScript
		])
		expect(kamPart.adLibPieces).toHaveLength(0)
		expect(kamPart.actions).toHaveLength(0)
	})

	it('Creates wall graphic for MOSART=W', () => {
		const ingestSegment = makeIngestSegment(
			[
				[
					']] S3.0 M 0 [[',
					'cg4 ]] 1 YNYAB 0 [[ pilotdata',
					'LgfxWeb/-ETKAEM_07-05-2019_17:55:42/MOSART=W|00:00|O',
					'VCPID=2520177',
					'ContinueCount=-1',
					'LgfxWeb/-ETKAEM_07-05-2019_17:55:42/MOSART=W|00:00|O'
				]
			],
			`\r\n<pi>Kam 1</pi>\r\n<p>Some script</p>\r\n<p><a idref="0"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)
		expectAllPartsToBeValid(result)

		const kamPart = result.parts[0]
		expect(kamPart).toBeTruthy()
		expect(kamPart.pieces).toHaveLength(3)
		expect(kamPart.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmCam,
			SharedSourceLayers.WallGraphics,
			SharedSourceLayers.PgmScript
		])
		expect(kamPart.adLibPieces).toHaveLength(0)
		expect(kamPart.actions).toHaveLength(0)
	})

	it('Creates full graphic for MOSART=F', () => {
		const ingestSegment = makeIngestSegment(
			[
				[
					']] S3.0 M 0 [[',
					'cg4 ]] 1 YNYAB 0 [[ pilotdata',
					'LgfxWeb/-ETKAEM_07-05-2019_17:55:42/MOSART=F|00:00|O',
					'VCPID=2520177',
					'ContinueCount=-1',
					'LgfxWeb/-ETKAEM_07-05-2019_17:55:42/MOSART=F|00:00|O'
				]
			],
			`\r\n<pi>Kam 1</pi>\r\n<p>Some script</p>\r\n<p><a idref="0"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(2)
		expectAllPartsToBeValid(result)

		const kamPart = result.parts[0]
		expect(kamPart).toBeTruthy()
		expect(kamPart.pieces).toHaveLength(2)
		expect(kamPart.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam, SharedSourceLayers.PgmScript])
		expect(kamPart.adLibPieces).toHaveLength(0)
		expect(kamPart.actions).toHaveLength(0)

		const fullPart = result.parts[1]
		expect(fullPart).toBeTruthy()
		expect(fullPart.pieces).toHaveLength(2)
		expect(fullPart.adLibPieces).toHaveLength(0)
		expect(fullPart.actions).toHaveLength(1)
		const fullAdlibAction = fullPart.actions![0] as IBlueprintActionManifest
		expect(fullAdlibAction).toBeTruthy()
		expect((fullAdlibAction.display as IBlueprintActionManifestDisplayContent).sourceLayerId).toBe(
			SharedSourceLayers.PgmPilot
		)
		expect(fullPart.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmPilot,
			SharedSourceLayers.SelectedAdlibGraphicsFull
		])
	})

	it('Loads graphic on wall, and loop on wall in next part', () => {
		const ingestSegment = makeIngestSegment(
			[
				['SS=SC-STILLS', ';0.00.01'],
				[
					'#cg4 pilotdata',
					'OpStilling/FC BARCELONA/NOV29-1314',
					'VCPID=2663383',
					'ContinueCount=-1',
					'OpStilling/FC BARCELONA/NOV29-1314'
				],
				['SS=SC-LOOP', ';0.00.01']
			],
			`\r\n<p><pi>Kam 1</pi></p>\r\n<p><a idref="0"></a></p>\r\n<p><a idref="1"></a></p>\r\n<p>Some script</p>\r\n<p><pi>Kam 2</pi></p>\r\n<p><a idref="2"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(2)
		expectAllPartsToBeValid(result)

		const kamPart1 = result.parts[0]
		expect(kamPart1).toBeTruthy()
		expect(kamPart1.pieces).toHaveLength(3)
		expect(kamPart1.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmCam,
			SharedSourceLayers.WallGraphics,
			SharedSourceLayers.PgmScript
		])

		const kamPart2 = result.parts[1]
		expect(kamPart2).toBeTruthy()
		expect(kamPart2.pieces).toHaveLength(2)
		expect(kamPart2.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmCam,
			SharedSourceLayers.WallGraphics
		])
	})

	it('Shows warning for missing wall graphic', () => {
		const ingestSegment = makeIngestSegment(
			[
				['SS=SC-STILLS', ';0.00.01'],
				['SS=SC-LOOP', ';0.00.01']
			],
			`\r\n<p><pi>Kam 1</pi></p>\r\n<p><a idref="0"></a></p>\r\n<p>Some script</p>\r\n<p><pi>Kam 2</pi></p>\r\n<p><a idref="1"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, ['No graphic found after SS cue'])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(2)
		expectAllPartsToBeValid(result)

		const kamPart1 = result.parts[0]
		expect(kamPart1).toBeTruthy()
		expect(kamPart1.pieces).toHaveLength(2)
		expect(kamPart1.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam, SharedSourceLayers.PgmScript])

		const kamPart2 = result.parts[1]
		expect(kamPart2).toBeTruthy()
		expect(kamPart2.pieces).toHaveLength(2)
		expect(kamPart1.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam, SharedSourceLayers.PgmScript])
	})

	it('Shows warning for missing wall graphic with MOSART=L', () => {
		const ingestSegment = makeIngestSegment(
			[
				['SS=SC-STILLS', ';0.00.01'],
				[
					'#cg4 pilotdata',
					'OpStilling/FC BARCELONA/NOV29-1314/MOSART=L|00:00|00:10',
					'VCPID=2663383',
					'ContinueCount=-1',
					'OpStilling/FC BARCELONA/NOV29-1314/MOSART=L|00:00|00:10'
				],
				['SS=SC-LOOP', ';0.00.01']
			],
			`\r\n<p><pi>Kam 1</pi></p>\r\n<p><a idref="0"></a></p>\r\n<p><a idref="1"></a></p>\r\n<p>Some script</p>\r\n<p><pi>Kam 2</pi></p>\r\n<p><a idref="2"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, ['No graphic found after SS cue'])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(2)
		expectAllPartsToBeValid(result)

		const kamPart1 = result.parts[0]
		expect(kamPart1).toBeTruthy()
		expect(kamPart1.pieces).toHaveLength(3)
		expect(kamPart1.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmCam,
			SharedSourceLayers.PgmPilotOverlay,
			SharedSourceLayers.PgmScript
		])

		const kamPart2 = result.parts[1]
		expect(kamPart2).toBeTruthy()
		expect(kamPart2.pieces).toHaveLength(2)
		expect(kamPart2.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmCam,
			SharedSourceLayers.WallGraphics
		])
	})

	it('Shows warning for graphic in wrong place', () => {
		const ingestSegment = makeIngestSegment(
			[
				['SS=SC-STILLS', ';0.00.01'],
				[
					'#cg4 pilotdata',
					'OpStilling/FC BARCELONA/NOV29-1314',
					'VCPID=2663383',
					'ContinueCount=-1',
					'OpStilling/FC BARCELONA/NOV29-1314'
				],
				['SS=SC-LOOP', ';0.00.01']
			],
			`\r\n<p><pi>Kam 1</pi></p>\r\n<p><a idref="0"></a></p>\r\n<p>Some script</p>\r\n<p><pi>Kam 2</pi></p>\r\n<p><a idref="1"></a></p>\r\n<p><a idref="2"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, ['No graphic found after SS cue', 'Graphic found without target engine'])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(2)
		expectAllPartsToBeValid(result)

		const kamPart1 = result.parts[0]
		expect(kamPart1).toBeTruthy()
		expect(kamPart1.pieces).toHaveLength(2)
		expect(kamPart1.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmCam, SharedSourceLayers.PgmScript])

		const kamPart2 = result.parts[1]
		expect(kamPart2).toBeTruthy()
		expect(kamPart2.pieces).toHaveLength(2)
		expect(kamPart2.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmCam,
			SharedSourceLayers.WallGraphics
		])
	})

	it('Changes design and background loops', () => {
		const ingestSegment = makeIngestSegment(
			[
				['KG=DESIGN_FODBOLD_20', ';0.00.01'],
				['VIZ=dve-triopage', 'GRAFIK=BG_LOADER_FODBOLD_20', ';0.00'],
				['VIZ=full-triopage', 'GRAFIK=BG_LOADER_FODBOLD_20', ';0.00.01']
			],
			`\r\n<p><pi>KAM 1</pi></p>\r\n<p><a idref="0"></a></p>\r\n<p><a idref="1"></a></p>\r\n<p><a idref="2"></a></p>\r\n<p>Some script</p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)
		expectAllPartsToBeValid(result)

		const kamPart1 = result.parts[0]
		expect(kamPart1).toBeTruthy()
		expect(kamPart1.pieces).toHaveLength(5)
		expect(kamPart1.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmCam,
			SharedSourceLayers.PgmDesign,
			SourceLayer.PgmDVEBackground,
			SourceLayer.PgmFullBackground,
			SharedSourceLayers.PgmScript
		])
	})

	it('Creates Live1', () => {
		const ingestSegment = makeIngestSegment([['EKSTERN=LIVE1']], `\r\n<p><a idref="0"></a></p>\r\n<p>`)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)
		expectAllPartsToBeValid(result)

		const livePart1 = result.parts[0]
		expect(livePart1).toBeTruthy()
		expect(livePart1.pieces).toHaveLength(1)
		expect(livePart1.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmLive])
	})

	it('Creates Live 1', () => {
		const ingestSegment = makeIngestSegment([['EKSTERN=LIVE 1']], `\r\n<p><a idref="0"></a></p>\r\n<p>`)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)
		expectAllPartsToBeValid(result)

		const livePart1 = result.parts[0]
		expect(livePart1).toBeTruthy()
		expect(livePart1.pieces).toHaveLength(1)
		expect(livePart1.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmLive])
	})

	it('Creates Feed1', () => {
		const ingestSegment = makeIngestSegment([['EKSTERN=FEED1']], `\r\n<p><a idref="0"></a></p>\r\n<p>`)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)
		expectAllPartsToBeValid(result)

		const feedPart1 = result.parts[0]
		expect(feedPart1).toBeTruthy()
		expect(feedPart1.pieces).toHaveLength(1)
		expect(feedPart1.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmLive])
	})

	it('Creates Feed 1', () => {
		const ingestSegment = makeIngestSegment([['EKSTERN=FEED 1']], `\r\n<p><a idref="0"></a></p>\r\n<p>`)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)
		expectAllPartsToBeValid(result)

		const feedPart1 = result.parts[0]
		expect(feedPart1).toBeTruthy()
		expect(feedPart1.pieces).toHaveLength(1)
		expect(feedPart1.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmLive])
	})

	it('Creates invalid part for EKSTERN=LIVE', () => {
		const ingestSegment = makeIngestSegment(
			[['EKSTERN=LIVE'], ['#kg direkte ODDER', ';0.00']],
			`\r\n<p><pi>***LIVE***</pi></p>\r\n<p><a idref="0"></a></p>\r\n<p><a idref="1"></a></p>\r\n`
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, ['No source entered for EKSTERN'])
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)
		expect(result.parts[0].part.invalid).toBe(true)
	})

	it('Creates effekt for KAM 1 EFFEKT 1', () => {
		const ingestSegment = makeIngestSegment([], '\r\n<p><pi>KAM 1 EFFEKT 1</pi></p>\r\n')
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expectAllPartsToBeValid(result)
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)

		const kamPart1 = result.parts[0]
		expect(kamPart1).toBeTruthy()
		expect(kamPart1.pieces).toHaveLength(2)
		expect(kamPart1.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmJingle, SharedSourceLayers.PgmCam])
		expect(kamPart1.pieces[0].name).toBe('EFFEKT 1')
	})

	it('Creates mix for KAM 1 MIX 5', () => {
		const ingestSegment = makeIngestSegment([], '\r\n<p><pi>KAM 1 MIX 5</pi></p>\r\n')
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expectAllPartsToBeValid(result)
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)

		const kamPart1 = result.parts[0]
		expect(kamPart1).toBeTruthy()
		expect(kamPart1.pieces).toHaveLength(2)
		expect(kamPart1.pieces.map(p => p.sourceLayerId)).toEqual([SharedSourceLayers.PgmJingle, SharedSourceLayers.PgmCam])
		expect(kamPart1.pieces[0].name).toBe('MIX 5')
	})

	it('Creates mix for EKSTERN=LIVE 1 EFFEKT 1', () => {
		const ingestSegment = makeIngestSegment(
			[['EKSTERN=LIVE 1 EFFEKT 1']],
			'\r\n<p><pi>***LIVE***</pi></p>\r\n<p><a idref="0"></a></p>\r\n'
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expectAllPartsToBeValid(result)
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)

		const livePart1 = result.parts[0]
		expect(livePart1).toBeTruthy()
		expect(livePart1.pieces).toHaveLength(2)
		expect(livePart1.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmJingle,
			SharedSourceLayers.PgmLive
		])
		expect(livePart1.pieces[0].name).toBe('EFFEKT 1')
	})

	it('Creates mix for EKSTERN=LIVE 1 MIX 10', () => {
		const ingestSegment = makeIngestSegment(
			[['EKSTERN=LIVE 1 MIX 10']],
			'\r\n<p><pi>***LIVE***</pi></p>\r\n<p><a idref="0"></a></p>\r\n'
		)
		const context = makeMockContext()
		const result = getSegment(context, ingestSegment)
		expectNotesToBe(context, [])
		expectAllPartsToBeValid(result)
		expect(result.segment.isHidden).toBe(false)
		expect(result.parts).toHaveLength(1)

		const livePart1 = result.parts[0]
		expect(livePart1).toBeTruthy()
		expect(livePart1.pieces).toHaveLength(2)
		expect(livePart1.pieces.map(p => p.sourceLayerId)).toEqual([
			SharedSourceLayers.PgmJingle,
			SharedSourceLayers.PgmLive
		])
		expect(livePart1.pieces[0].name).toBe('MIX 10')
	})
})
