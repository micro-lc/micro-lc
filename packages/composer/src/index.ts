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
import { render, premount, createComposerContext, createPool } from './lib'

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

let assets: Promise<void> = Promise.resolve()
const composerConfig = new Map<string, ResolvedConfig>()
const parent = new Map<string, HTMLElement | null>()

const logger = (name: string, ...args: string[]) => {
  if (import.meta.env.MODE === 'development') {
    console.info(`
    [micro-lc][composer]: ${name} => ${args.join(' ')}
  `)
  }
}

export function craftLanguageHeader(lang: string | undefined, win = window): Record<'Accept-Language', string> {
  const language = lang ?? win.navigator.language
  const [main, secondary] = language.split('-') as [string, string | undefined]
  if (secondary !== undefined) {
    return {
      'Accept-Language': `${language}, ${main};q=0.5`,
    }
  }

  return {
    'Accept-Language': language,
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
    microlcApi?.getExtensions?.().language?.getLanguage?.()
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
  return null
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

  const observer = new BehaviorSubject<EventWithUser>({})
  const { subscribe = observer.subscribe.bind(observer) } = microlcApi ?? {}

  subscribe(({ user }) => {
    const config = composerConfig.get(name)
    if (config) {
      const virtualContainer = document.createElement('div')
      assets.then(() => render(
        config,
        virtualContainer,
        {
          ...composerApi?.context,
          composerApi: { context: composerApi?.context, createComposerContext, premount },
          currentUser: user,
          eventBus: createPool(),
        }
      )).then(() => {
        root.replaceChildren(...virtualContainer.childNodes)
        root.dispatchEvent(new Event('load'))
      }).catch(console.error)
    }
  })

  logger(name, 'mount has finished...')
  return null
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
