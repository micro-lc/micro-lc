import type { CSSConfig } from '../../dom-manipulation'
import { createCSSStyleSheets, injectStyleToElements } from '../../dom-manipulation'
import type { SchemaOptions } from '../../utils/json'
import { jsonFetcher, jsonToObject, jsonToObjectCatcher } from '../../utils/json'
import type { Microlc } from '../micro-lc'

import { updateErrorHandler } from './qiankun'

type HTTPClient = typeof window.fetch

interface JsonCatcherOptions<S> {
  defaultValue?: S
  file?: string
}

export type BaseExtension = Record<string, unknown> & {
  css: {
    setStyle: (styles: CSSConfig) => void
  }
  head: {
    setIcon: (attrs: Partial<Pick<HTMLLinkElement, 'sizes' | 'href' | 'type'>>) => void
    setTitle: (title: string) => void
  }
  httpClient: HTTPClient
  json: {
    fetcher: typeof jsonFetcher
    validator: <S>(json: unknown, schema: SchemaOptions, opts?: JsonCatcherOptions<S>) => Promise<S>
  }
  language: {
    getLanguage: () => string
    setLanguage: (lang: string) => void
  }
}

export function updateCSS<T extends BaseExtension>(this: Microlc<T>, css: CSSConfig): void {
  this._styleTags.forEach((style) => { style.remove() })

  /**
   * 🍎 webkit does not support `adoptedStyleSheets`
   * @link {https://caniuse.com/?search=adoptedStyleSheets}
   */
  if (this._isShadow() && 'adoptedStyleSheets' in this.ownerDocument) {
    const stylesheets = createCSSStyleSheets(css)
    this.shadowRoot.adoptedStyleSheets = [...stylesheets]
  } else {
    const styleTags = Array(2).fill(0).map(() =>
      this.ownerDocument.createElement('style')
    ) as [HTMLStyleElement, HTMLStyleElement]

    this._styleTags = injectStyleToElements(css, styleTags, this._isShadow())
    this._styleTags.forEach((el) => {
      this._isShadow()
        ? this.shadowRoot.insertBefore(el, this.shadowRoot.firstChild)
        : this.ownerDocument.head.appendChild(el)
    })
  }
}

function initLanguageExtension<T extends BaseExtension>(this: Microlc<T>) {
  let currentLanguage = window.navigator.language
  return {
    getLanguage(): string {
      return currentLanguage
    },
    setLanguage: (nextLang: string): void => {
      currentLanguage = nextLang
      const { id, handlers } = this.getApi().getCurrentApplication()
      handlers?.update?.({}).catch((err: TypeError) => updateErrorHandler(id ?? 'unknown', err))
    },
  }
}

export function initBaseExtensions<T extends BaseExtension>(this: Microlc<T>): T {
  return {
    css: {
      setStyle: (css: CSSConfig) => {
        console.log('css', css)
        updateCSS.call<Microlc<T>, [CSSConfig], void>(this, css)
      },
    },
    head: {
      setIcon: ({ href, sizes, type }: Partial<Pick<HTMLLinkElement, 'sizes' | 'href' | 'type'>>) => {
        const icon: HTMLLinkElement = this.ownerDocument.head.querySelector('link[rel=icon]') ?? this.ownerDocument.createElement('link')
        Object.assign(icon, {
          href: href ?? icon.href, sizes: sizes ?? icon.sizes, type: type ?? icon.type,
        })
      },
      setTitle: (nextTitle: string): void => {
        const title = this.ownerDocument.head.querySelector('title') ?? this.ownerDocument.createElement('title')
        title.textContent = nextTitle
        !title.isConnected && this.ownerDocument.head.appendChild(title)
      },
    },
    httpClient: (input: RequestInfo | URL, init?: RequestInit | undefined) => window.fetch(input, init),
    json: {
      fetcher: jsonFetcher,
      async validator<S>(
        json: unknown,
        schema: SchemaOptions,
        {
          defaultValue = json as S,
          file,
        }: JsonCatcherOptions<S> = {}
      ) {
        return jsonToObject(json, schema)
          .catch((err: TypeError) =>
            jsonToObjectCatcher<S>(err, defaultValue, file)
          )
      },
    },
    language: initLanguageExtension.call<Microlc<T>, [], BaseExtension['language']>(this),
  } as T
}
