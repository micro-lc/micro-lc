import { registerMicroApps, start, setDefaultMountApp } from 'qiankun'

import type MicroLC from '../micro-lc'

import type { PartialObject } from './types'

export interface QiankunApi {
  registerMicroApps: typeof registerMicroApps
  setDefaultMountApp: typeof setDefaultMountApp
  start: typeof start
}

export function createQiankunInstance<T extends PartialObject>(
  this: MicroLC<T>
): QiankunApi {
  return {
    registerMicroApps,
    setDefaultMountApp,
    start,
  }
}
