import type { Config, Content, GlobalImportMap, PluginConfiguration, Settings } from '@micro-lc/interfaces'

const MICRO_LC_MOUNT_POINT = '__MICRO_LC_MOUNT_POINT'

export type CompleteConfig = Required<Omit<Config, '$schema' | 'settings' | 'layout'>> & {
  layout: PluginConfiguration & {content: Content}
  settings: Required<Omit<Settings, 'pluginMountPointSelector'>>
    & {pluginMountPointSelector: {id: string; slot?: string}}
}

export const defaultConfig = (shadow = true): CompleteConfig => ({
  applications: [],
  css: {},
  importmap: {} as GlobalImportMap,
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
  shared: {},
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
    shared: input.shared ?? def.shared,
    version: 2,
  }
}
