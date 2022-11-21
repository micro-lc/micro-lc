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
import type { ReplaySubject } from 'rxjs'

import { interpolate } from './compiler'
import { parseSources } from './importmap'
import { jsonToHtml } from './json'
import { lexer } from './lexer'

export interface ReplaySubjectPool<T = unknown> extends ReplaySubject<T> {
  [index: number]: ReplaySubject<T>
  pool: Record<string, ReplaySubject<T>>
}

export interface ComposerApi {
  context: ComposerOptions['context']
  createComposerContext: typeof createComposerContext
  premount: typeof premount
}

export interface ComposerOptions {
  context?: Record<string, unknown>
  extraProperties?: Set<string> | string[]
}

export interface ResolvedConfig {
  content: Content
  sources: {
    importmap?: ImportMap
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

export async function premount(config: PluginConfiguration, proxyWindow: ImportShimContext = window): Promise<ResolvedConfig> {
  let uris: string[] = []
  let importmap: ImportMap | undefined

  if (config.sources) {
    const { sources } = config

    importmap = (!Array.isArray(sources) && typeof sources !== 'string')
      ? sources.importmap ?? {}
      : {}

    try {
      proxyWindow.importShim.addImportMap(importmap)
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        console.error(err)
      }
    }

    uris = parseSources(sources)

    if (uris.length > 0) {
      await Promise.all(uris.map(
        (uri) => (proxyWindow.importShim(uri)).catch((err) => { console.error(err) })
      ))
    }
  }

  return Promise.resolve({
    content: config.content,
    sources: { importmap, uris },
  })
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
