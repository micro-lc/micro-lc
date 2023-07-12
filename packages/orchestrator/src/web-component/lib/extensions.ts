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
import type { CSSConfig } from '../../dom-manipulation'
import { createCSSStyleSheets, injectStyleToElements } from '../../dom-manipulation'
import type { SchemaOptions } from '../../utils/json'
import { jsonFetcher, jsonToObject, jsonToObjectCatcher } from '../../utils/json'
import type { Microlc } from '../micro-lc'

import type { MicrolcEvent } from './api'
import { currentApplication$, rerouteErrorHandler } from './router'
import { handleUpdateError } from './update'

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

export function updateCSS<T extends BaseExtension, E extends MicrolcEvent>(this: Microlc<T, E>, css: CSSConfig): void {
  this._styleElements.forEach((style) => { style.remove() })

  /**
   * 🍎 webkit does not support `adoptedStyleSheets`
   * @link {https://caniuse.com/mdn-api_document_adoptedstylesheets}
   */
  if (this.shadowRoot && 'adoptedStyleSheets' in this.ownerDocument) {
    const stylesheets = createCSSStyleSheets(css)
    this.shadowRoot.adoptedStyleSheets = [...stylesheets]
  } else {
    const styleTags = Array(2).fill(0).map(() =>
      this.ownerDocument.createElement('style')
    ) as [HTMLStyleElement, HTMLStyleElement]

    this._styleElements = injectStyleToElements(css, styleTags, this.shadowRoot !== null)
    this._styleElements.forEach((el) => {
      this.shadowRoot
        ? this.shadowRoot.insertBefore(el, this.shadowRoot.firstChild)
        : this.ownerDocument.head.appendChild(el)
    })
  }
}

function initLanguageExtension<T extends BaseExtension, E extends MicrolcEvent>(this: Microlc<T, E>) {
  let currentLanguage = window.navigator.language
  return {
    getLanguage(): string {
      return currentLanguage
    },
    setLanguage: (nextLang: string): void => {
      currentLanguage = nextLang
      setTimeout(() => {
        this._prepareForUpdate()
        this.update()
          .then((done) => {
            if (done) {
              this.matchCache.invalidateCache()
              this._reroute().catch(rerouteErrorHandler)
              this._completeUpdate()
            }
          })
          .catch((err: TypeError) => handleUpdateError(currentApplication$, err))
      })
    },
  }
}

export function initBaseExtensions<T extends BaseExtension, E extends MicrolcEvent>(this: Microlc<T, E>): T {
  return {
    css: {
      setStyle: (css: CSSConfig) => {
        updateCSS.call<Microlc<T, E>, [CSSConfig], void>(this, css)
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
    language: initLanguageExtension.call<Microlc<T, E>, [], BaseExtension['language']>(this),
  } as T
}
