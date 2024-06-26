/**
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
import type { Content, PluginConfiguration, ImportMap } from '@micro-lc/interfaces/v2'
import type { RenderOptions } from 'lit-html'
import { html, render as litRender } from 'lit-html'

import { interpolate } from './compiler.js'
import { parseSources } from './importmap.js'
import { jsonToHtml } from './json.js'
import { lexer } from './lexer.js'

export interface ComposerApi {
  context: ComposerOptions['context']
  createComposerContext: typeof createComposerContext
  premount: typeof premount
}

export interface ComposerOptions {
  context?: Record<string, unknown>
  extraProperties?: Set<string> | string[]
}

export interface Modules {
  [uri: string]: { default: unknown } & object
}

export interface ResolvedConfig {
  content: Content
  sources: {
    importmap?: ImportMap
    modules: Modules
    uris: string[]
  }
}

export type ComposerContextAppender = (container: HTMLElement | DocumentFragment, options?: RenderOptions) => void

export type ExtendedHTMLElement<S extends Record<string, unknown>, T extends HTMLElement = HTMLElement> =
  T & S

export async function createComposerContext(
  content: Content,
  { extraProperties, context = {} }: ComposerOptions = {}
): Promise<ComposerContextAppender> {
  const extra = Array.isArray(extraProperties) ? new Set(extraProperties) : extraProperties
  const htmlBuffer = jsonToHtml(content, extra)
  const template = await lexer(htmlBuffer)
  const variables = interpolate(template.variables, context)
  const htmlTemplate = html(template.literals, ...variables)
  return (container, options) => litRender(htmlTemplate, container, options)
}

interface ImportShimContext {
  importShim: typeof importShim
}

export async function premount(
  config: PluginConfiguration,
  proxyWindow: ImportShimContext = window,
  reporter: (err: unknown) => void = console.error
): Promise<ResolvedConfig> {
  let uris: string[] = []
  let importmap: ImportMap | undefined
  let modules: Modules = {}
  let done: Promise<unknown> = Promise.resolve()

  if (config.sources) {
    const { sources } = config

    importmap = (!Array.isArray(sources) && typeof sources !== 'string')
      ? sources.importmap ?? {}
      : {}

    try {
      proxyWindow.importShim.addImportMap(importmap)
    } catch (err) {
      reporter(err)
    }

    uris = parseSources(sources)

    if (uris.length > 0) {
      done = Promise.all(uris.map(
        (uri) => (proxyWindow.importShim(uri))
          .then((module) => {
            modules = {
              ...modules,
              [uri]: module,
            }
          })
          .catch(reporter)
      ))
    }
  }

  return done.then(() => ({
    ...config,
    sources: { importmap, modules, uris },
  }))
}

export async function render(
  config: ResolvedConfig, container: HTMLElement, context: Record<string, unknown> = {}
): Promise<null> {
  const appenderPromise = createComposerContext(
    config.content,
    {
      context,
      extraProperties: new Set(Object.keys(context)),
    }
  )

  return appenderPromise.then((appender) => {
    appender(container)
    return null
  })
}

export * from './pool.js'
