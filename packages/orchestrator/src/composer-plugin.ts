import type { Content, ImportMap, PluginConfiguration } from '@micro-lc/interfaces'

import type { MicrolcApi, PartialObject } from './apis'
import type * as json from './utils/json'

export {}

type ComposerModule = Partial<Record<string, (...args: unknown[]) => Promise<null>>>

interface ComposerProperties {
  composerApi: {json: typeof json}
  config: string | PluginConfiguration
  microlcApi: MicrolcApi<PartialObject>
  name: string
}

interface ResolvedConfig {
  content: Content
  sources: {
    importmap?: ImportMap
    uris: string[]
  }
}

declare global {
  interface Window {
    __MICRO_LC_COMPOSER?: ComposerModule
  }
}

function fn(exports: ComposerModule, _: Window) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let composerConfig: ResolvedConfig | undefined

  function toArray<T>(input: T | T[]): T[] {
    return Array.isArray(input) ? input : [input]
  }

  function parseSources(sources: Exclude<PluginConfiguration['sources'], undefined>): string[] {
    const arrayOrObject:
      | string[]
      | {importmap?: ImportMap | undefined; uris: string | string[]}
     = typeof sources === 'string' ? [sources] : sources
    return Array.isArray(arrayOrObject) ? arrayOrObject : toArray(arrayOrObject.uris)
  }

  Object.assign(exports, {
    async bootstrap({
      name,
      config,
      composerApi: {
        json: { jsonFetcher, jsonToObject, jsonToObjectCatcher },
      },
      microlcApi: { setImportMap },
      ...rest
    }: ComposerProperties) {
      console.log(rest)
      let resolvedConfig = config as PluginConfiguration | undefined
      if (typeof config === 'string') {
        resolvedConfig = await jsonFetcher(config)
          .then((json) => jsonToObject<PluginConfiguration>(json, 'plugin'))
          .catch((err: TypeError) =>
            jsonToObjectCatcher<PluginConfiguration | undefined>(err, undefined, '"composer config"')
          )
      }

      let uris: string[] = []
      let importmap: ImportMap | undefined

      if (resolvedConfig?.sources) {
        const { sources } = resolvedConfig

        uris = parseSources(sources)
        importmap = (!Array.isArray(sources) && typeof sources !== 'string')
          ? sources.importmap
          : undefined

        if (importmap) {
          setImportMap(name, importmap)
        }

        if (uris.length > 0) {
          // uris.forEach((uri) => {
          //   document.head.appendChild(Object.assign(
          //     document.createElement('script'),
          //     {
          //       src: uri,
          //       type: 'module-shim',
          //     }
          //   ))
          // })
          uris.map((uri) => importShim(uri).catch(console.error))
        }
      }

      composerConfig = resolvedConfig && {
        content: resolvedConfig.content,
        sources: { importmap, uris },
      }
      return Promise.resolve(null)
    },

    async mount({ name, microlcApi: { applyImportMap }, ...rest }: ComposerProperties) {
      console.log(rest)
      applyImportMap(name)
      return Promise.resolve(null)
    },

    async unmount() {
      console.log('purehtml unmount')
      return Promise.resolve(null)
    },
  })
}

(function register(global: Window, factory: (exp: ComposerModule, b: Window) => void) {
  global.__MICRO_LC_COMPOSER = {}
  factory(global.__MICRO_LC_COMPOSER, global)
}(window, fn))
