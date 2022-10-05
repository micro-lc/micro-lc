import type {
  Component,
  Content,
  ImportMap,
  PluginConfiguration,
} from '@micro-lc/interfaces/v2'
import { ReplaySubject } from 'rxjs'

import type { createComposerContext } from '../composer'
import type { BaseExtension, ComposableApplicationProperties, Observable } from '../web-component'

export {}

type ComposerExtensions = BaseExtension & {
  user?: Observable<Record<string, unknown>>
}

interface MicroApp {
  bootstrap(props: ComposableApplicationProperties & {name: string}): Promise<null>
  mount(props: ComposableApplicationProperties<ComposerExtensions> & {container: HTMLElement | null; name: string}): Promise<null>
  unmount(props: {name: string}): Promise<null>
  update(): Promise<null>
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
    __MICRO_LC_COMPOSER?: Partial<MicroApp>
  }
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

    const { tag, type, url, attributes: inAttributes, content: inContent, properties, busDiscriminator } = input as V1Component
    typeof url === 'string' && sources.push(url)
    const attributes = (inAttributes ?? {}) as Record<string, string>
    const content = (inContent as V1Content | undefined) && v1Adapter(inContent as V1Content, sources)
    const extra: Partial<Component> = {}

    if (typeof busDiscriminator === 'string') {
      extra.properties = { eventBus: `eventBus.pool.${busDiscriminator}` }
      if (properties) {
        extra.properties = { ...extra.properties, ...properties } as Component['properties']
      }
    } else if (properties) {
      extra.properties = properties as Component['properties']
    }

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

interface ReplaySubjectPool<T = unknown> extends ReplaySubject<T> {
  [index: number]: ReplaySubject<T>
  pool: Record<string, ReplaySubject<T>>
}

function createPool<T>(): ReplaySubjectPool<T> {
  const array: ReplaySubject<T>[] = []

  const pool = new Proxy<Record<string, ReplaySubject<T>>>({}, {
    get(target, property, receiver) {
      if (typeof property === 'string' && !Object.prototype.hasOwnProperty.call(target, property)) {
        target[property] = new ReplaySubject<T>()
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Reflect.get(target, property, receiver)
    },
  })

  return new Proxy(new ReplaySubject() as ReplaySubjectPool<T>, {
    get(target, property, receiver) {
      if (property === 'pool') {
        return pool
      }

      const idx = typeof property === 'string' ? Number.parseInt(property, 10) : Number.NaN
      if (!Number.isNaN(idx)) {
        if (array.at(idx) === undefined) {
          array[idx] = new ReplaySubject<T>()
        }
        return array[idx]
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Reflect.get(target, property, receiver)
    },
  })
}

async function render(
  composer: typeof createComposerContext, config: ResolvedConfig, container: HTMLElement, context: Record<string, unknown>
): Promise<null> {
  interface Event {
    label: string
    meta?: Record<string, unknown>
    payload: Record<string, unknown>
  }

  // const { ReplaySubject } = await import(/* @vite-ignore */'rxjs')
  const appenderPromise = composer(
    config.content,
    {
      context: {
        ...context,
        eventBus: createPool<Event>(),
      },
      extraProperties: ['microlcApi', 'currentUser', 'eventBus'],
    }
  )

  return appenderPromise.then((appender) => {
    appender(container)
    return null
  })
}

function fn(exports: Partial<MicroApp>, _: Window) {
  let composerConfig: ResolvedConfig | undefined
  let parent: HTMLElement | null = null

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
      let resolvedConfig = config

      const jsonExtension = getExtensions?.().json
      if (jsonExtension) {
        const { validator, fetcher } = jsonExtension
        logger(name, 'starting bootstrap...')

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
      }

      // 🗑️ no need for this on config v2
      if (resolvedConfig) {
        resolvedConfig = v1AddSources(resolvedConfig as PluginConfiguration, v1AdapterUris)
      }

      if (resolvedConfig) {
        composerConfig = await premount(resolvedConfig as PluginConfiguration)
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

      parent = container

      const subscribe = microlcApi.subscribe ?? ((callback) => { callback({}) })

      let done = Promise.resolve<void | null>(null)

      subscribe(({ user }) => {
        if (composerConfig && container) {
          done = render(createComposerContext, composerConfig, container, {
            currentUser: user as Record<string, unknown> | undefined,
          }).catch(console.error)
        }
      })

      logger(name, 'mount has finished...')
      return done.then(() => null)
    },

    async unmount({ name }: {name: string}) {
      logger(name, 'unmounting...')
      parent?.childNodes.forEach((child) => { child.remove() })
      parent = null

      return Promise.resolve(null)
    },

    async update() {
      logger('starting update...')

      logger('update has finished...')
      return Promise.resolve(null)
    },
  })
}

(function register(global: Window, factory: (exp: Partial<MicroApp>, b: Window) => void) {
  global.__MICRO_LC_COMPOSER = {}
  factory(global.__MICRO_LC_COMPOSER, global)
}(window, fn))
