import { ISourceLayer, SourceLayerType } from 'tv-automation-sofie-blueprints-integration'
import { literal } from '../../common/util'
import { SourceLayer } from '../layers'

// OVERLAY group
const OVERLAY: ISourceLayer[] = [
	{
		_id: SourceLayer.PgmGraphicsIdent,
		_rank: 10,
		name: 'Ident',
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
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmGraphicsIdentPersistent,
		_rank: 10,
		name: 'Ident Persistent',
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
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmGraphicsTop,
		_rank: 20,
		name: 'Top',
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
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmGraphicsLower,
		_rank: 30,
		name: 'Bund',
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
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmGraphicsHeadline,
		_rank: 40,
		name: 'Headline',
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
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmGraphicsTema,
		_rank: 50,
		name: 'Tema',
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
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmGraphicsOverlay,
		_rank: 55,
		name: 'Overlay',
		abbreviation: 'O',
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
		allowDisable: true,
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmPilotOverlay,
		_rank: 60,
		name: 'Overlay',
		abbreviation: 'O',
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
		allowDisable: true,
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
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
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	}
]

// PGM group
const PGM: ISourceLayer[] = [
	{
		_id: SourceLayer.PgmCam,
		_rank: 0,
		name: 'Kam',
		abbreviation: 'K',
		type: SourceLayerType.CAMERA,
		exclusiveGroup: 'me1',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: 'f1,f2,f3,f4,f5,shift+ctrl+f1,shift+ctrl+f2,shift+ctrl+f3,shift+ctrl+f4,shift+ctrl+f5',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmLive, // @todo: should queue by default
		_rank: 0,
		name: 'Live',
		abbreviation: 'L',
		type: SourceLayerType.REMOTE,
		exclusiveGroup: 'me1',
		isRemoteInput: true,
		isGuestInput: false,
		activateKeyboardHotkeys: '1,2,3,4,5,6,7,8,9,0',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: true,
		stickyOriginalOnly: true,
		activateStickyKeyboardHotkey: 'f11',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmDVE, // @todo: should queue by default
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
		isSticky: true,
		stickyOriginalOnly: true,
		activateStickyKeyboardHotkey: 'f10',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmDVEAdlib, // @todo: should queue by default
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
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmDVEBox1,
		_rank: 0,
		name: 'DVE INP1',
		abbreviation: 'DB1',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys:
			'shift+f1,shift+f2,shift+f3,shift+f4,shift+f5,shift+1,shift+2,shift+3,shift+4,shift+5,shift+6,shift+7,shift+8,shift+9,shift+0',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmDVEBox2,
		_rank: 0,
		name: 'DVE INP2',
		abbreviation: 'DB2',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys:
			'ctrl+f1,ctrl+f2,ctrl+f3,ctrl+f4,ctrl+f5,ctrl+1,ctrl+2,ctrl+3,ctrl+4,ctrl+5,ctrl+6,ctrl+7,ctrl+8,ctrl+9,ctrl+0',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmDVEBox3,
		_rank: 0,
		name: 'DVE INP3',
		abbreviation: 'DB3',
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
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
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
		onPresenterScreen: true,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmVoiceOver,
		_rank: 0,
		name: 'Voice Over',
		abbreviation: 'VO',
		type: SourceLayerType.LIVE_SPEAK,
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
		onPresenterScreen: true,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmPilot,
		_rank: 0,
		name: 'Full',
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
		onPresenterScreen: true,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmGraphicsTLF,
		_rank: 0,
		name: 'Telefon',
		abbreviation: 'TLF',
		type: SourceLayerType.GRAPHICS,
		exclusiveGroup: 'me1',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: 'i',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: true,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmDelayed,
		_rank: 0,
		name: 'EVS',
		abbreviation: 'EVS',
		type: SourceLayerType.VT,
		exclusiveGroup: 'me1',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: 'e',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: true,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmContinuity,
		_rank: 0,
		name: 'CONTINUITY',
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
		onPresenterScreen: true,
		unlimited: false,
		onPGMClean: false
	}
]

// MUSIK group
const MUSIK: ISourceLayer[] = [
	{
		_id: SourceLayer.PgmAudioBed,
		_rank: 30,
		name: 'Audio bed',
		abbreviation: 'VO',
		type: SourceLayerType.AUDIO,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: '',
		clearKeyboardHotkey: ',add',
		assignHotkeysToGlobalAdlibs: false,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	}
]
// MANUS group
const MANUS: ISourceLayer[] = [
	// {
	// 	_id: SourceLayer.PgmSlutord,
	// 	_rank: 10,
	// 	name: 'Slutord',
	// 	abbreviation: '',
	// 	type: SourceLayerType.SCRIPT,
	// 	exclusiveGroup: '',
	// 	isRemoteInput: false,
	// 	isGuestInput: false,
	// 	activateKeyboardHotkeys: '',
	// 	clearKeyboardHotkey: '',
	// 	assignHotkeysToGlobalAdlibs: false,
	// 	isSticky: false,
	// 	activateStickyKeyboardHotkey: '',
	// 	isQueueable: false,
	// 	isHidden: false,
	// 	allowDisable: false,
	// 	onPresenterScreen: false,
	// 	unlimited: false,
	// 	onPGMClean: false
	// },
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
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	}
]

// SEC group
const SEC: ISourceLayer[] = [
	{
		_id: SourceLayer.PgmAdlibVizCmd,
		_rank: 10,
		name: 'Viz Full',
		abbreviation: '',
		type: SourceLayerType.UNKNOWN,
		exclusiveGroup: '',
		isRemoteInput: false,
		isGuestInput: false,
		activateKeyboardHotkeys: ',space',
		clearKeyboardHotkey: '',
		assignHotkeysToGlobalAdlibs: true,
		isSticky: false,
		activateStickyKeyboardHotkey: '',
		isQueueable: false,
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmDSK,
		_rank: 20,
		name: 'DSK off',
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
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmDesign,
		_rank: 30,
		name: 'VIZ Design',
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
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
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
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	},
	{
		_id: SourceLayer.PgmSisyfosAdlibs,
		_rank: 50,
		name: 'Sisyfos Adlibs',
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
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	}
]

// AUX group
const AUX: ISourceLayer[] = [
	{
		_id: SourceLayer.VizFullIn1,
		_rank: 10,
		name: 'Viz Full',
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
		isHidden: false,
		allowDisable: false,
		onPresenterScreen: false,
		unlimited: false,
		onPGMClean: false
	}
]

export default literal<ISourceLayer[]>([...OVERLAY, ...JINGLE, ...PGM, ...MUSIK, ...MANUS, ...SEC, ...AUX])
