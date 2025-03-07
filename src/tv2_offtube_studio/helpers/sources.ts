import * as _ from 'underscore'

import { SourceLayerType } from '@tv2media/blueprints-integration'
import { ParseMappingTable, SourceInfoType, SourceMapping } from 'tv2-common'
import { OfftubeStudioConfig } from './config'

export function parseMediaPlayers(studioConfig: OfftubeStudioConfig): Array<{ id: string; val: string }> {
	return studioConfig.ABMediaPlayers.map(player => ({ id: player.SourceName, val: player.AtemSource.toString() }))
}

export function parseSources(studioConfig: OfftubeStudioConfig): SourceMapping {
	return {
		cameras: ParseMappingTable(studioConfig.SourcesCam, SourceInfoType.KAM, SourceLayerType.CAMERA),
		lives: ParseMappingTable(studioConfig.SourcesRM, SourceInfoType.LIVE, SourceLayerType.REMOTE),
		feeds: ParseMappingTable(studioConfig.SourcesFeed, SourceInfoType.FEED, SourceLayerType.REMOTE),
		replays: []
	}
}
