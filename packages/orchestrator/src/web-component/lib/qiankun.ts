import { start, setDefaultMountApp, loadMicroApp } from 'qiankun'
import type { MicroApp as QiankunMicroApp } from 'qiankun'

import type { ErrorCodes } from '../../logger'
import logger from '../../logger'
import type { SchemaOptions } from '../../utils/json'

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

export function updateErrorHandler(app: string, err: TypeError): void {
  logger.error('50' as ErrorCodes.UpdateError, app, err.message)
}

export function createQiankunInstance(): QiankunApi {
  return {
    loadMicroApp,
    setDefaultMountApp,
    start,
  }
}
