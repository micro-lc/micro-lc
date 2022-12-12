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
import type { ErrorCodes } from './logger'

const isString = (value: string): boolean => {
  const i = value.charAt(0)

  if (i !== value.charAt(value.length - 1) || (i !== '\'' && i !== '"')) {
    return false
  }

  return true
}

export function compile<T extends Record<string, unknown>>(input: string): (context: T) => unknown {
  // SAFETY: a string will always match on the given regex
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const res = input.match(/([^.]+)/g)!
  return (context: T) =>
    res.reduce<unknown>((acc, value) => {
      let caller: string | number = value

      if (value.startsWith('[') && value.endsWith(']')) {
        const v1 = value.slice(1, -1)
        const index = Number.parseInt(v1)

        if (!Number.isNaN(index) && index.toString() === v1) {
          caller = index
        } else if (
          (v1.startsWith('"') && v1.endsWith('"'))
              || (v1.startsWith('\'') && v1.endsWith('\''))
        ) {
          caller = v1.slice(1, -1)
        }
      }

      if (caller === '') {
        throw new TypeError('42' as ErrorCodes.InterpolationContextError, { cause: input })
      }

      return (typeof acc === 'object' && acc !== null)
        ? (acc as T)[caller]
        : undefined
    }, context)
}

export function interpolate(variables: string[], extra: Record<string, unknown> = {}): unknown[] {
  return variables.reduce<unknown[]>((acc, variable, i) => {
    const trimmed = variable.trim()
    const ni = Number.parseInt(trimmed)
    const nf = Number.parseFloat(trimmed)
    if (trimmed === '') {
      acc[i] = trimmed
    } else if (isString(trimmed)) {
      acc[i] = trimmed.slice(1, -1)
    } else if (['true', 'false'].includes(trimmed)) {
      acc[i] = trimmed === 'true'
    } else if (!Number.isNaN(ni) && ni.toString() === trimmed) {
      acc[i] = ni
    } else if (!Number.isNaN(nf) && nf.toString() === trimmed) {
      acc[i] = nf
    } else if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        acc[i] = JSON.parse(trimmed)
      } catch (err: SyntaxError | unknown) {
        if (err instanceof SyntaxError) {
          throw new TypeError('43' as ErrorCodes.InterpolationJSONError, { cause: err.message })
        }
      }
    } else {
      acc[i] = compile(trimmed)(extra)
    }

    return acc
  }, [])
}
