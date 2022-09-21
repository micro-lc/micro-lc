import type { Content, ImportMap, PluginConfiguration } from '@micro-lc/interfaces'

import type { MicrolcApi, BaseExtension } from './apis'
import type * as composer from './composer'
import type * as json from './utils/json'

export {}

type ComposerModule = Partial<Record<string, (...args: unknown[]) => Promise<null>>>

interface ComposerProperties {
  composerApi: {composer: typeof composer; json: typeof json}
  config: string | PluginConfiguration
  microlcApi: MicrolcApi<BaseExtension>
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
      microlcApi: { applyImportMap },
    }: ComposerProperties) {
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
      let done = Promise.resolve(null)

      if (resolvedConfig?.sources) {
        const { sources } = resolvedConfig

        uris = parseSources(sources)
        importmap = (!Array.isArray(sources) && typeof sources !== 'string')
          ? sources.importmap
          : undefined

        if (importmap) {
          applyImportMap(name, importmap)
        }

        if (uris.length > 0) {
          done = Promise.all(uris.map((uri) => importShim(uri).catch(console.error)))
            .then(() => null)
        }
      }

      composerConfig = resolvedConfig && {
        content: resolvedConfig.content,
        sources: { importmap, uris },
      }

      return done
    },

    async mount({ microlcApi, composerApi: { composer }, container }: ComposerProperties & {container: HTMLElement | null}) {
      let done = Promise.resolve(null)

      if (composerConfig && container) {
        const appenderPromise = composer
          .createComposerContext(
            composerConfig.content,
            { context: { microlcApi }, extraProperties: ['microlcApi'] }
          )

        done = appenderPromise.then((appender) => {
          appender(container)
          return null
        })
      }

      return done
    },

    async unmount() {
      return Promise.resolve(null)
    },
  })
}

(function register(global: Window, factory: (exp: ComposerModule, b: Window) => void) {
  global.__MICRO_LC_COMPOSER = {}
  factory(global.__MICRO_LC_COMPOSER, global)
}(window, fn))
