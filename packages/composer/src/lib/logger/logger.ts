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
import type { ErrorCodes, ErrorHandler } from './errors.js'

const error = (message: ErrorCodes | string, ...args: string[]) => {
  import('./errors.js').then(({ default: errorMap }) => {
    const handler = errorMap[message as ErrorCodes] as ErrorHandler | undefined
    handler
      ? console.error(handler(...args))
      : console.error(...args)
  }).catch((err: TypeError) => {
    console.error(
      `[micro-lc][composer]: Dynamic import error while importing logger utils - ${err.message}`
    )
  })
}

const dynamicImportError = (name: string): (err: TypeError) => void =>
  (err: TypeError) => {
    error('0' as ErrorCodes.DynamicImportError, name, err.message)
  }

export const logger = {
  dynamicImportError,
  error,
}
