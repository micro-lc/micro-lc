import { registerMicroApps, start, setDefaultMountApp } from 'qiankun'

import type MicroLC from '../micro-lc'

import type { BaseExtension } from './types'

export interface QiankunApi {
  registerMicroApps: typeof registerMicroApps
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
