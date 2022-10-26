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
