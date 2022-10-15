import type { IconComponent } from '@micro-lc/iconic'
import { importIcon } from '@micro-lc/iconic/import-icon'
import type { TemplateResult } from 'lit'
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

export async function renderIcon(this: MlcIconic): Promise<TemplateResult<1>> {
  if (!this.selector || !this.library) {
    return emptyIcon
  }

  const resource = this.src ? { library: this.library, src: this.src } : this.library

  return importIcon(this.selector, resource)
    .then((iconComponent) => html`${iconCompose(iconComponent, this.style)}`)
    .catch(() => emptyIcon)
}
