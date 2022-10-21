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
import type { ErrorCodes } from '../logger'
import logger from '../logger'

import { toArray } from './array'

type FunctionToSubscribe = () => (void | Promise<void>)

class Subscription {
  private _closed = false
  private _promises: Promise<void>[] = []

  get closed(): boolean {
    return this._closed
  }

  add(functions: FunctionToSubscribe | FunctionToSubscribe[]): void {
    toArray(functions).reduce((acc, fn) => {
      if (!this._closed) {
        const result = fn() as undefined | Promise<void>
        const promise = result ?? Promise.resolve(result)
        acc.push(promise)
      }

      return acc
    }, this._promises)
  }

  unsubscribe() {
    Promise.all(this._promises).then(() => {
      this._closed = true
    }).catch((err: TypeError) => {
      logger.error('30' as ErrorCodes.LifecycleSubscriptionError, err.message)
    })
  }
}

export default Subscription
