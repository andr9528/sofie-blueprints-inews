import { ConfigManifestEntry, ConfigManifestEntryType } from 'tv-automation-sofie-blueprints-integration'

export const showStyleConfigManifest: ConfigManifestEntry[] = [
	{
		id: 'DVEStyles',
		name: 'DVE Styles',
		description: '',
		type: ConfigManifestEntryType.TABLE,
		required: false,
		defaultVal: [{ _id: '', DVEName: '', BackgroundLoop: '', DVEJSON: '' }],
		columns: [
			{
				id: 'DVEName',
				name: 'DVE name',
				description: 'The name as it will appear in iNews',
				type: ConfigManifestEntryType.STRING,
				required: true,
				defaultVal: ''
			},
			{
				id: 'BackgroundLoop',
				name: 'Background Loop',
				description: 'Background loop file name',
				type: ConfigManifestEntryType.STRING,
				required: true,
				defaultVal: ''
			},
			{
				id: 'DVEJSON',
				name: 'DVE config',
				description: 'DVE config pulled from ATEM',
				type: ConfigManifestEntryType.STRING,
				required: true,
				defaultVal: ''
			}
		]
	},
	{
		/*
		Graphic template setup								
		inews code	
		inews name	
		Grafik template (viz)	
		destination	default out (default, S, B, O)	
		var 1 name	
		var 2 name 	
		note
		*/
		id: 'GFXTemplates',
		name: 'GFX Templates',
		description: 'Graphics Template Setup',
		type: ConfigManifestEntryType.TABLE,
		required: false,
		defaultVal: [
			{
				_id: '',
				INewsCode: '',
				INewsName: '',
				VizTemplate: '',
				VizDestination: '',
				OutType: '', // (default(''), S, B, O)
				Argument1: '',
				Argument2: ''
			}
		],
		columns: [
			{
				id: 'INewsCode',
				name: 'iNews Command',
				description: 'The code as it will appear in iNews',
				type: ConfigManifestEntryType.STRING,
				required: true,
				defaultVal: ''
			},
			{
				id: 'iNewsName',
				name: 'iNews Name',
				description: 'The name after the code',
				type: ConfigManifestEntryType.STRING,
				required: true,
				defaultVal: ''
			},
			{
				id: 'VizTemplate',
				name: 'Viz Template Name',
				description: 'The name of the Viz Template',
				type: ConfigManifestEntryType.STRING,
				required: true,
				defaultVal: ''
			},
			{
				id: 'VizDestination',
				name: 'Viz Destination',
				description: 'The name of the Viz Engine',
				type: ConfigManifestEntryType.STRING,
				required: true,
				defaultVal: ''
			},
			{
				id: 'OutType',
				name: 'Out type',
				description: 'The type of out, none follow timecode, S stays on to ??, B stays on to ??, O stays on to ??',
				type: ConfigManifestEntryType.STRING,
				required: true,
				defaultVal: ''
			},
			{
				id: 'Argument1',
				name: 'Variable 1',
				description: 'Argument passed to Viz',
				type: ConfigManifestEntryType.STRING,
				required: true,
				defaultVal: ''
			},
			{
				id: 'Argument2',
				name: 'Variable 2',
				description: 'Argument passed to Viz',
				type: ConfigManifestEntryType.STRING,
				required: true,
				defaultVal: ''
			}
		]
	},
	{
		id: 'DefaultTemplateDuration',
		name: 'Default Template Duration',
		description: 'Default Template Duration',
		type: ConfigManifestEntryType.NUMBER,
		required: true,
		defaultVal: 4
	}
]
