import type { ImportMap } from '@micro-lc/interfaces'

import type { CompleteConfig } from '../config'

import type { BaseExtension } from './extensions'
import type MicroLC from './micro-lc'

export interface MicrolcApi<T extends BaseExtension> {
  readonly applyImportMap: (id: string, importmap: ImportMap) => void
  readonly getApplications: () => Readonly<CompleteConfig['applications']>
  readonly getCurrentConfig: () => Readonly<CompleteConfig>
  readonly getExtensions: () => Readonly<T>
  readonly router: {
    goToApplication<S = unknown>(id: string, opts?: {data?: S; type?: 'push' | 'replace'}): void
    open: (url: string | URL | undefined, target?: string | undefined, features?: string | undefined) => void
  }
  readonly setCurrentConfig: (newConfig: CompleteConfig) => void
  readonly setExtension: (key: keyof T, value: T[keyof T]) => Readonly<T>
}

export function createMicrolcApiInstance<Extensions extends BaseExtension>(
  this: MicroLC<Extensions>
): () => MicrolcApi<Extensions> {
  const getApi = () => Object.freeze({
    applyImportMap: (id: string, importmap: ImportMap) => { this.applicationsImportMaps.set(id, importmap) },
    getApplications: () => Object.freeze([...this.config.applications]),
    getCurrentConfig: () => Object.freeze({ ...this.config }),
    getExtensions: () => Object.freeze({ ...this.extensions }),
    router: {
      goToApplication: (_id: string, data?: unknown): void => {
        const url = this.config.applications.find(({ id }) => id === _id)?.route
        if (url) {
          window.history.pushState(data, '', url)
        }
      },
      open: (url: string | URL | undefined, target?: string | undefined, features?: string | undefined) => {
        window.open(url, target, features)
      },
    },
    setCurrentConfig: (newConfig: CompleteConfig) => { this.config = newConfig },
    setExtension: (key: keyof Extensions, value: Extensions[keyof Extensions]) => {
      this.extensions[key] = value
      return Object.freeze({ ...this.extensions })
    },
  })

  if (process.env.NODE_ENV === 'development') {
    Object.defineProperty(window, 'getMicrolcApi', { value: getApi })
  }

  return getApi
}
