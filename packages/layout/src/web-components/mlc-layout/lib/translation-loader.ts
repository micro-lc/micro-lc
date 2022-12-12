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
import { dirname, resolve } from 'path'

export type Locale = Record<string, unknown>

class CurrentLocale {
  #current = new Map<string, Locale>()

  set(locale: Record<string, Locale>): void {
    Object
      .entries(locale)
      .reduce((currLocaleMap, [key, value]) => {
        currLocaleMap.set(key, value)
        return currLocaleMap
      }, this.#current)
  }

  get(tag: string): Locale | undefined {
    return this.#current.get(tag)
  }
}

const currentLocale = new CurrentLocale()

export const DEFAULT_LANGUAGE = 'en'

export const supportedLanguages = [DEFAULT_LANGUAGE, 'it']

export const getCurrentLocale = (): CurrentLocale => currentLocale

export const getLang = (microlcLang: string = window.navigator.language): string => {
  if (supportedLanguages.includes(microlcLang)) { return microlcLang }

  if (supportedLanguages.includes(microlcLang.substring(0, 2))) { return microlcLang.substring(0, 2) }

  return DEFAULT_LANGUAGE
}

export async function loadTranslations(lang: string): Promise<void> {
  const { pathname, origin } = new URL(import.meta.url)
  const resource = `${origin}${resolve(dirname(pathname), `./lang/${lang}.json`)}`

  const response = await fetch(resource)

  let translations: Record<string, Locale> = {}

  if (response.ok) {
    translations = await response.json() as Record<string, Locale>
  } else {
    console.error(`Something went wrong while fetching ${resource}`)
  }

  currentLocale.set(translations)
}
