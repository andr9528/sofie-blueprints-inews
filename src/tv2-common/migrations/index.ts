import {
	BlueprintMappings,
	ConfigItemValue,
	MigrationContextShowStyle,
	MigrationContextStudio,
	MigrationStepShowStyle,
	MigrationStepStudio,
	TableConfigItemValue
} from '@tv2media/blueprints-integration'
import { TableConfigItemGFXTemplates, TableConfigItemSourceMappingWithSisyfos } from 'tv2-common'
import _ = require('underscore')
import { literal } from '../util'

export * from './moveSourcesToTable'
export * from './addKeepAudio'
export * from './transitions'
export * from './graphic-defaults'
export * from './manifestWithMediaFlow'
export * from './sourceManifest'
export * from './sourceLayers'
export * from './forceSourceLayerToDefaultsBase'
export * from './hotkeys'

export function RenameStudioConfig(versionStr: string, studio: string, from: string, to: string): MigrationStepStudio {
	return {
		id: `${versionStr}.studioConfig.rename.${from}.${studio}`,
		version: versionStr,
		canBeRunAutomatically: true,
		validate: (context: MigrationContextStudio) => {
			const configVal = context.getConfig(from)
			if (configVal !== undefined) {
				return `${from} needs updating`
			}
			return false
		},
		migrate: (context: MigrationContextStudio) => {
			const configVal = context.getConfig(from)
			if (configVal !== undefined) {
				context.setConfig(to, configVal)
			}

			context.removeConfig(from)
		}
	}
}

export function renameSourceLayer(
	versionStr: string,
	studioId: string,
	from: string,
	to: string
): MigrationStepShowStyle {
	return {
		id: `${versionStr}.renameSourceLayer.${studioId}.${from}.${to}`,
		version: versionStr,
		canBeRunAutomatically: true,
		validate: (context: MigrationContextShowStyle) => {
			const existing = context.getSourceLayer(from)

			return !!existing
		},
		migrate: (context: MigrationContextShowStyle) => {
			const existing = context.getSourceLayer(from)

			if (!existing) {
				return
			}

			context.insertSourceLayer(to, existing)
			context.removeSourceLayer(from)
		}
	}
}

export function removeSourceLayer(versionStr: string, studioId: string, layer: string): MigrationStepShowStyle {
	return literal<MigrationStepShowStyle>({
		id: `${versionStr}.removeSourceLayer.${studioId}.${layer}`,
		version: versionStr,
		canBeRunAutomatically: true,
		validate: (context: MigrationContextShowStyle) => {
			const existing = context.getSourceLayer(layer)

			return !!existing
		},
		migrate: (context: MigrationContextShowStyle) => {
			const existing = context.getSourceLayer(layer)

			if (!existing) {
				return
			}

			context.removeSourceLayer(layer)
		}
	})
}

export function AddGraphicToGFXTable(
	versionStr: string,
	studio: string,
	config: TableConfigItemGFXTemplates
): MigrationStepShowStyle {
	return {
		id: `${versionStr}.gfxConfig.add${config.INewsName}.${studio}`,
		version: versionStr,
		canBeRunAutomatically: true,
		validate: (context: MigrationContextShowStyle) => {
			const existing = (context.getBaseConfig('GFXTemplates') as unknown) as TableConfigItemGFXTemplates[] | undefined

			if (!existing || !existing.length) {
				return false
			}

			return !existing.some(
				g =>
					g.INewsName === config.INewsName && g.INewsCode === config.INewsCode && g.VizTemplate === config.VizTemplate
			)
		},
		migrate: (context: MigrationContextShowStyle) => {
			const existing = (context.getBaseConfig('GFXTemplates') as unknown) as TableConfigItemGFXTemplates[]

			existing.push(config)

			context.setBaseConfig('GFXTemplates', (existing as unknown) as ConfigItemValue)
		}
	}
}

export function addSourceToSourcesConfig(
	versionStr: string,
	studio: string,
	configId: string,
	source: TableConfigItemSourceMappingWithSisyfos
): MigrationStepStudio {
	return {
		id: `${versionStr}.studioConfig.addReplaySource.${source.SourceName}.${studio}`,
		version: versionStr,
		canBeRunAutomatically: true,
		validate: (context: MigrationContextStudio) => {
			const config = (context.getConfig(configId) as unknown) as TableConfigItemSourceMappingWithSisyfos[]

			if (!config) {
				return false
			}
			return !config.find(s => s.SourceName === source.SourceName)
		},
		migrate: (context: MigrationContextStudio) => {
			const config = (context.getConfig(configId) as unknown) as TableConfigItemSourceMappingWithSisyfos[]
			config.push(source)
			context.setConfig(configId, (config as unknown) as ConfigItemValue)
		}
	}
}

export function changeGFXTemplate(
	versionStr: string,
	studio: string,
	oldConfig: Partial<TableConfigItemGFXTemplates>,
	config: Partial<TableConfigItemGFXTemplates>
): MigrationStepShowStyle {
	const keysToUpdate = Object.keys(config).join('_')
	return {
		id: `${versionStr}.gfxConfig.change_${keysToUpdate}.${studio}`,
		version: versionStr,
		canBeRunAutomatically: true,
		validate: (context: MigrationContextShowStyle) => {
			const gfxTemplates = (context.getBaseConfig('GFXTemplates') as unknown) as
				| TableConfigItemGFXTemplates[]
				| undefined

			if (!gfxTemplates || !gfxTemplates.length) {
				return false
			}

			return gfxTemplates.some(g => isGfxTemplateSubset(g, oldConfig))
		},
		migrate: (context: MigrationContextShowStyle) => {
			let existing = (context.getBaseConfig('GFXTemplates') as unknown) as TableConfigItemGFXTemplates[]

			existing = existing.map(g => (isGfxTemplateSubset(g, oldConfig) ? { ...g, ...config } : g))

			context.setBaseConfig('GFXTemplates', (existing as unknown) as ConfigItemValue)
		}
	}
}

function isGfxTemplateSubset(
	superset: Partial<TableConfigItemGFXTemplates>,
	subset: Partial<TableConfigItemGFXTemplates>
): boolean {
	return Object.keys(subset).every((key: keyof TableConfigItemGFXTemplates) => superset[key] === subset[key])
}

export function SetLayerNamesToDefaults(
	versionStr: string,
	studio: string,
	mappings: BlueprintMappings
): MigrationStepStudio[] {
	const migrations: MigrationStepStudio[] = []

	for (const [layerId, mapping] of Object.entries(mappings)) {
		migrations.push({
			id: `${versionStr}.studioConfig.setLayerName.${layerId}.${studio}`,
			version: versionStr,
			canBeRunAutomatically: true,
			validate: (context: MigrationContextStudio) => {
				const configVal = context.getMapping(layerId)

				if (!configVal) {
					return false
				}

				return configVal.layerName !== mapping.layerName
			},
			migrate: (context: MigrationContextStudio) => {
				const configVal = context.getMapping(layerId)

				if (!configVal) {
					return
				}

				configVal.layerName = mapping.layerName
				context.removeMapping(layerId)
				context.insertMapping(layerId, configVal)
			}
		})
	}

	return migrations
}

export function SetConfigTo(versionStr: string, studio: string, id: string, value: any): MigrationStepStudio {
	return {
		id: `${versionStr}.config.valueSet.${studio}.${id}`,
		version: versionStr,
		canBeRunAutomatically: true,
		validate: (context: MigrationContextStudio) => {
			// Optional mappings based on studio settings can be dropped here

			const existing = context.getConfig(id)
			if (!existing) {
				return false
			}

			return !_.isEqual(existing, value)
		},
		migrate: (context: MigrationContextStudio) => {
			context.setConfig(id, value)
		}
	}
}

export function RemoveConfig(versionStr: string, studio: string, id: string): MigrationStepStudio {
	return {
		id: `${versionStr}.config.valueSet.${studio}.${id}`,
		version: versionStr,
		canBeRunAutomatically: true,
		validate: (context: MigrationContextStudio) => {
			return context.getConfig(id) !== undefined
		},
		migrate: (context: MigrationContextStudio) => {
			context.removeConfig(id)
		}
	}
}

const SOUNDBED_REGEX = /^audio\/(.*)/i
/**
 * Removes `audio/` from the start of all entries in the soundbed config table
 */
export function StripFolderFromAudioBedConfig(versionStr: string, studio: string): MigrationStepShowStyle {
	const configId = 'LYDConfig'
	const configFields = ['FileName']
	return StripFolderFromShowStyleConfig(versionStr, studio, configId, configFields, SOUNDBED_REGEX)
}

const DVE_REGEX = /^dve\/(.*)/i
/**
 * Removes `dve/` from the start of all entries in the DVE config table
 */
export function StripFolderFromDVEConfig(versionStr: string, studio: string): MigrationStepShowStyle {
	const configId = 'DVEStyles'
	const configFields = ['DVEGraphicsKey', 'DVEGraphicsFrame']
	return StripFolderFromShowStyleConfig(versionStr, studio, configId, configFields, DVE_REGEX)
}

export function StripFolderFromShowStyleConfig(
	versionStr: string,
	studio: string,
	configId: string,
	configFields: string[],
	regex: RegExp
): MigrationStepShowStyle {
	return {
		id: `${versionStr}.normalizeFolders.${studio}.${configId}`,
		version: versionStr,
		canBeRunAutomatically: true,
		validate: (context: MigrationContextShowStyle) => {
			const configTableValue = context.getBaseConfig(configId) as TableConfigItemValue | undefined

			if (!configTableValue) {
				return false
			}

			// Some entry in the table contains a field that needs migrating
			return configTableValue.some(config => {
				return configFields.some(field => {
					return ((config[field] as unknown) as string | undefined)?.match(regex)
				})
			})
		},
		migrate: (context: MigrationContextShowStyle) => {
			let configTableValue = context.getBaseConfig(configId) as TableConfigItemValue | undefined

			if (!configTableValue) {
				return
			}

			configTableValue = configTableValue.map(config => {
				configFields.forEach(field => {
					const newConfig = (config[field] as unknown) as string

					const matches = newConfig.match(regex)

					if (matches) {
						// Remove folder name
						config[field] = matches[1]
					}
				})

				return config
			})

			context.setBaseConfig(configId, configTableValue)
		}
	}
}

export function PrefixEvsWithEvs(
	versionStr: string,
	studio: string,
	configId: string,
	evsSourceNumber: string
): MigrationStepStudio {
	return {
		id: `${versionStr}.prefixEvs${evsSourceNumber}WithEvs.${studio}`,
		version: versionStr,
		canBeRunAutomatically: true,
		validate: (context: MigrationContextStudio) => {
			const config = (context.getConfig(configId) as unknown) as TableConfigItemSourceMappingWithSisyfos[]

			if (!config || config.find(value => value.SourceName === `EVS ${evsSourceNumber}`) !== undefined) {
				return false
			}

			return config.find(value => value.SourceName === evsSourceNumber) !== undefined
		},
		migrate: (context: MigrationContextStudio) => {
			const config = (context.getConfig(configId) as unknown) as TableConfigItemSourceMappingWithSisyfos[]
			const index: number = config.findIndex(value => value.SourceName === evsSourceNumber)
			if (index === -1) {
				return
			}
			const evsSource = config[index]

			evsSource.SourceName = `EVS ${evsSource.SourceName}`
			config[index] = evsSource
			context.setConfig(configId, (config as unknown) as ConfigItemValue)
		}
	}
}
