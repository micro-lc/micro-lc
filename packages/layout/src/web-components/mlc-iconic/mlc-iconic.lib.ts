import type { IconComponent } from '@micro-lc/iconic'
import { importIcon } from '@micro-lc/iconic/import-icon'
import { html } from 'lit'
import type { DirectiveResult } from 'lit/directive'
import type { UnsafeHTMLDirective } from 'lit/directives/unsafe-html.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

import { toArray } from '../commons/utils'

import type { MlcIconic } from './mlc-iconic'

export const emptyIcon = html`<svg></svg>`

function iconCompose({ tag, attrs, children }: IconComponent, style?: CSSStyleDeclaration): DirectiveResult<typeof UnsafeHTMLDirective> {
  const properties = Object
    .entries(attrs ?? {})
    .reduce<string[]>((props, [key, value]) => {
      typeof value === 'string' && props.push(`${key}="${value}"`)
      return props
    }, [])

  if (!children) { return `<${tag} ${properties.join(' ')}></${tag}>` }

  const mapper = (cc: IconComponent[]) => cc
    .filter(Boolean)
    .map(val => iconCompose(val))
    .join('')

  return unsafeHTML(`
    <${tag} ${properties.join(' ')} style="${style?.cssText ?? ''}">
      ${mapper(toArray(children))}
    </${tag}>
  `)
}

export async function renderIcon(this: MlcIconic) {
  if (!this.selector || !this.library) {
    this._icon = emptyIcon
    return
  }

  const resource = this.src ? { library: this.library, src: this.src } : this.library

  const iconComponent = await importIcon(this.selector, resource)
  this._icon = html`${iconCompose(iconComponent, this.style)}`
}
