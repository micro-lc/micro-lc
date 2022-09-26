import type { SchemaOptions } from '../../utils/json'
import { jsonFetcher, jsonToObject, jsonToObjectCatcher } from '../../utils/json'
import type { Microlc } from '../micro-lc'

import { updateErrorHandler } from './qiankun'

type HTTPClient = Record<string, unknown>

interface JsonCatcherOptions<S> {
  defaultValue?: S
  file?: string
}

export type BaseExtension = Record<string, unknown> & {
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
    // TODO
    httpClient: {},
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
