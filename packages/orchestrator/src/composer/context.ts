import type { Content, PluginConfiguration, ImportMap } from '@micro-lc/interfaces'
import type { RenderOptions } from 'lit-html'
import { html, render } from 'lit-html'

import type { BaseExtension } from '../apis'
import type Microlc from '../apis'
import { assignContent } from '../dom'
import { toArray } from '../utils/array'

import { interpolate } from './compiler'
import { jsonToHtml } from './json'
import { lexer } from './lexer'

interface ComposerOptions {
  context?: Record<string, unknown>
  extraProperties?: string[]
}

type ComposerContextAppender = (container: HTMLElement | DocumentFragment, options?: RenderOptions) => void

export type ExtendedHTMLElement<S extends Record<string, unknown>, T extends HTMLElement = HTMLElement> =
  T & S

export async function createComposerContext(
  content: Content,
  { extraProperties, context = {} }: ComposerOptions = {}
): Promise<ComposerContextAppender> {
  const htmlBuffer = jsonToHtml(content, extraProperties)
  const template = await lexer(htmlBuffer)
  const variables = interpolate(template.variables, context)
  const htmlTemplate = html(template.literals, ...variables)
  return (container, options) => render(htmlTemplate, container, options)
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

export async function premount<T extends BaseExtension>(this: Microlc<T>, id: string | HTMLScriptElement, config: PluginConfiguration): Promise<ResolvedConfig> {
  let uris: string[] = []
  let importmap: ImportMap | undefined

  if (id instanceof HTMLScriptElement) {
    const currentType = id.type
    const newType = this.disableShims ? 'importmap' : 'importmap-shim'
    if (currentType !== newType) {
      id.type = newType
    }
  }

  if (config.sources) {
    const { sources } = config

    uris = parseSources(sources)

    if (uris.length > 0) {
      await Promise.all(uris.map((uri) => importShim(uri).catch(console.error)))
    }

    importmap = (!Array.isArray(sources) && typeof sources !== 'string')
      ? sources.importmap
      : undefined

    // script element provided
    if (id instanceof HTMLScriptElement) {
      assignContent(id, importmap ?? {})
    } else if (importmap) {
      this.getApi().applyImportMap(id, importmap)
    }
  }

  return Promise.resolve({
    content: config.content,
    sources: { importmap, uris },
  })
}
