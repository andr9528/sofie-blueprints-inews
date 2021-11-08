import { ISourceLayer, SourceLayerType } from '@sofie-automation/blueprints-integration'
import { GetDSKSourceLayerDefaults, literal } from 'tv2-common'
import { SharedSourceLayers } from 'tv2-constants'
import { ATEMModel } from '../../types/atem'
import { SourceLayer } from '../layers'

// OVERLAY group
const OVERLAY: ISourceLayer[] = [
	{
		_id: SourceLayer.PgmGraphicsIdent,
		_rank: 10,
		name: 'GFX Ident',
		abbreviation: 'G',
		type: SourceLayerType.GRAPHICS,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: ',q,ctrl+shift+a',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmGraphicsIdentPersistent,
		_rank: 10,
		name: 'GFX Ident Persistent (hidden)',
		abbreviation: 'G',
		type: SourceLayerType.GRAPHICS,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: ',q,ctrl+shift+a',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: true,
		allowDisable: false,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmGraphicsTop,
		_rank: 20,
		name: 'GFX Top',
		abbreviation: 'G',
		type: SourceLayerType.GRAPHICS,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: ',q,ctrl+shift+s',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: true,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmGraphicsLower,
		_rank: 30,
		name: 'GFX Lowerthirds',
		abbreviation: 'G',
		type: SourceLayerType.GRAPHICS,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: 'a,s,d,f,g',
		clearKeyboardHotkey: ',q,ctrl+shift+d',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: true,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmGraphicsHeadline,
		_rank: 40,
		name: 'GFX Headline',
		abbreviation: 'G',
		type: SourceLayerType.GRAPHICS,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: ',q,ctrl+shift+f',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: true,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmGraphicsTema,
		_rank: 50,
		name: 'GFX Tema',
		abbreviation: 'G',
		type: SourceLayerType.GRAPHICS,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: ',q,ctrl+shift+g',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: true,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmGraphicsOverlay,
		_rank: 55,
		name: 'GFX Overlay (fallback)',
		abbreviation: 'O',
		type: SourceLayerType.GRAPHICS,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: ',q',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: true,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmPilotOverlay,
		_rank: 60,
		name: 'GFX Overlay (VCP)',
		abbreviation: 'O',
		type: SourceLayerType.GRAPHICS,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: ',q',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: true,
		onPresenterScreen: false
	}
]

// JINGLE group
const JINGLE: ISourceLayer[] = [
	{
		_id: SourceLayer.PgmJingle,
		_rank: 10,
		name: 'Jingle',
		abbreviation: '',
		type: SourceLayerType.TRANSITION,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: ',',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false
	}
]

// PGM group
const PGM: ISourceLayer[] = [
	{
		_id: SourceLayer.PgmCam,
		_rank: 0,
		name: 'Camera',
		abbreviation: 'K',
		type: SourceLayerType.CAMERA,
		exclusiveGroup: 'me1',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys:
			'f1,f2,f3,f4,ctrl+shift+alt+c,shift+ctrl+f1,shift+ctrl+f2,shift+ctrl+f3,shift+ctrl+f4,shift+ctrl+f5',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true
	},
	{
		_id: SourceLayer.PgmLive,
		_rank: 0,
		name: 'Live',
		abbreviation: 'L',
		type: SourceLayerType.REMOTE,
		exclusiveGroup: 'me1',
		isRemoteInput: true,
		isGuestInput: false,
		activateKeyboardHotkeys: 'ctrl+shift+alt+b,1,2,3,4,5,6,7,8,9,0',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		stickyOriginalOnly: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true
	},
	{
		_id: SourceLayer.PgmLocal,
		_rank: 0,
		name: 'EVS',
		abbreviation: 'EVS',
		type: SourceLayerType.LOCAL,
		exclusiveGroup: 'me1',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: 'r,e,i,u',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true
	},
	{
		_id: SourceLayer.PgmDVE,
		_rank: 0,
		name: 'DVE',
		abbreviation: 'D',
		type: SourceLayerType.SPLITS,
		exclusiveGroup: 'me1',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		stickyOriginalOnly: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true
	},
	{
		_id: SourceLayer.PgmDVEAdLib,
		_rank: 0,
		name: 'DVE (adlib)',
		abbreviation: 'D',
		type: SourceLayerType.SPLITS,
		exclusiveGroup: 'me1',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: 'f10,m,comma,.,n,c,b,v',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true
	},
	{
		_id: SourceLayer.PgmDVEBox1,
		_rank: 0,
		name: 'DVE Inp 1',
		abbreviation: 'DB1',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys:
			'shift+f1,shift+f2,shift+f3,shift+f4,shift+f5,shift+1,shift+2,shift+3,shift+4,shift+5,shift+6,shift+7,shift+8,shift+9,shift+0,shift+e,shift+d,shift+i,shift+u,shift+t',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: true,
		allowDisable: false,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmDVEBox2,
		_rank: 0,
		name: 'DVE Inp 2',
		abbreviation: 'DB2',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys:
			'ctrl+f1,ctrl+f2,ctrl+f3,ctrl+shift+alt+a,ctrl+f5,ctrl+1,ctrl+2,ctrl+3,ctrl+4,ctrl+5,ctrl+6,ctrl+7,ctrl+8,ctrl+9,ctrl+0,ctrl+e,ctrl+d,ctrl+i,ctrl+shift+alt+i,ctrl+alt+shift+g',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: true,
		allowDisable: false,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmDVEBox3,
		_rank: 0,
		name: 'DVE Inp 3',
		abbreviation: 'DB3',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys:
			'alt+shift+f1,alt+shift+f2,alt+shift+f3,alt+shift+f4,alt+shift+f5,alt+shift+1,alt+shift+2,alt+shift+3,alt+shift+4,alt+shift+5,alt+shift+6,alt+shift+7,alt+shift+8,alt+shift+9,alt+shift+0,alt+shift+e,alt+shift+d,alt+shift+g',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: true,
		allowDisable: false,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmDVEBox4,
		_rank: 0,
		name: 'DVE Inp 4',
		abbreviation: 'DB4',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: true,
		allowDisable: false,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmServer,
		_rank: 0,
		name: 'Server',
		abbreviation: 'S',
		type: SourceLayerType.VT,
		exclusiveGroup: 'me1',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true
	},
	{
		_id: SourceLayer.PgmVoiceOver,
		_rank: 0,
		name: 'VO',
		abbreviation: 'VO',
		type: SourceLayerType.LIVE_SPEAK,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: ',',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true
	},
	{
		_id: SourceLayer.PgmPilot,
		_rank: 0,
		name: 'GFX FULL (VCP)',
		abbreviation: 'F',
		type: SourceLayerType.GRAPHICS,
		exclusiveGroup: 'me1',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true
	},
	{
		_id: SourceLayer.PgmGraphicsTLF,
		_rank: 0,
		name: 'GFX Telefon',
		abbreviation: 'TLF',
		type: SourceLayerType.GRAPHICS,
		exclusiveGroup: 'me1',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: 'i',
		clearKeyboardHotkey: ',q',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: true,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true
	},
	{
		_id: SourceLayer.PgmContinuity,
		_rank: 0,
		name: 'Continuity',
		abbreviation: 'CONTINUITY',
		type: SourceLayerType.METADATA,
		exclusiveGroup: 'me1',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true
	}
]

// MUSIK group
const MUSIK: ISourceLayer[] = [
	{
		_id: SourceLayer.PgmAudioBed,
		_rank: 30,
		name: 'Audiobed (shared)',
		abbreviation: 'VO',
		type: SourceLayerType.AUDIO,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: ',minus',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false
	}
]

// MANUS group
const MANUS: ISourceLayer[] = [
	{
		_id: SourceLayer.PgmScript,
		_rank: 20,
		name: 'Manus',
		abbreviation: '',
		type: SourceLayerType.SCRIPT,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false
	}
]

// SEC group
const SEC: ISourceLayer[] = [
	{
		_id: SourceLayer.PgmAdlibJingle,
		_rank: 10,
		name: 'Effect (adlib)',
		abbreviation: '',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: 'NumpadDivide,NumpadSubtract,NumpadAdd',
		clearKeyboardHotkey: ',',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmAdlibGraphicCmd,
		_rank: 10,
		name: 'GFX Cmd (adlib)',
		abbreviation: '',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: ',space,,q',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false
	},
	...GetDSKSourceLayerDefaults(ATEMModel.CONSTELLATION_8K_UHD_MODE),
	{
		_id: SourceLayer.PgmDesign,
		_rank: 30,
		name: 'VIZ Design',
		abbreviation: '',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: 'shift+a',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: true,
		allowDisable: false,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmDVEBackground,
		_rank: 40,
		name: 'DVE Background',
		abbreviation: '',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: true,
		allowDisable: false,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmFullBackground,
		_rank: 41,
		name: 'GFX FULL Background',
		abbreviation: '',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: true,
		allowDisable: false,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.PgmSisyfosAdlibs,
		_rank: 50,
		name: 'Sisyfos (adlib)',
		abbreviation: '',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: 'ctrl+shift+alt+e,ctrl+shift+alt+d',
		clearKeyboardHotkey: ',',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.WallGraphics,
		_rank: 60,
		name: 'GFX Wall',
		abbreviation: '',
		type: SourceLayerType.GRAPHICS,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false
	}
]

// AUX group
const AUX: ISourceLayer[] = [
	{
		_id: SourceLayer.VizFullIn1,
		_rank: 10,
		name: 'Full Inp 1',
		abbreviation: '',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: 'ctrl+shift+alt+f',
		clearKeyboardHotkey: ',',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: true,
		allowDisable: false,
		onPresenterScreen: false
	},
	{
		_id: SourceLayer.AuxStudioScreen,
		_rank: 20,
		name: 'AUX studio screen',
		abbreviation: '',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys:
			'shift+ctrl+1,shift+ctrl+2,shift+ctrl+3,shift+ctrl+4,shift+ctrl+5,shift+ctrl+6,shift+ctrl+7,shift+ctrl+8,shift+ctrl+9,shift+ctrl+0,shift+ctrl+e',
		clearKeyboardHotkey: ',',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false
	}
]

// SELECTED_ADLIB group
const SELECTED_ADLIB: ISourceLayer[] = [
	{
		_id: SourceLayer.SelectedServer,
		_rank: 0,
		name: 'Server (selected)',
		abbreviation: 'S',
		type: SourceLayerType.VT,
		exclusiveGroup: 'server',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: true,
		isHidden: true,
		allowDisable: false,
		onPresenterScreen: true
	},
	{
		_id: SourceLayer.SelectedVoiceOver,
		_rank: 0,
		name: 'VO (selected)',
		abbreviation: 'VO',
		type: SourceLayerType.LIVE_SPEAK,
		exclusiveGroup: 'server',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: true,
		isHidden: true,
		allowDisable: false,
		onPresenterScreen: true
	},
	{
		_id: SharedSourceLayers.SelectedAdlibGraphicsFull,
		_rank: 0,
		name: 'GFX Full (selected)',
		abbreviation: 'GFX Full',
		type: SourceLayerType.GRAPHICS,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: true,
		isHidden: true,
		allowDisable: false,
		onPresenterScreen: true
	}
]

export default literal<ISourceLayer[]>([
	...OVERLAY,
	...JINGLE,
	...PGM,
	...MUSIK,
	...MANUS,
	...SEC,
	...SELECTED_ADLIB,
	...AUX
])
