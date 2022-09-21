export * from './qiankun'

import type { ImportMap } from '@micro-lc/interfaces'

import type { CompleteConfig } from '../config'
import { applyImportMap, setImportMap } from '../dom'
import type MicroLC from '../micro-lc'

import type { PartialObject } from './types'

export type { PartialObject }

export interface MicrolcApi<T extends PartialObject> {
  readonly applyImportMap: (id: string) => void
  readonly extensions: Readonly<Partial<T>>
  readonly getApplications: () => Readonly<CompleteConfig['applications']>
  readonly getCurrentConfig: () => Readonly<CompleteConfig>
  readonly history: History & {
    goToPlugin: (id: string, data: unknown) => void
  }
  readonly setCurrentConfig: (newConfig: CompleteConfig) => void
  readonly setExtension: (key: keyof T, value: T[keyof T]) => Readonly<Partial<T>>
  readonly setImportMap: (id: string, nextImportmap: ImportMap) => void
  readonly shared: Readonly<Record<string, unknown>>
}

export function createMicrolcApiInstance<Extensions extends PartialObject>(
  this: MicroLC<Extensions>
): () => MicrolcApi<Extensions> {
  return () => Object.freeze({
    applyImportMap: (id: string) => applyImportMap
      .call<MicroLC<Extensions>, [string], void>(this, id),
    extensions: Object.freeze({ ...this.extensions }),
    getApplications: () => Object.freeze([...this.config.applications]),
    getCurrentConfig: () => Object.freeze({ ...this.config }),
    history: {
      ...window.history,
      goToPlugin: (_id: string, data: unknown): void => {
        const url = this.config.applications.find(({ id }) => id === _id)?.route
        if (url) {
          window.history.pushState(data, '', url)
        }
      },
    },
    setCurrentConfig: (newConfig: CompleteConfig) => { this.config = newConfig },
    setExtension: (key: keyof Extensions, value: Extensions[keyof Extensions]) => {
      this.extensions[key] = value
      return Object.freeze({ ...this.extensions })
    },
    setImportMap,
    shared: Object.freeze({ ...this.config.shared }),
  })
}
