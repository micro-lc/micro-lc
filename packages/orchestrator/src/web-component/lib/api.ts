import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { CompleteConfig } from '../../config'
import type { Microlc } from '../micro-lc'

import type { BaseExtension } from './extensions'
import type { QiankunMicroApp } from './qiankun'
import { currentApplication$, getCurrentApplicationAssets } from './router'

export type MicrolcEvent = Record<string, unknown>

export interface MicrolcApi<
  T extends BaseExtension, E extends MicrolcEvent = MicrolcEvent
> {
  readonly currentApplication$: Observable<string | undefined>
  readonly getApplications: () => Readonly<CompleteConfig['applications']>
  readonly getCurrentApplication: () => Readonly<Partial<{handlers: QiankunMicroApp | undefined; id: string}>>
  readonly getCurrentConfig: () => Readonly<CompleteConfig>
  readonly getExtensions: () => Readonly<Partial<T>>
  readonly next: (value: E) => void
  readonly router: {
    goTo: (url: string | URL | undefined) => void
    goToApplication<S = unknown>(id: string, opts?: {data?: S; type?: 'push' | 'replace'}): Promise<void>
    goToErrorPage(statusCode?: number): void
    open: typeof window.open
    pushState: typeof window.history.pushState
    replaceState: typeof window.history.replaceState
  }
  readonly set: (event: Partial<E>) => void
  readonly setCurrentConfig: (newConfig: CompleteConfig) => void
  readonly setExtension: (key: keyof T, value: T[keyof T]) => Readonly<T>
  readonly subscribe: (next: (value: Partial<E>) => void) => Subscription
}

export function createMicrolcApiInstance<Extensions extends BaseExtension, Event extends MicrolcEvent>(
  this: Microlc<Extensions>
): () => MicrolcApi<Extensions, Event> {
  const currentState: Partial<Event> = {}
  const bus = new BehaviorSubject<Partial<Event>>(currentState)

  return () => Object.freeze({
    currentApplication$,
    getApplications: () => Object.freeze({ ...this._config.applications }),
    getCurrentApplication: () => Object.freeze({ ...getCurrentApplicationAssets() }),
    getCurrentConfig: () => Object.freeze({ ...this._config }),
    getExtensions: () => Object.freeze({ ...this._extensions }),
    next: (value: Partial<Event>) => bus.next(value),
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

        const { [_id]: app } = this._config.applications
        window.history.pushState(data, '', app.route)
        return Promise.resolve()
      },
      goToErrorPage: async (statusCode?: number): Promise<void> => {
        return this._rerouteToError(statusCode).then(() => { /* noop */ })
      },
      open: (url?: string | URL | undefined, target?: string | undefined, features?: string | undefined) =>
        window.open(url, target, features),
      pushState: (data: unknown, unused: string, url?: string | URL | null | undefined) =>
        window.history.pushState(data, unused, url),
      replaceState: (data: unknown, unused: string, url?: string | URL | null | undefined) =>
        window.history.replaceState(data, unused, url),
    },
    set: (event: Partial<Event>) => {
      const newState = Object.assign(currentState, event)
      bus.next(newState)
    },
    setCurrentConfig: (newConfig: CompleteConfig) => { this.config = newConfig },
    setExtension: (key: keyof Extensions, value: Extensions[keyof Extensions]) => {
      this._extensions[key] = value
      return Object.freeze({ ...this._extensions })
    },
    subscribe: (next: (value: Partial<Event>) => void) =>
      bus.asObservable().subscribe(next),
  })
}
