import type { Content } from '@micro-lc/interfaces'
import { html, render } from 'lit-html'

import { interpolate } from './compiler'
import { jsonToHtml } from './json'
import { lexer } from './lexer'

export async function compose(layout: Content, root: HTMLElement | DocumentFragment) {
  const htmlBuffer = jsonToHtml(layout)
  const template = await lexer(htmlBuffer)
  const variables = interpolate(template.variables)
  render(html(template.literals, variables), root)
}
