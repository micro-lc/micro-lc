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
