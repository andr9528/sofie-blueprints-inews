import * as crypto from 'crypto'
import * as _ from 'underscore'

import {
	BlueprintMappings,
	ConfigItemValue,
	IBlueprintConfig,
	IBlueprintMutatablePart,
	IBlueprintPart,
	IBlueprintPartInstance,
	IBlueprintPiece,
	IBlueprintPieceInstance,
	IBlueprintResolvedPieceInstance,
	IBlueprintRundownDB,
	IBlueprintRundownPlaylist,
	ICommonContext,
	IGetRundownContext,
	IPackageInfoContext,
	IRundownContext,
	IRundownUserContext,
	ISegmentUserContext,
	IShowStyleContext,
	IStudioContext,
	ISyncIngestUpdateToPartInstanceContext,
	IUserNotesContext,
	OmitId,
	PackageInfo,
	PieceLifespan,
	PlaylistTimingType,
	Time
} from '@tv2media/blueprints-integration'
import { ITV2ActionExecutionContext, PieceMetaData } from 'tv2-common'
import { NoteType } from 'tv2-constants'
import { defaultShowStyleConfig, defaultStudioConfig } from '../tv2_afvd_showstyle/__tests__/configs'
import { parseConfig as parseShowStyleConfigAFVD } from '../tv2_afvd_showstyle/helpers/config'
import { parseConfig as parseStudioConfigAFVD, StudioConfig } from '../tv2_afvd_studio/helpers/config'
import mappingsDefaultsAFVD from '../tv2_afvd_studio/migrations/mappings-defaults'

export function getHash(str: string): string {
	const hash = crypto.createHash('sha1')
	return hash
		.update(str)
		.digest('base64')
		.replace(/[\+\/\=]/gi, '_') // remove +/= from strings, because they cause troubles
}

// tslint:disable-next-line: max-classes-per-file
export class CommonContext implements ICommonContext {
	protected savedNotes: PartNote[] = []
	protected notesRundownId?: string
	protected notesSegmentId?: string
	protected notesPartId?: string
	private contextName: string
	private hashI = 0
	private hashed: { [hash: string]: string } = {}

	constructor(contextName: string, rundownId?: string, segmentId?: string, partId?: string) {
		this.contextName = contextName
		this.notesRundownId = rundownId
		this.notesSegmentId = segmentId
		this.notesPartId = partId
	}
	public logDebug(message: string) {
		this.pushNote(NoteType.DEBUG, message)
	}
	public logInfo(message: string) {
		this.pushNote(NoteType.INFO, message)
	}
	public logWarning(message: string) {
		this.pushNote(NoteType.WARNING, message)
	}
	public logError(message: string) {
		this.pushNote(NoteType.ERROR, message)
	}
	public getHashId(str?: any) {
		if (!str) {
			str = 'hash' + this.hashI++
		}

		let id
		id = getHash(this.contextName + '_' + str.toString())
		this.hashed[id] = str
		return id
	}
	public unhashId(hash: string): string {
		return this.hashed[hash] || hash
	}

	public getNotes() {
		return this.savedNotes
	}

	protected pushNote(type: NoteType, message: string) {
		this.savedNotes.push({
			type,
			origin: {
				name: this.contextName,
				roId: this.notesRundownId,
				segmentId: this.notesSegmentId,
				partId: this.notesPartId
			},
			message
		})
	}
}

// tslint:disable-next-line: max-classes-per-file
export class UserNotesContext extends CommonContext implements IUserNotesContext {
	constructor(contextName: string, rundownId?: string, segmentId?: string, partId?: string) {
		super(contextName, rundownId, segmentId, partId)
	}

	public notifyUserError(message: string, _params?: { [key: string]: any }): void {
		this.pushNote(NoteType.NOTIFY_USER_ERROR, message)
	}
	public notifyUserWarning(message: string, _params?: { [key: string]: any }): void {
		this.pushNote(NoteType.NOTIFY_USER_WARNING, message)
	}

	public notifyUserInfo(_message: string, _params?: { [p: string]: any }): void {
		// Do nothing
	}
}

// tslint:disable-next-line: max-classes-per-file
export class StudioContext extends CommonContext implements IStudioContext {
	public studioId: string = 'studio0'
	public studioConfig: { [key: string]: ConfigItemValue } = {}
	public showStyleConfig: { [key: string]: ConfigItemValue } = {}

	private mappingsDefaults: BlueprintMappings
	private parseStudioConfig: (context: ICommonContext, rawConfig: IBlueprintConfig) => any

	constructor(
		contextName: string,
		mappingsDefaults: BlueprintMappings,
		parseStudioConfig: (context: ICommonContext, rawConfig: IBlueprintConfig) => any,
		rundownId?: string,
		segmentId?: string,
		partId?: string
	) {
		super(contextName, rundownId, segmentId, partId)
		this.mappingsDefaults = mappingsDefaults
		this.parseStudioConfig = parseStudioConfig
	}

	public getStudioConfig() {
		return _.clone(this.parseStudioConfig(this, this.studioConfig))
	}
	public getStudioConfigRef(_configKey: string): string {
		return 'test'
	}
	public getStudioMappings() {
		return _.clone(this.mappingsDefaults)
	}
}

// tslint:disable-next-line: max-classes-per-file
export class ShowStyleContext extends StudioContext implements IShowStyleContext, IPackageInfoContext {
	public studioConfig: { [key: string]: ConfigItemValue } = {}
	public showStyleConfig: { [key: string]: ConfigItemValue } = {}

	private parseShowStyleConfig: (context: ICommonContext, config: IBlueprintConfig) => any

	constructor(
		contextName: string,
		mappingsDefaults: BlueprintMappings,
		parseStudioConfig: (context: ICommonContext, rawConfig: IBlueprintConfig) => any,
		parseShowStyleConfig: (context: ICommonContext, config: IBlueprintConfig) => any,
		rundownId?: string,
		segmentId?: string,
		partId?: string
	) {
		super(contextName, mappingsDefaults, parseStudioConfig, rundownId, segmentId, partId)
		this.parseShowStyleConfig = parseShowStyleConfig
	}
	public getPackageInfo(_packageId: string): readonly PackageInfo.Any[] {
		return []
	}

	public getShowStyleConfig() {
		return _.clone(this.parseShowStyleConfig(this, this.showStyleConfig))
	}
	public getShowStyleConfigRef(_configKey: string): string {
		return 'test'
	}
	public async hackGetMediaObjectDuration(_mediaId: string): Promise<number | undefined> {
		return undefined
	}
}

// tslint:disable-next-line: max-classes-per-file
export class ShowStyleUserContext extends ShowStyleContext implements IUserNotesContext {
	public notifyUserError(message: string, _params?: { [key: string]: any }): void {
		this.pushNote(NoteType.NOTIFY_USER_ERROR, message)
	}
	public notifyUserWarning(message: string, _params?: { [key: string]: any }): void {
		this.pushNote(NoteType.NOTIFY_USER_WARNING, message)
	}

	public notifyUserInfo(_message: string, _params?: { [p: string]: any }): void {
		// Do nothing
	}
}

// tslint:disable-next-line: max-classes-per-file
export class GetRundownContext extends ShowStyleUserContext implements IGetRundownContext {
	public async getCurrentPlaylist(): Promise<Readonly<IBlueprintRundownPlaylist> | undefined> {
		return undefined
	}

	public async getPlaylists(): Promise<Readonly<IBlueprintRundownPlaylist[]>> {
		return []
	}

	public getRandomId(): string {
		return ''
	}
}

// tslint:disable-next-line: max-classes-per-file
export class RundownContext extends ShowStyleContext implements IRundownContext {
	public readonly rundownId: string = 'rundown0'
	public readonly rundown: Readonly<IBlueprintRundownDB>

	constructor(
		contextName: string,
		mappingsDefaults: BlueprintMappings,
		parseStudioConfig: (context: ICommonContext, rawConfig: IBlueprintConfig) => any,
		parseShowStyleConfig: (context: ICommonContext, config: IBlueprintConfig) => any,
		rundownId?: string,
		segmentId?: string,
		partId?: string
	) {
		super(contextName, mappingsDefaults, parseStudioConfig, parseShowStyleConfig, rundownId, segmentId, partId)
		this.rundownId = rundownId ?? this.rundownId
		this.rundown = {
			_id: this.rundownId,
			externalId: this.rundownId,
			name: this.rundownId,
			timing: {
				type: PlaylistTimingType.None
			},
			showStyleVariantId: 'variant0'
		}
	}
}

// tslint:disable-next-line: max-classes-per-file
export class RundownUserContext extends RundownContext implements IRundownUserContext {
	public notifyUserError(message: string, _params?: { [key: string]: any }): void {
		this.pushNote(NoteType.NOTIFY_USER_ERROR, message)
	}
	public notifyUserWarning(message: string, _params?: { [key: string]: any }): void {
		this.pushNote(NoteType.NOTIFY_USER_WARNING, message)
	}

	public notifyUserInfo(_message: string, _params?: { [p: string]: any }): void {
		// Do nothing
	}
}

// tslint:disable-next-line: max-classes-per-file
export class SegmentUserContext extends RundownContext implements ISegmentUserContext {
	constructor(
		contextName: string,
		mappingsDefaults: BlueprintMappings,
		parseStudioConfig: (context: ICommonContext, rawConfig: IBlueprintConfig) => any,
		parseShowStyleConfig: (context: ICommonContext, config: IBlueprintConfig) => any,
		rundownId?: string,
		segmentId?: string,
		partId?: string
	) {
		super(contextName, mappingsDefaults, parseStudioConfig, parseShowStyleConfig, rundownId, segmentId, partId)
	}

	public notifyUserError(
		message: string,
		_params?: { [key: string]: any } | undefined,
		_partExternalId?: string | undefined
	) {
		this.pushNote(NoteType.NOTIFY_USER_ERROR, message)
	}
	public notifyUserWarning(
		message: string,
		_params?: { [key: string]: any } | undefined,
		_partExternalId?: string | undefined
	) {
		this.pushNote(NoteType.NOTIFY_USER_WARNING, message)
	}
	public async hackGetMediaObjectDuration(_mediaId: string): Promise<number | undefined> {
		return undefined
	}
	public getPackageInfo(_packageId: string): readonly PackageInfo.Any[] {
		return []
	}

	public notifyUserInfo(_message: string, _params?: { [p: string]: any }): void {
		// Do nothing
	}
}

// tslint:disable-next-line: max-classes-per-file
export class SyncIngestUpdateToPartInstanceContext extends RundownUserContext
	implements ISyncIngestUpdateToPartInstanceContext {
	public syncedPieceInstances: string[] = []
	public removedPieceInstances: string[] = []
	public updatedPieceInstances: string[] = []
	public updatedPartInstance: IBlueprintPartInstance | undefined

	constructor(
		contextName: string,
		mappingsDefaults: BlueprintMappings,
		parseStudioConfig: (context: ICommonContext, rawConfig: IBlueprintConfig) => any,
		parseShowStyleConfig: (context: ICommonContext, config: IBlueprintConfig) => any,
		rundownId: string,
		segmentId?: string,
		partId?: string
	) {
		super(contextName, mappingsDefaults, parseStudioConfig, parseShowStyleConfig, rundownId, segmentId, partId)
	}

	public syncPieceInstance(
		pieceInstanceId: string,
		mutatedPiece?: Omit<IBlueprintPiece<unknown>, 'lifespan'>
	): IBlueprintPieceInstance<unknown> {
		this.syncedPieceInstances.push(pieceInstanceId)
		return {
			_id: pieceInstanceId,
			piece: {
				_id: '',
				enable: {
					start: 0
				},
				externalId: '',
				name: '',
				sourceLayerId: '',
				outputLayerId: '',
				lifespan: PieceLifespan.WithinPart,
				...mutatedPiece,
				content: mutatedPiece?.content ?? { timelineObjects: [] }
			},
			partInstanceId: ''
		}
	}
	public insertPieceInstance(piece: IBlueprintPiece<unknown>): IBlueprintPieceInstance<unknown> {
		return {
			_id: '',
			piece: {
				_id: '',
				...piece
			},
			partInstanceId: ''
		}
	}
	public updatePieceInstance(
		pieceInstanceId: string,
		piece: Partial<IBlueprintPiece<unknown>>
	): IBlueprintPieceInstance<unknown> {
		this.updatedPieceInstances.push(pieceInstanceId)
		return {
			_id: pieceInstanceId,
			piece: {
				_id: '',
				enable: {
					start: 0
				},
				externalId: '',
				name: '',
				sourceLayerId: '',
				outputLayerId: '',
				lifespan: PieceLifespan.WithinPart,
				...piece,
				content: piece.content ?? { timelineObjects: [] }
			},
			partInstanceId: ''
		}
	}
	public removePieceInstances(...pieceInstanceIds: string[]): string[] {
		this.removedPieceInstances.push(...pieceInstanceIds)
		return pieceInstanceIds
	}
	public updatePartInstance(props: Partial<IBlueprintMutatablePart<unknown>>): IBlueprintPartInstance<unknown> {
		this.updatedPartInstance = {
			_id: '',
			segmentId: '',
			part: {
				_id: '',
				segmentId: '',
				externalId: '',
				title: '',
				...props
			},
			rehearsal: false
		}
		return this.updatedPartInstance
	}

	public notifyUserInfo(_message: string, _params?: { [p: string]: any }): void {
		// Do nothing
	}
}

// tslint:disable-next-line: max-classes-per-file
export class ActionExecutionContext extends ShowStyleUserContext implements ITV2ActionExecutionContext {
	public currentPart: IBlueprintPartInstance
	public currentPieceInstances: Array<IBlueprintPieceInstance<PieceMetaData>>
	public nextPart: IBlueprintPartInstance | undefined
	public nextPieceInstances: Array<IBlueprintPieceInstance<PieceMetaData>> | undefined

	public takeAfterExecute: boolean = false
	public isTV2Context: true = true

	constructor(
		contextName: string,
		mappingsDefaults: BlueprintMappings,
		parseStudioConfig: (context: ICommonContext, rawConfig: IBlueprintConfig) => any,
		parseShowStyleConfig: (context: ICommonContext, config: IBlueprintConfig) => any,
		rundownId: string,
		segmentId: string,
		partId: string,
		currentPart: IBlueprintPartInstance,
		currentPieceInstances: Array<IBlueprintPieceInstance<PieceMetaData>>,
		nextPart?: IBlueprintPartInstance,
		nextPieceInstances?: Array<IBlueprintPieceInstance<PieceMetaData>>
	) {
		super(contextName, mappingsDefaults, parseStudioConfig, parseShowStyleConfig, rundownId, segmentId, partId)

		this.currentPart = currentPart
		this.currentPieceInstances = currentPieceInstances
		this.nextPart = nextPart
		this.nextPieceInstances = nextPieceInstances
	}

	/** Get the mappings for the studio */
	public getStudioMappings = () => {
		throw new Error(`Function not implemented in mock: 'getStudioMappings'`)
	}

	/** Get a PartInstance which can be modified */
	public async getPartInstance(part: 'current' | 'next'): Promise<IBlueprintPartInstance | undefined> {
		if (part === 'current') {
			return this.currentPart
		}
		return this.nextPart
	}
	/** Get the PieceInstances for a modifiable PartInstance */
	public async getPieceInstances(part: 'current' | 'next'): Promise<Array<IBlueprintPieceInstance<PieceMetaData>>> {
		if (part === 'current') {
			return this.currentPieceInstances
		}

		return this.nextPieceInstances || []
	}
	/** Get the resolved PieceInstances for a modifiable PartInstance */
	public async getResolvedPieceInstances(
		_part: 'current' | 'next'
	): Promise<Array<IBlueprintResolvedPieceInstance<PieceMetaData>>> {
		return []
	}
	/** Get the last active piece on given layer */
	public async findLastPieceOnLayer(
		_sourceLayerId: string,
		_options?: {
			excludeCurrentPart?: boolean
			originalOnly?: boolean
			pieceMetaDataFilter?: any
		}
	): Promise<IBlueprintPieceInstance<PieceMetaData> | undefined> {
		return undefined
	}
	public async findLastScriptedPieceOnLayer(
		_sourceLayerId: string,
		_options?: {
			excludeCurrentPart?: boolean
			pieceMetaDataFilter?: any
		}
	): Promise<IBlueprintPiece<PieceMetaData> | undefined> {
		return undefined
	}
	public async getPartInstanceForPreviousPiece(_piece: IBlueprintPieceInstance): Promise<IBlueprintPartInstance> {
		return {
			_id: '',
			segmentId: '',
			part: {
				_id: '',
				segmentId: '',
				externalId: '',
				title: ''
			},
			rehearsal: false
		}
	}
	public async getPartForPreviousPiece(_piece: { _id: string }): Promise<IBlueprintPart | undefined> {
		return undefined
	}
	/** Creative actions */
	/** Insert a piece. Returns id of new PieceInstance. Any timelineObjects will have their ids changed, so are not safe to reference from another piece */
	public async insertPiece(
		part: 'current' | 'next',
		piece: IBlueprintPiece<PieceMetaData>
	): Promise<IBlueprintPieceInstance<PieceMetaData>> {
		const pieceInstance: IBlueprintPieceInstance<PieceMetaData> = {
			_id: '',
			piece: {
				_id: '',
				...piece
			},
			partInstanceId: ''
		}
		if (part === 'current') {
			this.currentPieceInstances.push(pieceInstance)
		} else {
			if (this.nextPart && this.nextPieceInstances) {
				this.nextPieceInstances.push(pieceInstance)
			}
		}
		return pieceInstance
	}
	/** Update a pieceInstance */
	public async updatePieceInstance(
		_pieceInstanceId: string,
		piece: Partial<OmitId<IBlueprintPiece>>
	): Promise<IBlueprintPieceInstance<PieceMetaData>> {
		return {
			_id: '',
			piece: {
				_id: '',
				...(piece as IBlueprintPiece<PieceMetaData>)
			},
			partInstanceId: ''
		}
	}
	/** Insert a queued part to follow the current part */
	public async queuePart(
		part: IBlueprintPart,
		pieces: Array<IBlueprintPiece<PieceMetaData>>
	): Promise<IBlueprintPartInstance> {
		const instance: IBlueprintPartInstance = {
			_id: '',
			segmentId: this.notesSegmentId || '',
			part: {
				_id: '',
				...part,
				segmentId: this.notesSegmentId || ''
			},
			rehearsal: false
		}

		this.nextPart = instance
		this.nextPieceInstances = pieces.map<IBlueprintPieceInstance<PieceMetaData>>(p => ({
			_id: (Date.now() * Math.random()).toString(),
			piece: {
				_id: '',
				...p
			},
			partInstanceId: instance._id
		}))

		return instance
	}
	/** Update a partInstance */
	public async updatePartInstance(
		part: 'current' | 'next',
		props: Partial<IBlueprintMutatablePart>
	): Promise<IBlueprintPartInstance> {
		if (part === 'current') {
			this.currentPart.part = { ...this.currentPart.part, ...props }
			return this.currentPart
		} else if (this.nextPart) {
			this.nextPart.part = { ...this.nextPart.part, ...props }
			return this.nextPart
		}

		throw new Error(`MOCK ACTION EXECTUION CONTEXT: Could not update part instance: ${part}`)
	}
	/** Destructive actions */
	/** Stop any piecesInstances on the specified sourceLayers. Returns ids of piecesInstances that were affected */
	public async stopPiecesOnLayers(_sourceLayerIds: string[], _timeOffset?: number): Promise<string[]> {
		return []
	}
	/** Stop piecesInstances by id. Returns ids of piecesInstances that were removed */
	public async stopPieceInstances(_pieceInstanceIds: string[], _timeOffset?: number): Promise<string[]> {
		return []
	}
	/** Remove piecesInstances by id. Returns ids of piecesInstances that were removed */
	public async removePieceInstances(part: 'current' | 'next', pieceInstanceIds: string[]): Promise<string[]> {
		if (part === 'current') {
			this.currentPieceInstances = this.currentPieceInstances.filter(p => !pieceInstanceIds.includes(p._id))
		} else if (this.nextPieceInstances) {
			this.nextPieceInstances = this.nextPieceInstances.filter(p => !pieceInstanceIds.includes(p._id))
		}

		return pieceInstanceIds
	}
	public async moveNextPart(_partDelta: number, _segmentDelta: number): Promise<void> {
		throw new Error('Method not implemented.')
	}
	/** Set flag to perform take after executing the current action. Returns state of the flag after each call. */
	public async takeAfterExecuteAction(take: boolean): Promise<boolean> {
		this.takeAfterExecute = take

		return take
	}
	public async hackGetMediaObjectDuration(_mediaId: string): Promise<number | undefined> {
		return undefined
	}
	public getPackageInfo(_packageId: string): PackageInfo.Any[] {
		return []
	}
	public getCurrentTime(): number {
		throw new Error('Method not implemented.')
	}

	public async blockTakeUntil(_time: Time | null): Promise<void> {
		return undefined
	}

	public notifyUserInfo(_message: string, _params?: { [p: string]: any }): void {
		// Do nothing
	}
}

export interface PartNote {
	type: NoteType
	origin: {
		name: string
		roId?: string
		segmentId?: string
		partId?: string
		pieceId?: string
	}
	message: string
}

export function makeMockAFVDContext(studioConfigOverrides?: Partial<StudioConfig>) {
	const mockContext = new SegmentUserContext(
		'test',
		mappingsDefaultsAFVD,
		parseStudioConfigAFVD,
		parseShowStyleConfigAFVD
	)
	mockContext.studioConfig = { ...defaultStudioConfig, ...studioConfigOverrides } as any
	mockContext.showStyleConfig = defaultShowStyleConfig as any

	return mockContext
}
