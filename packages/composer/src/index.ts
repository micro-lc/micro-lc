/*
  Copyright 2022 Mia srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import type {
  Content,
  ImportMap,
  PluginConfiguration,
} from '@micro-lc/interfaces/v2'
import type { SchemaObject } from 'ajv'
import type { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { ComposerApi } from './lib'
import { render, premount, createComposerContext, createPool } from './lib/index.js'

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
      fetcher: (url: string, init?: RequestInit) => Promise<unknown>
      validator?: <S>(json: unknown, schema: SchemaOptions, opts?: JsonCatcherOptions<S>) => Promise<S>
    }
    language?: {
      getFallbackLanguage?: () => string | null | undefined
      getLanguage?: () => string
    }
  }
}

interface BootstapProps {
  composerApi?: Partial<Pick<ComposerApi, 'context'>>
  config: string | PluginConfiguration | undefined
  microlcApi?: Partial<MicrolcApi>
  name: string
  schema?: SchemaOptions | undefined
}

interface MountProps {
  composerApi?: Partial<Pick<ComposerApi, 'context'>>
  container: HTMLElement
  microlcApi?: Partial<MicrolcApi>
  name: string
  properties?: Record<string, unknown>
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

const composerConfig = new Map<string, ResolvedConfig>()
const parent = new Map<string, HTMLElement | null>()
const props: Pick<MountProps, 'composerApi' | 'microlcApi'> = {}

const logger = (name: string, ...args: string[]) => {
  if (import.meta.env.MODE === 'development') {
    console.info(`
    [micro-lc][composer]: ${name} => ${args.join(' ')}
  `)
  }
}

export function craftLanguageHeader(language = window.navigator.language, fallback: string | null | undefined): Record<'Accept-Language', string> {
  let acceptLanguage = language

  const [main, secondary] = language.split('-') as [string, string | undefined]
  if (secondary !== undefined) {
    acceptLanguage = `${acceptLanguage}, ${main};q=0.5`
  }

  if (fallback) {
    const containsFallback = acceptLanguage.split(',')
      .map(tag => tag.split(';')[0])
      .map(tag => tag.trim())
      .includes(fallback)
    if (!containsFallback) {
      acceptLanguage = `${acceptLanguage}, ${fallback};q=0.1`
    }
  }

  return {
    'Accept-Language': acceptLanguage,
  }
}

export async function bootstrap({
  name,
  config,
  microlcApi,
  schema,
}: BootstapProps) {
  logger(name, 'starting bootstrap...')

  let resolvedConfig = config

  const validator = microlcApi?.getExtensions?.().json?.validator ?? ((conf: unknown) => (conf as PluginConfiguration))
  const fetcher = microlcApi?.getExtensions?.().json?.fetcher
    ?? (() => Promise.reject(new TypeError('[micro-lc][composer] no fetcher was provided on micro-lc API')))
  const headers = craftLanguageHeader(
    microlcApi?.getExtensions?.().language?.getLanguage?.(),
    microlcApi?.getExtensions?.().language?.getFallbackLanguage?.()
  )

  if (typeof config === 'string') {
    resolvedConfig = await fetcher(config, { headers })
      .then((jsonConfig) => {
        if (schema) {
          return validator<PluginConfiguration>(
            jsonConfig,
            schema,
            {
              defaultValue: jsonConfig as PluginConfiguration,
              file: `plugin config -> ${name}`,
            }
          )
        }

        return jsonConfig as PluginConfiguration
      })
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
    composerApi,
    microlcApi,
    container,
  }: MountProps
): Promise<null> {
  logger(name, 'starting mounting...')
  const root: HTMLElement = parent.get(name) ?? container.querySelector(`[id="${name}"]`) ?? container
  parent.set(name, root)

  let done = Promise.resolve<void | null>(null)

  // set props
  if (composerApi !== undefined) {
    props.composerApi = composerApi
  }
  if (microlcApi !== undefined) {
    props.microlcApi = microlcApi
  }

  const currentComposerApi = composerApi ?? props.composerApi
  const currentMicrolcApi = microlcApi ?? props.microlcApi
  const observer = new BehaviorSubject<EventWithUser>({})
  const { subscribe = observer.subscribe.bind(observer) } = currentMicrolcApi ?? {}

  subscribe(({ user }) => {
    const config = composerConfig.get(name)
    if (config) {
      const virtualContainer = document.createElement('div')
      done = render(
        config,
        virtualContainer,
        {
          ...currentComposerApi?.context,
          composerApi: { context: currentComposerApi?.context, createComposerContext, premount },
          currentUser: user,
          eventBus: createPool(),
        }
      ).then(() => {
        root.replaceChildren(...virtualContainer.childNodes)
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
    container.replaceChildren()
    parent.set(name, null)
  }

  return Promise.resolve(null)
}

export async function update() {
  logger('starting update...')

  logger('update has finished...')
  return Promise.resolve(null)
}
