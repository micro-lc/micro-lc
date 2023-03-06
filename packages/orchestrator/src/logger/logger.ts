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
import type { ErrorCodes, ErrorHandler } from './errors'
import errorMap from './errors'

export function error(message: ErrorCodes | string, ...args: string[]) {
  if (process.env.NODE_ENV === 'development') {
    const handler = errorMap[message as ErrorCodes] as ErrorHandler | undefined
    handler
      ? console.error(handler(...args))
      : console.error(...args)
  }
}

export function dynamicImportError(name: string): (err: TypeError) => void {
  return (err: TypeError) => {
    error('0' as ErrorCodes.DynamicImportError, name, err.message)
  }
}
