import type { Config, Content, PluginConfiguration, Settings } from '@micro-lc/interfaces'

export type CompleteConfig = Required<Config> & {
  layout: PluginConfiguration & {content: Content}
  settings: Required<Settings>
}

export const defaultConfig: CompleteConfig = {
  $schema: 'https://raw.githubusercontent.com/micro-lc/micro-lc/main/packages/interfaces/schemas/v2/config.schema.json',
  applications: [],
  css: {},
  importmap: {},
  layout: {
    content: {
      attributes: {
        id: '__MICRO_LC_MOUNT_POINT',
      },
      tag: 'div',
    },
  },
  settings: {
    defaultUrl: '/',
    pluginMountPointSelector: '#__MICRO_LC_MOUNT_POINT',
  },
  version: 2,
}

export function mergeConfig(input: Config, def = defaultConfig): CompleteConfig {
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
      pluginMountPointSelector: input.settings?.pluginMountPointSelector ?? def.settings.pluginMountPointSelector,
    },
    version: 2,
  }
}
