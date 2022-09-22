import { registerMicroApps, start, setDefaultMountApp } from 'qiankun'

import type { SchemaOptions } from '../utils/json'

import type { BaseExtension } from './extensions'
import type MicroLC from './micro-lc'

export interface QiankunApi {
  registerMicroApps: typeof registerMicroApps
  schema?: SchemaOptions
  setDefaultMountApp: typeof setDefaultMountApp
  start: typeof start
}

export function createQiankunInstance<T extends BaseExtension>(
  this: MicroLC<T>
): QiankunApi {
  return {
    registerMicroApps,
    setDefaultMountApp,
    start,
  }
}
