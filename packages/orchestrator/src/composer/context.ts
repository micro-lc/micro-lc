import type { Content, PluginConfiguration, ImportMap } from '@micro-lc/interfaces'
import type { RenderOptions } from 'lit-html'
import { html, render } from 'lit-html'

import type { BaseExtension } from '../apis'
import type MicroLC from '../apis'
import { toArray } from '../utils/array'

import { interpolate } from './compiler'
import { jsonToHtml } from './json'
import { lexer } from './lexer'

interface ComposerOptions {
  context?: Record<string, unknown>
  extraProperties?: string[]
}

type ComposerContextAppender =
  (container: HTMLElement | DocumentFragment, options?: RenderOptions)
    => void

export type ExtendedHTMLElement<S extends Record<string, unknown>, T extends HTMLElement = HTMLElement> =
  T & S

export async function createComposerContext(
  layout: Content,
  { extraProperties, context = {} }: ComposerOptions = {}
): Promise<ComposerContextAppender> {
  const htmlBuffer = jsonToHtml(layout, extraProperties)
  const template = await lexer(htmlBuffer)
  const variables = interpolate(template.variables, context)
  return (container, options) => {
    render(html(template.literals, ...variables), container, options)
  }
}

function parseSources(sources: Exclude<PluginConfiguration['sources'], undefined>): string[] {
  const arrayOrObject:
      | string[]
      | {importmap?: ImportMap | undefined; uris: string | string[]}
     = typeof sources === 'string' ? [sources] : sources
  return Array.isArray(arrayOrObject) ? arrayOrObject : toArray(arrayOrObject.uris)
}

export interface ResolvedConfig {
  content: Content
  sources: {
    importmap?: ImportMap
    uris: string[]
  }
}

export async function premount<T extends BaseExtension>(this: MicroLC<T>, id: string, config: PluginConfiguration): Promise<ResolvedConfig> {
  let uris: string[] = []
  let importmap: ImportMap | undefined

  if (config.sources) {
    const { sources } = config

    uris = parseSources(sources)
    importmap = (!Array.isArray(sources) && typeof sources !== 'string')
      ? sources.importmap
      : undefined

    if (importmap) {
      this.getApi().applyImportMap(id, importmap)
    }

    if (uris.length > 0) {
      await Promise.all(uris.map((uri) => importShim(uri).catch(console.error)))
    }
  }

  return Promise.resolve({
    content: config.content,
    sources: { importmap, uris },
  })
}
