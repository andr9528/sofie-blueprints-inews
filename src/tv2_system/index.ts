import { BlueprintManifestType, SystemBlueprintManifest } from '@tv2media/blueprints-integration'
import * as _ from 'underscore'

declare const VERSION: string // Injected by webpack
declare const VERSION_TSR: string // Injected by webpack
declare const VERSION_INTEGRATION: string // Injected by webpack

const manifest: SystemBlueprintManifest = {
	blueprintType: BlueprintManifestType.SYSTEM,

	blueprintVersion: VERSION,
	integrationVersion: VERSION_INTEGRATION,
	TSRVersion: VERSION_TSR,
	coreMigrations: []
}

export default manifest
