import {
	ConfigItemValue,
	NotesContext,
	ShowStyleContext,
	TableConfigItemValue
} from 'tv-automation-sofie-blueprints-integration'
import { literal } from 'tv2-common'
import * as _ from 'underscore'
import {
	applyToConfig,
	BlueprintConfig as BlueprintConfigBase,
	defaultStudioConfig,
	parseStudioConfig
} from '../../tv2_afvd_studio/helpers/config'
import { showStyleConfigManifest } from '../config-manifests'

export interface TableConfigItemGFXTemplates {
	VizTemplate: string
	SourceLayer: string
	LayerMapping: string
	INewsCode: string
	INewsName: string
	VizDestination: string
	OutType: string
	Argument1: string
	Argument2: string
	IsDesign: boolean
}

export interface BlueprintConfig extends BlueprintConfigBase {
	showStyle: ShowStyleConfig
}

export interface DVEConfigInput {
	// _id: string
	DVEName: string
	DVEJSON: string
	DVEGraphicsTemplate: string
	DVEGraphicsTemplateJSON: string
	DVEInputs: string
	DVEGraphicsKey: string
	DVEGraphicsFrame: string
	// [key: string]: BasicConfigItemValue
}

export interface ShowStyleConfig {
	MakeAdlibsForFulls: boolean
	CasparCGLoadingClip: string
	DVEStyles: DVEConfigInput[]
	GFXTemplates: TableConfigItemGFXTemplates[]
	WipesConfig: TableConfigItemValue
	BreakerConfig: TableConfigItemValue
	DefaultTemplateDuration: number
	LYDConfig: TableConfigItemValue
	IsOfftube: boolean
}

function extendWithShowStyleConfig(
	context: NotesContext,
	baseConfig: BlueprintConfigBase,
	values: { [key: string]: ConfigItemValue }
): BlueprintConfig {
	const config = literal<BlueprintConfig>({
		...baseConfig,
		showStyle: {} as any
	})

	applyToConfig(context, config.showStyle, showStyleConfigManifest, 'ShowStyle', values)

	return config
}

export function defaultConfig(context: NotesContext): BlueprintConfig {
	return extendWithShowStyleConfig(context, defaultStudioConfig(context), {})
}

export function parseConfig(context: ShowStyleContext): BlueprintConfig {
	return extendWithShowStyleConfig(context, parseStudioConfig(context), context.getShowStyleConfig())
}
