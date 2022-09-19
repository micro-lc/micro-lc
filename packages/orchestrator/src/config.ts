import type { Config, Content, PluginConfiguration, Settings } from '@micro-lc/interfaces'

const MICRO_LC_MOUNT_POINT = '__MICRO_LC_MOUNT_POINT'

export type CompleteConfig = Required<Omit<Config, 'settings'>> & {
  layout: PluginConfiguration & {content: Content}
  settings: Required<Omit<Settings, 'pluginMountPointSelector'>>
    & {pluginMountPointSelector: {id: string; slot?: string}}
}

export const defaultConfig = (shadow = true): CompleteConfig => ({
  $schema: 'https://raw.githubusercontent.com/micro-lc/micro-lc/main/packages/interfaces/schemas/v2/config.schema.json',
  applications: [],
  css: {},
  importmap: {},
  layout: shadow
    ? {
      content: {
        tag: 'slot',
      },
    }
    : {
      content: {
        attributes: {
          id: MICRO_LC_MOUNT_POINT,
        },
        tag: 'div',
      },
    },
  settings: {
    defaultUrl: '/',
    pluginMountPointSelector: { id: MICRO_LC_MOUNT_POINT },
  },
  version: 2,
})

export function mergeConfig(input: Config, shadow = true): CompleteConfig {
  const def = defaultConfig(shadow)
  const mountPointMergedConfig = input.settings?.pluginMountPointSelector
    ?? def.settings.pluginMountPointSelector
  const pluginMountPointSelector = typeof mountPointMergedConfig === 'object'
    ? mountPointMergedConfig
    : { id: mountPointMergedConfig }
  return {
    $schema: input.$schema ?? def.$schema,
    applications: input.applications ?? def.applications,
    css: input.css ?? def.css,
    importmap: input.importmap ?? def.importmap,
    layout: {
      ...input.layout,
      content: input.layout?.content ?? def.layout.content,
    },
    settings: {
      defaultUrl: input.settings?.defaultUrl ?? def.settings.defaultUrl,
      pluginMountPointSelector,
    },
    version: 2,
  }
}
