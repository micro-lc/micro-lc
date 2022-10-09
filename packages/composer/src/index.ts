import type {
  Content,
  ImportMap,
  PluginConfiguration,
} from '@micro-lc/interfaces/v2'
import type { SchemaObject } from 'ajv'
import type { Observable } from 'rxjs'
import { BehaviorSubject, ReplaySubject } from 'rxjs'

import { createComposerContext, fetcher, premount } from './lib'
import type { V1Content } from './v1adapter'
import { v1Adapter, v1AddSources } from './v1adapter'

interface MultipleSchemas {
    id: string
    parts: SchemaObject[]
}

type SchemaOptions = SchemaObject | MultipleSchemas;

interface JsonCatcherOptions<S> {
  defaultValue?: S
  file?: string
}

interface EventWithUser {
  user?: Record<string, unknown>
}

interface MicrolcApi extends Observable<EventWithUser> {
  getExtensions: () => {
    json?: {
      validator?: <S>(json: unknown, schema: SchemaOptions, opts?: JsonCatcherOptions<S>) => Promise<S>
    }
  }
}

interface BootstapProps {
  config: string | PluginConfiguration | undefined
  microlcApi?: Partial<MicrolcApi>
  name: string
  schema?: SchemaOptions | undefined
  version?: 1 | 2
}

interface MountProps {
  container: HTMLElement
  microlcApi?: Partial<MicrolcApi>
  name: string
}

interface MicroApp {
  bootstrap(props: BootstapProps): Promise<null>
  mount(props: MountProps): Promise<null>
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
  interface ImportMeta {
    env: {
      MODE: 'development' | 'production'
    }
  }
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

const composerConfig = new Map<string, ResolvedConfig>()
const parent = new Map<string, HTMLElement | null>()

/**
 * @deprecated will be removed on 1.0.0
 */
const v1AdapterUris: string[] = []

const logger = (name: string, ...args: string[]) => {
  if (import.meta.env.MODE === 'development') {
    console.info(`
    [micro-lc][composer]: ${name} => ${args.join(' ')}
  `)
  }
}

export async function bootstrap({
  name,
  config,
  microlcApi,
  schema,
  version = 2,
}: BootstapProps) {
  logger(name, 'starting bootstrap...')

  let resolvedConfig = config

  const defaultValue = (conf: unknown) =>
    ({ content: version < 2 ? v1Adapter(conf as V1Content, v1AdapterUris) : (conf as PluginConfiguration).content })
  const validator = microlcApi?.getExtensions?.().json?.validator
    ?? ((conf: unknown) => defaultValue(conf))

  if (typeof config === 'string') {
    resolvedConfig = await fetcher(config)
      .then((jsonConfig) => {
        const defaultConfig = defaultValue(jsonConfig)
        if (schema) {
          return validator<PluginConfiguration>(
            jsonConfig,
            schema,
            {
              defaultValue: defaultConfig,
              file: `plugin config -> ${name}`,
            }
          )
        }

        return defaultConfig
      })
  }

  // 🗑️ no need for this on config v2
  if (resolvedConfig) {
    resolvedConfig = v1AddSources(resolvedConfig as PluginConfiguration, v1AdapterUris)
  }

  if (resolvedConfig) {
    await premount(resolvedConfig as PluginConfiguration)
      .then((conf) => { composerConfig.set(name, conf) })
  }

  logger(name, 'bootstrap has finished...')
  return Promise.resolve(null)
}

export async function mount(
  {
    name,
    microlcApi,
    container,
  }: MountProps
): Promise<null> {
  logger(name, 'starting mounting...')
  parent.set(name, container)

  let done = Promise.resolve<void | null>(null)

  const observer = new BehaviorSubject<EventWithUser>({})
  const { subscribe = observer.subscribe.bind(observer) } = microlcApi ?? {}

  subscribe(({ user }) => {
    const config = composerConfig.get(name)
    if (config) {
      done = render(createComposerContext, config, container, {
        currentUser: user,
      }).catch(console.error)
    }
  })

  logger(name, 'mount has finished...')
  return done.then(() => null)
}

export async function unmount({ name }: {name: string}) {
  logger(name, 'unmounting...')

  const container = parent.get(name)
  if (container) {
    container.childNodes.forEach((child) => { child.remove() })
    parent.set(name, null)
  }

  return Promise.resolve(null)
}

export async function update() {
  logger('starting update...')

  logger('update has finished...')
  return Promise.resolve(null)
}
