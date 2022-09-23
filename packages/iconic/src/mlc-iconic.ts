import { render, html } from 'lit-html'
import type { TemplateResult } from 'lit-html'
import type { DirectiveResult } from 'lit-html/directive'
import type { UnsafeHTMLDirective } from 'lit-html/directives/unsafe-html.js'
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'

import type { IconComponent, Library, ResourceObject } from './import-icon'
import importIcon, { isResourceObject, isResourceKey, toArray } from './import-icon'

const emptyIcon = html`<svg></svg>`

function iconCompose(
  { tag, attrs, children }: IconComponent
): DirectiveResult<typeof UnsafeHTMLDirective> {
  const properties = Object
    .entries(attrs ?? {})
    .reduce<string[]>((props, [key, value]) => {
      typeof value === 'string' && props.push(`${key}="${value}"`)
      return props
    }, [])

  if (!children) {
    return `<${tag} ${properties.join(' ')}></${tag}>`
  }

  const mapper = (cc: IconComponent[]) =>
    cc.filter(Boolean).map(iconCompose).join('')

  return unsafeHTML(`
    <${tag} ${properties.join(' ')}>
      ${mapper(toArray(children))}
    </${tag}>
  `)
}

type Properties = 'selector' | 'library' | 'src'

function check<T>(next: unknown, custom?: (input: unknown) => input is T): next is T {
  return custom?.(next) ?? typeof next === 'string'
}

class MlcIconic extends HTMLElement {
  static get observedAttributes() { return ['selector', 'library', 'src'] }

  private _updateComplete = false

  protected _selector: string | null = null

  protected _library: Library | null = null

  protected _src: string | null = null

  protected _resource?: Exclude<ResourceObject, string>

  protected set _content(content: TemplateResult<1> | undefined) {
    content && render(content, this)
  }

  protected update(): void {
    if (!this.selector || !this.library) {
      this._content = emptyIcon
      return
    }

    const resource = this.src
      ? { library: this.library, src: this.src }
      : this.library

    importIcon(this.selector, resource)
      .then((component) => {
        this._content = html`${iconCompose(component)}`
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        this._updateComplete = true
      })
  }

  handlePropertyUpdate<T extends string>(
    name: Properties, oldValue: string | null, newValue: unknown,
    customCheck?: (val: unknown) => val is T
  ): void {
    this._updateComplete = false
    if (newValue !== oldValue) {
      let nextValue: T | null = null
      if (typeof newValue === 'string') {
        this.setAttribute(name, newValue)
        nextValue = check<T>(newValue, customCheck) ? newValue : null
      } else {
        this.removeAttribute(name)
        nextValue = null
      }

      Object.assign(this, { [`_${name}`]: nextValue })
      this.update()
    }
  }

  get selector(): string | null {
    return this._selector
  }
  set selector(selector: unknown) {
    this.handlePropertyUpdate('selector', this._selector, selector)
  }
  get library(): Library | null {
    return this._library
  }
  set library(library: unknown) {
    this.handlePropertyUpdate('library', this._library, library, isResourceKey)
  }
  get src(): string | null {
    return this._src
  }
  set src(src: unknown) {
    this.handlePropertyUpdate('src', this._src, src)
  }
  get resource(): Exclude<ResourceObject, string> | undefined {
    return this._resource
  }
  set resource(resource: unknown) {
    if (isResourceObject(resource)) {
      this.handlePropertyUpdate('library', this._library, resource.library, isResourceKey)
      this.handlePropertyUpdate('src', this._src, resource.src)
    }
  }

  get updateComplete(): boolean {
    return this._updateComplete
  }

  attributeChangedCallback(
    name: Properties, oldValue: string | null, newValue: string | null
  ): void {
    if (oldValue !== newValue) {
      Object.assign(this, { [name]: newValue })
    }
  }
}

customElements.define('mlc-iconic', MlcIconic)
