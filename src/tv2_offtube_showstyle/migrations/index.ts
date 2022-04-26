import { MigrationStepShowStyle } from '@tv2media/blueprints-integration'
import {
	AddGraphicToGFXTable,
	GetDefaultAdLibTriggers,
	GetDSKSourceLayerNames,
	literal,
	RemoveOldShortcuts,
	removeSourceLayer,
	renameSourceLayer,
	SetShowstyleTransitionMigrationStep,
	StripFolderFromAudioBedConfig,
	StripFolderFromDVEConfig,
	UpsertValuesIntoTransitionTable
} from 'tv2-common'
import { SharedGraphicLLayer, SharedSourceLayers } from 'tv2-constants'
import * as _ from 'underscore'
import { SetSourceLayerNameMigrationStep } from '../../tv2-common/migrations/shortcuts'
import { ATEMModel } from '../../types/atem'
import { OfftubeSourceLayer } from '../layers'
import { GetDefaultStudioSourcesForOfftube } from './hotkeys'
import sourcelayerDefaults from './sourcelayer-defaults'
import {
	forceSourceLayerToDefaults,
	getOutputLayerDefaultsMigrationSteps,
	getSourceLayerDefaultsMigrationSteps,
	remapTableColumnValues
} from './util'
import { getCreateVariantMigrationSteps } from './variants-defaults'

declare const VERSION: string // Injected by webpack

/**
 * Old layers, used here for reference. Should not be used anywhere else.
 */
enum VizLLayer {
	VizLLayerOverlay = 'viz_layer_overlay',
	VizLLayerOverlayIdent = 'viz_layer_overlay_ident',
	VizLLayerOverlayTopt = 'viz_layer_overlay_topt',
	VizLLayerOverlayLower = 'viz_layer_overlay_lower',
	VizLLayerOverlayHeadline = 'viz_layer_overlay_headline',
	VizLLayerOverlayTema = 'viz_layer_overlay_tema',
	VizLLayerPilot = 'viz_layer_pilot',
	VizLLayerPilotOverlay = 'viz_layer_pilot_overlay',
	VizLLayerDesign = 'viz_layer_design',
	VizLLayerAdLibs = 'viz_layer_adlibs',
	VizLLayerWall = 'viz_layer_wall'
}

export const remapVizLLayer: Map<string, string> = new Map([
	[VizLLayer.VizLLayerOverlay, SharedGraphicLLayer.GraphicLLayerOverlay],
	[VizLLayer.VizLLayerOverlayIdent, SharedGraphicLLayer.GraphicLLayerOverlayIdent],
	[VizLLayer.VizLLayerOverlayTopt, SharedGraphicLLayer.GraphicLLayerOverlayIdent],
	[VizLLayer.VizLLayerOverlayLower, SharedGraphicLLayer.GraphicLLayerOverlayLower],
	[VizLLayer.VizLLayerOverlayHeadline, SharedGraphicLLayer.GraphicLLayerOverlayHeadline],
	[VizLLayer.VizLLayerOverlayTema, SharedGraphicLLayer.GraphicLLayerOverlayTema],
	[VizLLayer.VizLLayerPilot, SharedGraphicLLayer.GraphicLLayerPilot],
	[VizLLayer.VizLLayerPilotOverlay, SharedGraphicLLayer.GraphicLLayerPilotOverlay],
	[VizLLayer.VizLLayerDesign, SharedGraphicLLayer.GraphicLLayerDesign],
	[VizLLayer.VizLLayerAdLibs, SharedGraphicLLayer.GraphicLLayerAdLibs],
	[VizLLayer.VizLLayerWall, SharedGraphicLLayer.GraphicLLayerWall]
])

export const remapVizDOvl: Map<string, string> = new Map([['viz-d-ovl', 'OVL1']])

const SHOW_STYLE_ID = 'tv2_offtube_showstyle'

/**
 * Versions:
 * 0.1.0: Core 0.24.0
 */

export const showStyleMigrations: MigrationStepShowStyle[] = literal<MigrationStepShowStyle[]>([
	// Fill in any layers that did not exist before
	// Note: These should only be run as the very final step of all migrations. otherwise they will add items too early, and confuse old migrations
	...getCreateVariantMigrationSteps(),
	...remapTableColumnValues('0.1.0', 'GFXTemplates', 'LayerMapping', remapVizLLayer),
	...getSourceLayerDefaultsMigrationSteps('1.3.0', true),

	/**
	 * 1.3.1
	 * - Set default transition
	 * - Populate transition table
	 */
	SetShowstyleTransitionMigrationStep('1.3.1', '/ NBA WIPE'),
	...UpsertValuesIntoTransitionTable('1.3.1', [{ Transition: 'MIX8' }, { Transition: 'MIX25' }]),

	/**
	 * 1.3.8
	 * - Remove Clear Shortcut from FULL graphic layer
	 */
	forceSourceLayerToDefaults('1.3.8', OfftubeSourceLayer.PgmDVE),

	/**
	 * 1.3.9
	 * - Create Design layer
	 */
	forceSourceLayerToDefaults('1.3.9', OfftubeSourceLayer.PgmDesign),
	forceSourceLayerToDefaults('1.3.9', OfftubeSourceLayer.PgmJingle),

	/**
	 * 1.4.6
	 * - Live shortcuts (recall last live)
	 */
	forceSourceLayerToDefaults('1.4.6', OfftubeSourceLayer.PgmLive),

	renameSourceLayer('1.5.0', 'Offtube', 'studio0_offtube_graphicsFull', SharedSourceLayers.SelectedAdlibGraphicsFull),
	renameSourceLayer('1.5.0', 'Offtube', 'studio0_full', SharedSourceLayers.PgmPilot),
	renameSourceLayer('1.5.0', 'Offtube', 'studio0_offtube_continuity', SharedSourceLayers.PgmContinuity),
	removeSourceLayer('1.5.0', 'Offtube', 'studio0_offtube_pgm_source_select'),
	forceSourceLayerToDefaults('1.5.1', OfftubeSourceLayer.PgmDVE),

	/***
	 * 1.5.2
	 * - Remove PgmJingle shortcuts, moved to JingleAdlib layer
	 */
	forceSourceLayerToDefaults('1.5.2', OfftubeSourceLayer.PgmJingle),

	AddGraphicToGFXTable('1.5.4', 'Offtube', {
		VizTemplate: 'locators',
		SourceLayer: '',
		LayerMapping: SharedGraphicLLayer.GraphicLLayerLocators,
		INewsCode: '',
		INewsName: 'locators',
		VizDestination: '',
		OutType: '',
		IsDesign: false
	}),

	/**
	 * 1.6.1
	 * - Remove studio0_dsk_cmd, will be replaced by studio0_dsk_1_cmd by defaults
	 */
	removeSourceLayer('1.6.1', 'AFVD', 'studio0_dsk_cmd'),

	/**
	 * 1.6.2
	 * - Move Recall Last DVE shortcut to PGMDVEAdLib
	 */
	forceSourceLayerToDefaults('1.6.2', OfftubeSourceLayer.PgmDVE),
	forceSourceLayerToDefaults('1.6.2', OfftubeSourceLayer.PgmDVEAdLib),

	/**
	 * 1.6.3
	 * - Hide DSK toggle layers
	 */
	...GetDSKSourceLayerNames(ATEMModel.PRODUCTION_STUDIO_4K_2ME).map(layerName =>
		forceSourceLayerToDefaults('1.6.3', layerName)
	),

	/**
	 * 1.6.9
	 * - Renaming source layers
	 */
	// OVERLAY group
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmGraphicsIdent, 'GFX Ident'),
	SetSourceLayerNameMigrationStep(
		'1.6.9',
		OfftubeSourceLayer.PgmGraphicsIdentPersistent,
		'GFX Ident Persistent (hidden)'
	),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmGraphicsTop, 'GFX Top'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmGraphicsLower, 'GFX Lowerthirds'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmGraphicsHeadline, 'GFX Headline'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmGraphicsOverlay, 'GFX Overlay (fallback)'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmGraphicsTLF, 'GFX Telefon'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmGraphicsTema, 'GFX Tema'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.WallGraphics, 'GFX Wall'),
	SetSourceLayerNameMigrationStep('1.6.9', SharedSourceLayers.PgmPilotOverlay, 'GFX overlay (VCP)(shared)'),
	// PGM group
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmCam, 'Camera'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmDVEAdLib, 'DVE (adlib)'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmVoiceOver, 'VO'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmPilot, 'GFX FULL (VCP)'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmContinuity, 'Continuity'),
	// MUSIK group
	SetSourceLayerNameMigrationStep('1.6.9', SharedSourceLayers.PgmAudioBed, 'Audiobed (shared)'),
	// SEC group
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmAdlibGraphicCmd, 'GFX Cmd (adlib)'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmSisyfosAdlibs, 'Sisyfos (adlib)'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.PgmAdlibJingle, 'Effect (adlib)'),
	// SELECTED_ADLIB group
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.SelectedAdLibDVE, 'DVE (selected)'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.SelectedServer, 'Server (selected)'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.SelectedVoiceOver, 'VO (selected)'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.SelectedAdlibGraphicsFull, 'GFX Full (selected)'),
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.SelectedAdlibJingle, 'Jingle (selected)'),
	// AUX group
	SetSourceLayerNameMigrationStep('1.6.9', OfftubeSourceLayer.AuxStudioScreen, 'AUX studio screen'),

	/**
	 * 1.6.10
	 * - Remove 'audio/' from soundbed configs
	 * - Remove 'dve/' from DVE frame/key configs
	 * - Add PgmJingle to presenter screen
	 */
	StripFolderFromAudioBedConfig('1.6.10', 'AFVD'),
	StripFolderFromDVEConfig('1.6.10', 'AFVD'),
	forceSourceLayerToDefaults('1.6.10', OfftubeSourceLayer.PgmJingle),

	/**
	 * 1.7.0
	 * - Remove DVE box layers (no longer needed due to triggers)
	 * - Remove old shortcuts
	 * - Migrate shortcuts to Action Triggers
	 */
	removeSourceLayer('1.7.0', 'QBOX', 'studio0_dve_box1'),
	removeSourceLayer('1.7.0', 'QBOX', 'studio0_dve_box2'),
	removeSourceLayer('1.7.0', 'QBOX', 'studio0_dve_box3'),
	removeSourceLayer('1.7.0', 'QBOX', 'studio0_dve_box4'),
	RemoveOldShortcuts('1.7.0', SHOW_STYLE_ID, sourcelayerDefaults),
	GetDefaultAdLibTriggers('1.7.0', SHOW_STYLE_ID, {}, GetDefaultStudioSourcesForOfftube, true),

	...getSourceLayerDefaultsMigrationSteps(VERSION),
	...getOutputLayerDefaultsMigrationSteps(VERSION),
	GetDefaultAdLibTriggers(VERSION, SHOW_STYLE_ID, {}, GetDefaultStudioSourcesForOfftube, false)
])
