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
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { CompleteConfig } from '../../config'
import type { Microlc } from '../micro-lc'

import type { BaseExtension } from './extensions'
import { MFELoader } from './mfe-loader.js'
import type { RoutelessMicroApp } from './qiankun'
import { currentApplication$, getCurrentApplicationAssets } from './router.js'

export type MicrolcEvent = Record<string, unknown>

export interface MicrolcApi<
  T extends BaseExtension = BaseExtension, E extends MicrolcEvent = MicrolcEvent
> {
  readonly createLoader: () => MFELoader<T, E> | undefined
  readonly currentApplication$: Observable<string | undefined>
  readonly getApplications: () => Readonly<CompleteConfig['applications']>
  readonly getCurrentApplication: () => Readonly<Partial<{handlers: RoutelessMicroApp | undefined; id: string}>>
  readonly getCurrentConfig: () => Readonly<CompleteConfig>
  /**
   * @returns a frozen object containing all set extension. Can be modified by `setExtension` api method
   */
  readonly getExtensions: () => Readonly<Partial<T>>
  /**
   * @param value {Partial<E>} next value to be pushed in the current state bus
   * @returns
   */
  readonly next: (value: E) => void
  readonly router: {
    goTo: (url: string | URL | undefined) => void
    goToApplication<S = unknown>(id: string, data?: S): Promise<void>
    goToErrorPage(statusCode?: number): void
    open: typeof window.open
    pushState: typeof window.history.pushState
    replaceState: typeof window.history.replaceState
  }
  /**
   * @deprecated
   * @param event {Partial<E>} new state to be embedded with `micro-lc` and sent to the bus
   * @returns
   */
  readonly set: (event: Partial<E>) => void
  readonly setCurrentConfig: (newConfig: CompleteConfig) => void
  /**
   * Adds an extension to `micro-lc` like a Redux store, a language
   * context, a proxied fetch/http client, and so on...
   * @example
   * import { createStore } from 'redux'
   * const store = createStore(todos, ['Use Redux'])
   *
   * var api: MicrolcApi<BaseExtension & {store?: typeof store}> // 👈 `micro-lc` api
   * api.setExtension('store', store)
   *
   * @param key {keyof T} the name of the extension of type T
   * @param value {T[keyof T]} the value of the extension
   * @returns a frozen object containing all set extension
   */
  readonly setExtension: (key: keyof T, value: T[keyof T]) => Readonly<T>
  readonly subscribe: (next: (value: Partial<E>) => void) => Subscription
}

export function createMicrolcApiInstance<T extends BaseExtension, E extends MicrolcEvent>(
  this: Microlc<T, E>
): () => MicrolcApi<T, E> {
  const { microfrontendLoader } = this
  const currentState: Partial<E> = {}
  const bus = new BehaviorSubject<Partial<E>>(currentState)

  return () => Object.freeze({
    createLoader(this: MicrolcApi<T, E>) {
      return new MFELoader(this.getCurrentConfig(), () => this, microfrontendLoader)
    },
    currentApplication$,
    getApplications: () => Object.freeze({ ...this._config.applications }),
    getCurrentApplication: () => Object.freeze({ ...getCurrentApplicationAssets() }),
    getCurrentConfig: () => Object.freeze({ ...this._config }),
    getExtensions: () => Object.freeze({ ...this._extensions }),
    next: (value: Partial<E>) => bus.next(value),
    router: {
      goTo: (url: string | URL | undefined) => {
        if (url !== undefined) {
          const regularUrl = new URL(url, this.ownerDocument.baseURI)

          const isSameOrigin = regularUrl.origin === window.location.origin
          const isSamePathname = regularUrl.pathname === window.location.pathname

          if (isSameOrigin && isSamePathname) {
            window.history.replaceState(window.history.state, '', url)
          } else if (isSameOrigin) {
            window.history.pushState(null, '', url)
          } else {
            window.open(url)
          }
        }
      },
      goToApplication: async (_id: string, data?: unknown): Promise<void> => {
        if (!(_id in this._config.applications)) {
          return this._rerouteToError(404).then(() => { /* noop */ })
        }

        const route = this.loadedApps.get(_id)?.[0]
        return this._reroute({ data, url: route }).then(() => { /* no-op */ })
      },
      goToErrorPage: async (statusCode?: number, reason?: string): Promise<void> => {
        return this._rerouteToError(statusCode, reason).then(() => { /* noop */ })
      },
      open: (url?: string | URL | undefined, target?: string | undefined, features?: string | undefined) =>
        window.open(url, target, features),
      pushState: (data: unknown, unused: string, url?: string | URL | null | undefined) =>
        window.history.pushState(data, unused, url),
      replaceState: (data: unknown, unused: string, url?: string | URL | null | undefined) =>
        window.history.replaceState(data, unused, url),
    },
    set: (event: Partial<E>) => {
      const newState = Object.assign(currentState, event)
      bus.next(newState)
    },
    setCurrentConfig: (newConfig: CompleteConfig) => { this.config = newConfig },
    setExtension: (key: keyof T, value: T[keyof T]) => {
      this._extensions[key] = value
      return Object.freeze({ ...this._extensions })
    },
    subscribe: (next: (value: Partial<E>) => void) =>
      bus.asObservable().subscribe(next),
  })
}
