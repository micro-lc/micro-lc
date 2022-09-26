import type {
  Config,
  Content,
  CSSConfig,
  GlobalImportMap,
  PluginConfiguration,
  Settings,
} from '@micro-lc/interfaces'

export const MICRO_LC_MOUNT_POINT = '__MICRO_LC_MOUNT_POINT'

export type CompleteConfig = Required<Omit<Config, '$schema' | 'settings' | 'layout'>> & {
  css: Omit<CSSConfig, 'global'> & {global: {'font-family': string; 'primary-color': string}}
  layout: PluginConfiguration & {content: Content}
  settings: Required<Omit<Settings, 'pluginMountPointSelector'>>
    & {pluginMountPointSelector: {id: string; slot?: string}}
}

export const defaultConfig: CompleteConfig = {
  applications: [],
  css: {
    global: {
      'font-family': `
        -apple-system, BlinkMacSystemFont,
        'Segoe UI', Roboto, 'Helvetica Neue', Arial,
        'Noto Sans', sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol',
        'Noto Color Emoji'`,
      'primary-color': '#1890ff',
    },
  },
  importmap: {} as GlobalImportMap,
  layout: { content: '' },
  settings: {
    '4xx': {
      401: './401.html',
      404: './404.html',
    },
    '5xx': {
      500: './500.html',
    },
    composerUri: `./composer.${process.env.NODE_ENV}.js`,
    defaultUrl: './',
    pluginMountPointSelector: { id: MICRO_LC_MOUNT_POINT },
  },
  shared: {},
  version: 2,
}

export function mergeConfig(input: Config): CompleteConfig {
  const def = defaultConfig
  const mountPointMergedConfig = input.settings?.pluginMountPointSelector
    ?? def.settings.pluginMountPointSelector
  const pluginMountPointSelector = typeof mountPointMergedConfig === 'object'
    ? mountPointMergedConfig
    : { id: mountPointMergedConfig }
  return {
    applications: input.applications ?? def.applications,
    css: {
      ...input.css,
      global: {
        'font-family': input.css?.global?.['font-family'] ?? def.css.global['font-family'],
        'primary-color': input.css?.global?.['primary-color'] ?? def.css.global['primary-color'],
      },
    },
    importmap: input.importmap ?? def.importmap,
    layout: {
      ...input.layout,
      content: input.layout?.content ?? def.layout.content,
    },
    settings: {
      '4xx': input.settings?.['4xx'] ?? def.settings['4xx'],
      '5xx': input.settings?.['5xx'] ?? def.settings['5xx'],
      composerUri: input.settings?.composerUri ?? def.settings.composerUri,
      defaultUrl: input.settings?.defaultUrl ?? def.settings.defaultUrl,
      pluginMountPointSelector,
    },
    shared: input.shared ?? def.shared,
    version: 2,
  }
}
