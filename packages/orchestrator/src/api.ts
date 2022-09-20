import type { Application } from '@micro-lc/interfaces'

import type { CompleteConfig } from './config'

export interface MicrolcApi<T extends Record<string, never> = Record<string, never>> {
  readonly extensions: Readonly<Partial<T>>
  readonly getApplications: () => Readonly<CompleteConfig['applications']>
  readonly getCurrentApplication: () => Application['id'] | undefined
  readonly history: History & {
    goToPlugin: (id: string, data: unknown) => void
  }
  readonly setExtension: (key: keyof T, value: T[keyof T]) => Readonly<Partial<T>>
  readonly shared: Readonly<Record<string, unknown>>
}

export class MicrolcApiInstance<T extends Record<string, never>> {
  private _extensions: Partial<T>
  private _shared: Record<string, unknown>
  private _applications: CompleteConfig['applications']

  private setExtension(key: keyof T, value: T[keyof T]): void {
    this._extensions[key] = value
  }

  constructor(
    initialExtensions: T,
    {
      shared,
      applications,
    }: Pick<CompleteConfig, 'shared' | 'applications'>
  ) {
    this._extensions = initialExtensions
    this._shared = shared
    this._applications = applications
  }

  getApi(): MicrolcApi<T> {
    return Object.freeze({
      extensions: Object.freeze({ ...this._extensions }),
      getApplications: () => Object.freeze([...this._applications]),
      getCurrentApplication: () => qiankun?.getCurrentRunningApp()?.name,
      history: {
        ...window.history,
        goToPlugin: (_id: string, data: unknown): void => {
          const url = this._applications.find(({ id }) => id === _id)?.route
          if (url) {
            window.history.pushState(data, '', url)
          }
        },
      },
      setExtension: (key: keyof T, value: T[keyof T]) => {
        this.setExtension(key, value)
        return Object.freeze({ ...this._extensions })
      },
      shared: Object.freeze({ ...this._shared }),
    })
  }
}
