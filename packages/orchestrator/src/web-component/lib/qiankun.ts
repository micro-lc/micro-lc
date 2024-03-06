/**
  Copyright 2022 Mia srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import { loadMicroApp } from 'qiankun'
import type { MicroApp as QiankunMicroApp } from 'qiankun'

import type { ErrorCodes } from '../../logger'
import logger from '../../logger/index.js'
import type { SchemaOptions } from '../../utils/json'

export type { QiankunMicroApp }

export type LoadedAppUpdate = ((customProps: Record<string, unknown>) => Promise<null>) | undefined

export type MicroApp = QiankunMicroApp & {
  route: string
}

export interface QiankunApi {
  loadMicroApp: typeof loadMicroApp<Record<string, unknown>>
  schema?: SchemaOptions
}

export function updateErrorHandler(app: string, err: TypeError): void {
  logger.error('50' as ErrorCodes.UpdateError, app, err.message)
}

export function createQiankunInstance(): QiankunApi {
  return {
    loadMicroApp,
  }
}
