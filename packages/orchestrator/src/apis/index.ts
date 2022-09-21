import type { ImportMap } from '@micro-lc/interfaces'

import type { CompleteConfig } from '../config'
import type MicroLC from '../micro-lc'

import type { BaseExtension } from './types'

export * from './qiankun'

export interface MicrolcApi<T extends BaseExtension> {
  readonly applyImportMap: (id: string, importmap: ImportMap) => void
  readonly extensions: Readonly<Partial<T>>
  readonly getApplications: () => Readonly<CompleteConfig['applications']>
  readonly getCurrentConfig: () => Readonly<CompleteConfig>
  readonly history: History & {
    goToPlugin: (id: string, data: unknown) => void
  }
  readonly setCurrentConfig: (newConfig: CompleteConfig) => void
  readonly setExtension: (key: keyof T, value: T[keyof T]) => Readonly<Partial<T>>
  readonly shared: Readonly<Record<string, unknown>>
}

export function createMicrolcApiInstance<Extensions extends BaseExtension>(
  this: MicroLC<Extensions>
): () => MicrolcApi<Extensions> {
  return () => Object.freeze({
    applyImportMap: (id: string, importmap: ImportMap) => { this.applicationsImportMaps.set(id, importmap) },
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
    shared: Object.freeze({ ...this.config.shared }),
  })
}

export type { BaseExtension }
