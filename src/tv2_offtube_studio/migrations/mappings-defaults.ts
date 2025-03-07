import { BlueprintMapping, BlueprintMappings, LookaheadMode, TSR } from '@tv2media/blueprints-integration'
import {
	AbstractLLayerServerEnable,
	CasparPlayerClip,
	CasparPlayerClipLoadingLoop,
	GetDSKMappings,
	literal
} from 'tv2-common'
import { AbstractLLayer } from 'tv2-constants'
import { ATEMModel } from '../../types/atem'
import {
	OfftubeAbstractLLayer,
	OfftubeAtemLLayer,
	OfftubeCasparLLayer,
	OfftubeGraphicLLayer,
	OfftubeSisyfosLLayer
} from '../layers'

const MAPPINGS_ABSTRACT: BlueprintMappings = {
	core_abstract: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		lookahead: LookaheadMode.NONE
	}),
	[AbstractLLayer.ServerEnablePending]: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		lookahead: LookaheadMode.NONE
	}),
	[AbstractLLayerServerEnable(1)]: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		lookahead: LookaheadMode.NONE
	}),
	[AbstractLLayerServerEnable(2)]: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		lookahead: LookaheadMode.NONE
	}),
	[OfftubeAbstractLLayer.OfftubeAbstractLLayerAbstractLookahead]: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		lookahead: LookaheadMode.WHEN_CLEAR
	}),
	[AbstractLLayer.IdentMarker]: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		lookahead: LookaheadMode.NONE
	}),
	[AbstractLLayer.AudioBedBaseline]: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		lookahead: LookaheadMode.NONE
	})
}

const MAPPINGS_SISYFOS: BlueprintMappings = {
	[OfftubeSisyfosLLayer.SisyfosConfig]: literal<TSR.MappingSisyfosChannels & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNELS
	}),
	[OfftubeSisyfosLLayer.SisyfosGroupStudioMics]: literal<TSR.MappingSisyfosChannels & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNELS
	}),
	[OfftubeSisyfosLLayer.SisyfosGroupServer]: literal<TSR.MappingSisyfosChannels & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNELS
	}),
	[OfftubeSisyfosLLayer.SisyfosPersistedLevels]: literal<TSR.MappingSisyfosChannels & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNELS
	}),
	[OfftubeSisyfosLLayer.SisyfosSourceClipPending]: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		lookahead: LookaheadMode.NONE
	}),
	[OfftubeSisyfosLLayer.SisyfosSourceHost_1_ST_A]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		layerName: 'KOM 1',
		channel: 0,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: true
	}),
	[OfftubeSisyfosLLayer.SisyfosSourceHost_2_ST_A]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		layerName: 'KOM 2',
		channel: 1,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: true
	}),
	[OfftubeSisyfosLLayer.SisyfosSourceHost_3_ST_A]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		layerName: 'KOM 3',
		channel: 2,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: true
	}),
	[OfftubeSisyfosLLayer.SisyfosSourceLive_1_Stereo]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		layerName: 'FEED 1 Stereo',
		channel: 3,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: true
	}),
	[OfftubeSisyfosLLayer.SisyfosSourceLive_1_Surround]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		layerName: 'FEED 1 5.1',
		channel: 4,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: true
	}),
	[OfftubeSisyfosLLayer.SisyfosSourceLive_2_Stereo]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		layerName: 'FEED 2 Stereo',
		channel: 5,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: true
	}),
	[OfftubeSisyfosLLayer.SisyfosSourceLive_3]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		layerName: 'LIVE 1 Reporter',
		channel: 6,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: true
	}),
	[OfftubeSisyfosLLayer.SisyfosSourceServerA]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		layerName: 'Server A',
		channel: 7,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: true
	}),
	[OfftubeSisyfosLLayer.SisyfosSourceServerB]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		layerName: 'Server B',
		channel: 8,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: true
	}),
	[OfftubeSisyfosLLayer.SisyfosSourceJingle]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		layerName: 'JINGLE',
		channel: 9,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: true
	}),
	[OfftubeSisyfosLLayer.SisyfosSourceAudiobed]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		layerName: 'JINGLE',
		channel: 9,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: true
	}),
	[OfftubeSisyfosLLayer.SisyfosN1]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		layerName: 'MixMinus (N-1)',
		channel: 10,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: true
	}),
	[OfftubeSisyfosLLayer.SisyfosSourceDisp1]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		layerName: 'Disp 1',
		channel: 11,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: true
	}),
	[OfftubeSisyfosLLayer.SisyfosSourceDisp2]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		layerName: 'Disp 2',
		channel: 12,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: true
	}),
	[OfftubeSisyfosLLayer.SisyfosResync]: literal<TSR.MappingSisyfos & BlueprintMapping>({
		device: TSR.DeviceType.SISYFOS,
		deviceId: 'sisyfos0',
		channel: -1,
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingSisyfosType.CHANNEL,
		setLabelToLayerName: false
	})
}

const MAPPINGS_CASPAR: BlueprintMappings = {
	[OfftubeCasparLLayer.CasparPlayerClipPending]: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		lookahead: LookaheadMode.PRELOAD,
		lookaheadDepth: 1,
		lookaheadMaxSearchDistance: 1
	}),
	[CasparPlayerClip(1)]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'Server A',
		lookahead: LookaheadMode.NONE,
		channel: 1,
		layer: 110,
		previewWhenNotOnAir: true
	}),
	[CasparPlayerClip(2)]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'Server B',
		lookahead: LookaheadMode.NONE,
		channel: 2,
		layer: 110,
		previewWhenNotOnAir: true
	}),
	[CasparPlayerClipLoadingLoop(1)]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'Server A Loading Loop',
		lookahead: LookaheadMode.NONE,
		channel: 1,
		layer: 109
	}),
	[CasparPlayerClipLoadingLoop(2)]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'Server B Loading Loop',
		lookahead: LookaheadMode.NONE,
		channel: 2,
		layer: 109
	}),
	[OfftubeCasparLLayer.CasparPlayerJingle]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'Jingle',
		lookahead: LookaheadMode.PRELOAD,
		channel: 3,
		layer: 110,
		previewWhenNotOnAir: false
	}),
	[OfftubeCasparLLayer.CasparPlayerJinglePreload]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'Jingle (Preloading First Frame)',
		lookahead: LookaheadMode.PRELOAD,
		lookaheadMaxSearchDistance: 1,
		channel: 3,
		layer: 110,
		previewWhenNotOnAir: true
	}),
	[OfftubeCasparLLayer.CasparCGLYD]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'Audio Beds',
		lookahead: LookaheadMode.NONE,
		channel: 3,
		layer: 101
	}),
	[OfftubeCasparLLayer.CasparGraphicsFullLoop]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'Full Background Loop',
		lookahead: LookaheadMode.WHEN_CLEAR,
		channel: 6,
		layer: 100,
		previewWhenNotOnAir: true
	}),
	[OfftubeGraphicLLayer.GraphicLLayerLocators]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'GFX Locators',
		lookahead: LookaheadMode.WHEN_CLEAR,
		lookaheadMaxSearchDistance: 1,
		channel: 4,
		layer: 120,
		previewWhenNotOnAir: true
	}),
	[OfftubeCasparLLayer.CasparCGDVEKey]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'DVE Key',
		lookahead: LookaheadMode.WHEN_CLEAR,
		lookaheadMaxSearchDistance: 1,
		previewWhenNotOnAir: true,
		channel: 4,
		layer: 109
	}),
	[OfftubeCasparLLayer.CasparCGDVEKeyedLoop]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'DVE Loop (keyed)',
		lookahead: LookaheadMode.WHEN_CLEAR,
		previewWhenNotOnAir: true,
		channel: 4,
		layer: 110
	}),
	[OfftubeCasparLLayer.CasparCGDVEFrame]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'DVE Frame',
		lookahead: LookaheadMode.WHEN_CLEAR,
		lookaheadMaxSearchDistance: 1,
		previewWhenNotOnAir: true,
		channel: 4,
		layer: 111
	}),
	[OfftubeCasparLLayer.CasparCGDVELoop]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'DVE Loop',
		lookahead: LookaheadMode.WHEN_CLEAR,
		previewWhenNotOnAir: true,
		channel: 5,
		layer: 110
	})
}

const MAPPINGS_GRAPHICS: BlueprintMappings = {
	[OfftubeGraphicLLayer.GraphicLLayerAdLibs]: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		layerName: 'GFX AdLibs',
		lookahead: LookaheadMode.NONE
	}),
	[OfftubeGraphicLLayer.GraphicLLayerDesign]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'GFX Design',
		lookahead: LookaheadMode.NONE,
		previewWhenNotOnAir: false,
		channel: 3,
		layer: 111
	}),
	[OfftubeGraphicLLayer.GraphicLLayerOverlay]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'GFX Overlay',
		lookahead: LookaheadMode.NONE,
		previewWhenNotOnAir: false,
		channel: 3,
		layer: 111
	}),
	[OfftubeGraphicLLayer.GraphicLLayerOverlayHeadline]: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		lookahead: LookaheadMode.NONE
	}),
	[OfftubeGraphicLLayer.GraphicLLayerOverlayIdent]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'GFX Ident',
		lookahead: LookaheadMode.NONE,
		previewWhenNotOnAir: false,
		channel: 3,
		layer: 111
	}),
	[OfftubeGraphicLLayer.GraphicLLayerOverlayLower]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'GFX Bund',
		lookahead: LookaheadMode.NONE,
		previewWhenNotOnAir: false,
		channel: 3,
		layer: 111
	}),
	[OfftubeGraphicLLayer.GraphicLLayerOverlayTema]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'GFX Tema',
		lookahead: LookaheadMode.NONE,
		previewWhenNotOnAir: false,
		channel: 3,
		layer: 111
	}),
	[OfftubeGraphicLLayer.GraphicLLayerOverlayTopt]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'GFX Topt',
		lookahead: LookaheadMode.NONE,
		previewWhenNotOnAir: false,
		channel: 3,
		layer: 111
	}),
	[OfftubeGraphicLLayer.GraphicLLayerPilot]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'GFX Pilot (Full)',
		lookahead: LookaheadMode.WHEN_CLEAR,
		channel: 6,
		layer: 108,
		previewWhenNotOnAir: true
	}),
	/** TODO: Revisit these */
	[OfftubeGraphicLLayer.GraphicLLayerPilotOverlay]: literal<TSR.MappingCasparCG & BlueprintMapping>({
		device: TSR.DeviceType.CASPARCG,
		deviceId: 'caspar01',
		layerName: 'GFX Pilot (Overlay)',
		lookahead: LookaheadMode.PRELOAD,
		previewWhenNotOnAir: true,
		channel: 6,
		layer: 111
	}),
	// Full loop and DVE loop are the same channel in Q2.
	// No mapping to caspar to avoid conflicts.
	[OfftubeGraphicLLayer.GraphicLLayerFullLoop]: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		layerName: 'GFX Full Loop',
		lookahead: LookaheadMode.NONE
	}),
	// No Screen for now
	[OfftubeGraphicLLayer.GraphicLLayerWall]: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		layerName: 'GFX Wall',
		lookahead: LookaheadMode.NONE
	}),
	[OfftubeGraphicLLayer.GraphicLLayerConcept]: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		layerName: 'Override Concept',
		lookahead: LookaheadMode.NONE
	})
}

const MAPPINGS_ATEM: BlueprintMappings = {
	[OfftubeAtemLLayer.AtemMEClean]: literal<TSR.MappingAtem & BlueprintMapping>({
		device: TSR.DeviceType.ATEM,
		deviceId: 'atem0',
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingAtemType.MixEffect,
		index: 1 // 1 = ME2
	}),
	[OfftubeAtemLLayer.AtemMEProgram]: literal<TSR.MappingAtem & BlueprintMapping>({
		device: TSR.DeviceType.ATEM,
		deviceId: 'atem0',
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingAtemType.MixEffect,
		index: 0 // 0 = ME1
	}),
	[OfftubeAtemLLayer.AtemMENext]: literal<TSR.MappingAtem & BlueprintMapping>({
		device: TSR.DeviceType.ATEM,
		deviceId: 'atem0',
		lookahead: LookaheadMode.WHEN_CLEAR,
		mappingType: TSR.MappingAtemType.MixEffect,
		index: 0, // 0 = ME1
		lookaheadDepth: 1
	}),
	[OfftubeAtemLLayer.AtemMENextJingle]: literal<TSR.MappingAtem & BlueprintMapping>({
		device: TSR.DeviceType.ATEM,
		deviceId: 'atem0',
		lookahead: LookaheadMode.PRELOAD,
		lookaheadMaxSearchDistance: 1,
		mappingType: TSR.MappingAtemType.MixEffect,
		index: 0 // 0 = ME1
	}),
	...GetDSKMappings(ATEMModel.PRODUCTION_STUDIO_4K_2ME),
	[OfftubeAtemLLayer.AtemAuxClean]: literal<TSR.MappingAtem & BlueprintMapping>({
		device: TSR.DeviceType.ATEM,
		deviceId: 'atem0',
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingAtemType.Auxilliary,
		index: 0 // 0 = out 1
	}),
	[OfftubeAtemLLayer.AtemAuxScreen]: literal<TSR.MappingAtem & BlueprintMapping>({
		device: TSR.DeviceType.ATEM,
		deviceId: 'atem0',
		lookahead: LookaheadMode.NONE,
		mappingType: TSR.MappingAtemType.Auxilliary,
		index: 1 // 1 = out 2
	}),
	[OfftubeAtemLLayer.AtemAuxServerLookahead]: literal<TSR.MappingAtem & BlueprintMapping>({
		device: TSR.DeviceType.ATEM,
		deviceId: 'atem0',
		lookahead: LookaheadMode.WHEN_CLEAR,
		mappingType: TSR.MappingAtemType.Auxilliary,
		index: 2 // 2 = out 3
	}),
	[OfftubeAtemLLayer.AtemSSrcArt]: literal<TSR.MappingAtem & BlueprintMapping>({
		device: TSR.DeviceType.ATEM,
		deviceId: 'atem0',
		lookahead: LookaheadMode.WHEN_CLEAR,
		lookaheadMaxSearchDistance: 1,
		mappingType: TSR.MappingAtemType.SuperSourceProperties,
		index: 0 // 0 = SS
	}),
	[OfftubeAtemLLayer.AtemSSrcDefault]: literal<TSR.MappingAtem & BlueprintMapping>({
		device: TSR.DeviceType.ATEM,
		deviceId: 'atem0',
		lookahead: LookaheadMode.WHEN_CLEAR,
		lookaheadMaxSearchDistance: 1,
		mappingType: TSR.MappingAtemType.SuperSourceBox,
		index: 0 // 0 = SS
	}),
	[OfftubeAtemLLayer.AtemSSrcBox1]: literal<TSR.MappingAtem & BlueprintMapping>({
		device: TSR.DeviceType.ATEM,
		deviceId: 'atem0',
		lookahead: LookaheadMode.WHEN_CLEAR,
		lookaheadMaxSearchDistance: 1,
		mappingType: TSR.MappingAtemType.SuperSourceBox,
		index: 0 // 0 = SS
	}),
	[OfftubeAtemLLayer.AtemSSrcBox2]: literal<TSR.MappingAtem & BlueprintMapping>({
		device: TSR.DeviceType.ATEM,
		deviceId: 'atem0',
		lookahead: LookaheadMode.WHEN_CLEAR,
		lookaheadMaxSearchDistance: 1,
		mappingType: TSR.MappingAtemType.SuperSourceBox,
		index: 0 // 0 = SS
	}),
	[OfftubeAtemLLayer.AtemSSrcBox3]: literal<TSR.MappingAtem & BlueprintMapping>({
		device: TSR.DeviceType.ATEM,
		deviceId: 'atem0',
		lookahead: LookaheadMode.WHEN_CLEAR,
		lookaheadMaxSearchDistance: 1,
		mappingType: TSR.MappingAtemType.SuperSourceBox,
		index: 0 // 0 = SS
	}),
	[OfftubeAtemLLayer.AtemSSrcBox4]: literal<TSR.MappingAtem & BlueprintMapping>({
		device: TSR.DeviceType.ATEM,
		deviceId: 'atem0',
		lookahead: LookaheadMode.WHEN_CLEAR,
		lookaheadMaxSearchDistance: 1,
		mappingType: TSR.MappingAtemType.SuperSourceBox,
		index: 0 // 0 = SS
	}),
	// TODO: Future: Mix Minus in Offtubes
	[OfftubeAtemLLayer.AtemAuxVideoMixMinus]: literal<TSR.MappingAbstract & BlueprintMapping>({
		device: TSR.DeviceType.ABSTRACT,
		deviceId: 'abstract0',
		lookahead: LookaheadMode.NONE
	})
}

export default literal<BlueprintMappings>({
	...MAPPINGS_ABSTRACT,
	...MAPPINGS_SISYFOS,
	...MAPPINGS_CASPAR,
	...MAPPINGS_GRAPHICS,
	...MAPPINGS_ATEM
})
