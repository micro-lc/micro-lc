import type {
  Config,
  Content,
  GlobalImportMap,
  PluginConfiguration,
  Settings,
} from '@micro-lc/interfaces/v2'

export const MICRO_LC_MOUNT_POINT = '__MICRO_LC_MOUNT_POINT'

export type CompleteConfig = Required<Omit<Config, '$schema' | 'settings' | 'layout'>> & {
  layout: PluginConfiguration & {content: Content}
  settings: Required<Settings>
}

export const defaultConfig: CompleteConfig = {
  applications: {},
  importmap: {} as GlobalImportMap,
  layout: { content: { tag: 'slot' } },
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
    mountPoint: [
      {
        content: `
          div#__MICRO_LC_MOUNT_POINT > :first-child {
            width: inherit;
            height: inherit;
            overflow: hidden;
          }
        `,
        tag: 'style',
      },
      {
        attributes: {
          id: MICRO_LC_MOUNT_POINT,
          style: `
            width: 100%;
            height: 100%;
          `,
        },
        tag: 'div',
      },
    ],
    mountPointSelector: `#${MICRO_LC_MOUNT_POINT}`,
  },
  shared: {},
  version: 2,
}

export function mergeConfig(input: Config): CompleteConfig {
  const def = defaultConfig

  return {
    applications: input.applications ?? def.applications,
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
      mountPoint: input.settings?.mountPoint ?? def.settings.mountPoint,
      mountPointSelector: input.settings?.mountPointSelector ?? def.settings.mountPointSelector,
    },
    shared: input.shared ?? def.shared,
    version: 2,
  }
}
