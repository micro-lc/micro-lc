import type {
  Component,
  Content,
  ImportMap,
  PluginConfiguration,
} from '@micro-lc/interfaces/v2'
import type { MicroApp } from 'qiankun'

import type { createComposerContext } from '../composer'
import type { BaseExtension, ComposableApplicationProperties, Observable } from '../web-component'

export {}

type ComposerModule = Partial<MicroApp>

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

type ComposerExtensions = BaseExtension & {
  user?: Observable<Record<string, unknown>>
}

/**
 * @deprecated will be removed on 1.0.0
 */
type V1Component = Record<string, unknown> & {
  type: 'element' | 'row' | 'column'
}

/**
 * @deprecated will be removed on 1.0.0
 */
type V1Content = V1Component | V1Component[]

/**
 * this function can be removed since it is idempotent on v2 configs
 * @param {V1Content} input raw json
 * @param {string[]} sources the uri list of assets to download
 * @returns {Component} the v2 plugin component
 * @deprecated will be removed on 1.0.0
 */
function v1Adapter(input: V1Content | Content, sources: string[]): Content {
  // compatibility
  if (process.env.NODE_ENV === 'development') {
    if (typeof input === 'string' || typeof input === 'number') {
      return input
    }

    if (Array.isArray(input)) {
      return input.map((content) => v1Adapter(content as V1Component, sources) as Component)
    }

    const { tag, type, url, attributes: inAttributes, content: inContent, properties } = input as V1Component
    console.log(type)
    typeof url === 'string' && sources.push(url)
    const attributes = (inAttributes ?? {}) as Record<string, string>
    const content = (inContent as V1Content | undefined) && v1Adapter(inContent as V1Content, sources)
    const extra: Partial<Component> = {}
    properties && (extra.properties = properties as Component['properties'])
    extra.tag = 'div'
    switch (type) {
    case 'row':
      extra.attributes = {
        ...attributes,
        style: `display: flex; flex-direction: column; ${attributes.style}`,
      }
      break
    case 'column':
      extra.attributes = {
        ...attributes,
        style: `display: flex; flex-direction: row; ${attributes.style}`,
      }
      break
    default:
      extra.tag = tag as string
      extra.attributes = attributes
      break
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return {
      content,
      ...(extra),
    }
  }

  return input as Content
}

/**
 * this function can be removed since it is idempotent on v2 configs
 * @param {PluginConfiguration} config incoming v2 config
 * @param {string[]} extraSources assets uri to add
 * @return {ResolvedConfig} the plugin config including adapted sources
 * @deprecated will be removed on 1.0.0
 */
function v1AddSources(config: PluginConfiguration, extraSources: string[]): PluginConfiguration {
  function toArray<T>(input: T | T[]): T[] { return Array.isArray(input) ? input : [input] }

  function parseSources(sources: Exclude<PluginConfiguration['sources'], undefined>): string[] {
    const arrayOrObject:
      | string[]
      | {importmap?: ImportMap | undefined; uris: string | string[]}
     = typeof sources === 'string' ? [sources] : sources
    return Array.isArray(arrayOrObject) ? arrayOrObject : toArray(arrayOrObject.uris)
  }

  if (process.env.NODE_ENV === 'development') {
    let uris: string[] = []
    let importmap: ImportMap | undefined


    if (config.sources) {
      const { sources } = config

      uris = parseSources(sources)
      importmap = (!Array.isArray(sources) && typeof sources !== 'string')
        ? sources.importmap
        : undefined
    }

    return {
      content: config.content,
      sources: { importmap, uris: [...uris, ...extraSources] },
    }
  }

  return config
}

async function render(
  composer: typeof createComposerContext, config: ResolvedConfig, container: HTMLElement, context: Record<string, unknown>): Promise<null> {
  const appenderPromise = composer(
    config.content,
    {
      context: {
        ...context,
      },
      extraProperties: ['microlcApi', 'currentUser', 'eventBus'],
    }
  )

  return appenderPromise.then((appender) => {
    appender(container)
    return null
  })
}

function fn(exports: ComposerModule, _: Window) {
  let composerConfig: ResolvedConfig | undefined
  // let parent: HTMLElement | null = null
  // let api: {composer: typeof createComposerContext; microlcApi: MicrolcApi<ComposerExtensions>} | undefined

  /**
   * @deprecated will be removed on 1.0.0
   */
  const v1AdapterUris: string[] = []

  const logger = (name: string, ...args: string[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`
      [micro-lc][composer]: ${name} => ${args.join(' ')}
    `)
    }
  }

  Object.assign(exports, {
    async bootstrap({
      name,
      config,
      composerApi: { premount },
      microlcApi: { getExtensions },
      schema,
    }: ComposableApplicationProperties & {name: string}) {
      const { json: { validator, fetcher } } = getExtensions()
      logger(name, 'starting bootstrap...')

      let resolvedConfig = config
      if (schema && typeof config === 'string') {
        const json = await fetcher(config)
        resolvedConfig = await validator<PluginConfiguration>(
          json,
          schema,
          {
            defaultValue: { content: v1Adapter(json as V1Content, v1AdapterUris) },
            file: `plugin config -> ${name}`,
          }
        )
      }

      // 🗑️ no need for this on config v2
      if (resolvedConfig) {
        resolvedConfig = v1AddSources(resolvedConfig as PluginConfiguration, v1AdapterUris)
      }

      if (resolvedConfig) {
        composerConfig = await premount(name, resolvedConfig as PluginConfiguration)
      }

      logger(name, 'bootstrap has finished...')
      return Promise.resolve(null)
    },

    async mount(
      {
        name,
        microlcApi,
        composerApi: { createComposerContext },
        container,
      }: ComposableApplicationProperties<ComposerExtensions> & {container: HTMLElement | null; name: string}
    ): Promise<null> {
      logger(name, 'starting mounting...')

      // parent = container
      // api = { composer: createComposerContext, microlcApi }

      microlcApi.subscribe(({ user }) => {
        if (composerConfig && container && user) {
          render(createComposerContext, composerConfig, container, {
            currentUser: user as Record<string, unknown>,
          }).catch(console.error)
        }
      })

      logger(name, 'mount has finished...')
      return Promise.resolve(null)
    },

    async unmount({ name }: {name: string}) {
      logger(name, 'unmounting...')
      return Promise.resolve(null)
    },

    async update() {
      logger('starting update...')

      logger('update has finished...')
      return Promise.resolve(null)
    },
  })
}

(function register(global: Window, factory: (exp: ComposerModule, b: Window) => void) {
  global.__MICRO_LC_COMPOSER = {}
  factory(global.__MICRO_LC_COMPOSER, global)
}(window, fn))
