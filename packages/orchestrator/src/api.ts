import type { Application } from '@micro-lc/interfaces'

import type { CompleteConfig } from './config'
import type MicroLC from './micro-lc'

export interface MicrolcApi<T extends Record<string, never> = Record<string, never>> {
  readonly extensions: Readonly<Partial<T>>
  readonly getApplications: () => Readonly<CompleteConfig['applications']>
  readonly getCurrentApplication: () => Application['id'] | undefined
  readonly getCurrentConfig: () => Readonly<CompleteConfig>
  readonly history: History & {
    goToPlugin: (id: string, data: unknown) => void
  }
  readonly setCurrentConfig: (newConfig: CompleteConfig) => void
  readonly setExtension: (key: keyof T, value: T[keyof T]) => Readonly<Partial<T>>
  readonly shared: Readonly<Record<string, unknown>>
}

export class MicrolcApiInstance<T extends Record<string, never>> {
  private _microlc: MicroLC
  private _config: CompleteConfig
  private _extensions: Partial<T>

  private setExtension(key: keyof T, value: T[keyof T]): void {
    this._extensions[key] = value
  }

  constructor(
    microlc: MicroLC,
    initialExtensions: T,
  ) {
    this._microlc = microlc
    this._extensions = initialExtensions
    this._config = microlc.config
  }

  getApi(): MicrolcApi<T> {
    return Object.freeze({
      extensions: Object.freeze({ ...this._extensions }),
      getApplications: () => Object.freeze([...this._config.applications]),
      getCurrentApplication: () => qiankun?.getCurrentRunningApp()?.name,
      getCurrentConfig: () => Object.freeze({ ...this._config }),
      history: {
        ...window.history,
        goToPlugin: (_id: string, data: unknown): void => {
          const url = this._config.applications.find(({ id }) => id === _id)?.route
          if (url) {
            window.history.pushState(data, '', url)
          }
        },
      },
      setCurrentConfig: (newConfig: CompleteConfig) => { this._microlc.config = newConfig },
      setExtension: (key: keyof T, value: T[keyof T]) => {
        this.setExtension(key, value)
        return Object.freeze({ ...this._extensions })
      },
      shared: Object.freeze({ ...this._config.shared }),
    })
  }
}
