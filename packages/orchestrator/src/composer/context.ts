import type { Content } from '@micro-lc/interfaces'
import type { RenderOptions } from 'lit-html'
import { html, render } from 'lit-html'

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
