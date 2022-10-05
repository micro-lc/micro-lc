/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ImportMap } from '@micro-lc/interfaces/v2'
import { BehaviorSubject } from 'rxjs'

import type { CompleteConfig } from '../../config'
import type { Microlc } from '../micro-lc'

import type { MicrolcEvent, Observable } from './events'
import type { BaseExtension } from './extensions'
import type { QiankunMicroApp } from './qiankun'
import { currentApplication$, getCurrentApplicationAssets } from './router'

export interface MicrolcApi<
  T extends BaseExtension, E extends MicrolcEvent = MicrolcEvent
> extends Observable<Partial<E>> {
  readonly currentApplication$: Observable<string | undefined>
  readonly getApplications: () => Readonly<CompleteConfig['applications']>
  readonly getCurrentApplication: () => Readonly<Partial<{handlers: QiankunMicroApp | undefined; id: string}>>
  readonly getCurrentConfig: () => Readonly<CompleteConfig>
  readonly getExtensions: () => Readonly<Partial<T>>
  readonly router: {
    goToApplication<S = unknown>(id: string, opts?: {data?: S; type?: 'push' | 'replace'}): Promise<void>
    goToErrorPage(statusCode?: number): void
    open: (url: string | URL | undefined, target?: string | undefined, features?: string | undefined) => void
  }
  readonly set: (event: Partial<E>) => void
  readonly setCurrentConfig: (newConfig: CompleteConfig) => void
  readonly setExtension: (key: keyof T, value: T[keyof T]) => Readonly<T>
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
      goToApplication: async (_id: string, data?: unknown): Promise<void> => {
        if (!(_id in this._config.applications)) {
          return this._rerouteToError(404)
        }

        const { [_id]: app } = this._config.applications
        window.history.pushState(data, '', app.route)
        return Promise.resolve()
      },
      goToErrorPage: async (statusCode?: number): Promise<void> => {
        return this._rerouteToError(statusCode)
      },
      open: (url: string | URL | undefined, target?: string | undefined, features?: string | undefined) => {
        window.open(url, target, features)
      },
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
