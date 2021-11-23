import {
	BlueprintSyncIngestNewData,
	BlueprintSyncIngestPartInstance,
	IBlueprintPartDB,
	IBlueprintPartInstance,
	IBlueprintPieceInstance,
	IBlueprintRundownDB,
	PieceLifespan,
	PlaylistTimingType
} from '@tv2media/blueprints-integration'
import { literal } from 'tv2-common'
import { SharedOutputLayers } from 'tv2-constants'
import { SyncIngestUpdateToPartInstanceContext } from '../../__mocks__/context'
import { parseConfig as parseStudioConfig } from '../../tv2_afvd_studio/helpers/config'
import mappingsDefaults from '../../tv2_afvd_studio/migrations/mappings-defaults'
import { parseConfig as parseShowStyleConfig } from '../helpers/config'
import { SourceLayer } from '../layers'
import { syncIngestUpdateToPartInstance } from '../syncIngestUpdateToPartInstance'

const RUNDOWN_EXTERNAL_ID = 'TEST.SOFIE.JEST'

function makeMockContext(): SyncIngestUpdateToPartInstanceContext {
	const rundown = literal<IBlueprintRundownDB>({
		externalId: RUNDOWN_EXTERNAL_ID,
		name: RUNDOWN_EXTERNAL_ID,
		_id: '',
		showStyleVariantId: '',
		timing: {
			type: PlaylistTimingType.None
		}
	})
	return new SyncIngestUpdateToPartInstanceContext(
		'test',
		mappingsDefaults,
		parseStudioConfig,
		parseShowStyleConfig,
		rundown._id
	)
}

function makePart(partProps: Omit<IBlueprintPartDB, '_id' | 'segmentId' | 'externalId'>): IBlueprintPartDB {
	return literal<IBlueprintPartDB>({
		_id: '',
		segmentId: '',
		externalId: '',
		...partProps
	})
}

function makePartinstance(
	partProps: Omit<IBlueprintPartDB, '_id' | 'segmentId' | 'externalId'>
): IBlueprintPartInstance<unknown> {
	return literal<IBlueprintPartInstance<unknown>>({
		_id: '',
		segmentId: '',
		part: makePart(partProps),
		rehearsal: false
	})
}

function makeSoundBed(id: string, name: string): IBlueprintPieceInstance<unknown> {
	return literal<IBlueprintPieceInstance<unknown>>({
		_id: id,
		piece: {
			_id: '',
			enable: {
				start: 0
			},
			externalId: '',
			name,
			lifespan: PieceLifespan.OutOnShowStyleEnd,
			sourceLayerId: SourceLayer.PgmAudioBed,
			outputLayerId: SharedOutputLayers.SEC,
			content: {
				timelineObjects: []
			}
		},
		partInstanceId: ''
	})
}

describe('Sync Ingest Changes To Part Instances', () => {
	it('Syncs soundbed removed', () => {
		const context = makeMockContext()
		const pieceInstanceId = 'someID'
		const existingPartInstance: BlueprintSyncIngestPartInstance = literal<BlueprintSyncIngestPartInstance>({
			partInstance: makePartinstance({ title: 'Soundbed' }),
			pieceInstances: [makeSoundBed(pieceInstanceId, 'SN_Intro')]
		})
		const newPart: BlueprintSyncIngestNewData = literal<BlueprintSyncIngestNewData>({
			part: makePart({ title: 'Soundbed' }),
			pieceInstances: [],
			adLibPieces: [],
			actions: [],
			referencedAdlibs: []
		})
		syncIngestUpdateToPartInstance(context, existingPartInstance, newPart, 'current')

		expect(context.removedPieceInstances).toStrictEqual([pieceInstanceId])
		expect(context.syncedPieceInstances).toStrictEqual([])
		expect(context.updatedPieceInstances).toStrictEqual([])
	})

	it('Syncs soundbed added', () => {
		const context = makeMockContext()
		const pieceInstanceId = 'someID'
		const existingPartInstance: BlueprintSyncIngestPartInstance = literal<BlueprintSyncIngestPartInstance>({
			partInstance: makePartinstance({ title: 'Soundbed' }),
			pieceInstances: []
		})
		const newPart: BlueprintSyncIngestNewData = literal<BlueprintSyncIngestNewData>({
			part: makePart({ title: 'Soundbed' }),
			pieceInstances: [makeSoundBed(pieceInstanceId, 'SN_Intro')],
			adLibPieces: [],
			actions: [],
			referencedAdlibs: []
		})
		syncIngestUpdateToPartInstance(context, existingPartInstance, newPart, 'current')

		expect(context.removedPieceInstances).toStrictEqual([])
		expect(context.syncedPieceInstances).toStrictEqual([pieceInstanceId])
		expect(context.updatedPieceInstances).toStrictEqual([])
	})

	it('Syncs soundbed changed', () => {
		const context = makeMockContext()
		const pieceInstanceId = 'someID'
		const existingPartInstance: BlueprintSyncIngestPartInstance = literal<BlueprintSyncIngestPartInstance>({
			partInstance: makePartinstance({ title: 'Soundbed' }),
			pieceInstances: [makeSoundBed(pieceInstanceId, 'SN_Intro')]
		})
		const newPart: BlueprintSyncIngestNewData = literal<BlueprintSyncIngestNewData>({
			part: makePart({ title: 'Soundbed' }),
			pieceInstances: [makeSoundBed(pieceInstanceId, 'SN_Intro_19')], // the id stays the same
			adLibPieces: [],
			actions: [],
			referencedAdlibs: []
		})
		syncIngestUpdateToPartInstance(context, existingPartInstance, newPart, 'current')

		expect(context.removedPieceInstances).toStrictEqual([])
		expect(context.syncedPieceInstances).toStrictEqual([pieceInstanceId])
		expect(context.updatedPieceInstances).toStrictEqual([])
	})

	it('Syncs part properties', () => {
		const context = makeMockContext()
		const existingPartInstance: BlueprintSyncIngestPartInstance = literal<BlueprintSyncIngestPartInstance>({
			partInstance: makePartinstance({ title: 'Kam 1', budgetDuration: 2000, transitionPrerollDuration: 200 }),
			pieceInstances: []
		})
		const newPart: BlueprintSyncIngestNewData = literal<BlueprintSyncIngestNewData>({
			part: makePart({ title: 'Kam 2', budgetDuration: 1000, transitionPrerollDuration: 500 }),
			pieceInstances: [],
			adLibPieces: [],
			actions: [],
			referencedAdlibs: []
		})
		syncIngestUpdateToPartInstance(context, existingPartInstance, newPart, 'current')

		expect(context.updatedPartInstance?.part.transitionPrerollDuration).toBeUndefined()
		expect(context.updatedPartInstance?.part.budgetDuration).toBe(1000)
		expect(context.updatedPartInstance?.part.title).toBe('Kam 2')
	})
})
