import { start, setDefaultMountApp, loadMicroApp } from 'qiankun'
import type { MicroApp as QiankunMicroApp } from 'qiankun'

import type { SchemaOptions } from '../utils/json'

export type { QiankunMicroApp }

export type MicroApp = QiankunMicroApp & {
  route: string
}

export interface QiankunApi {
  loadMicroApp: typeof loadMicroApp
  schema?: SchemaOptions
  setDefaultMountApp: typeof setDefaultMountApp
  start: typeof start
}

export function createQiankunInstance(): QiankunApi {
  return {
    loadMicroApp,
    setDefaultMountApp,
    start,
  }
}
