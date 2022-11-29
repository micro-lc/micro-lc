import { ReplaySubject } from 'rxjs'

export class Bus<T = unknown> extends ReplaySubject<T> {}

export interface BusPool<T = unknown> extends Bus<T> {
  [index: number]: Bus<T>
  pool: Record<string, Bus<T>>
}

export function createPool<T = unknown>(): BusPool<T> {
  const array: Bus<T>[] = []

  const pool = new Proxy<Record<string, Bus<T>>>({}, {
    get(target, property, receiver) {
      if (typeof property === 'string' && !Object.prototype.hasOwnProperty.call(target, property)) {
        target[property] = new Bus<T>()
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Reflect.get(target, property, receiver)
    },
  })

  return new Proxy(new Bus() as BusPool<T>, {
    get(target, property, receiver) {
      if (property === 'pool') {
        return pool
      }

      const idx = typeof property === 'string' ? Number.parseInt(property, 10) : Number.NaN
      if (!Number.isNaN(idx)) {
        if (array.at(idx) === undefined) {
          array[idx] = new Bus<T>()
        }
        return array[idx]
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Reflect.get(target, property, receiver)
    },
  })
}
