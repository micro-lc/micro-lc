import type { Config } from '@micro-lc/interfaces'
import type { ErrorObject, JSONSchemaType, ValidateFunction } from 'ajv'

import type { ErrorCodes } from '../logger'
import logger from '../logger'

export function invalidJsonCatcher<T>(err: TypeError | unknown, data: T, file?: string): T {
  if (process.env.NODE_ENV === 'development' && err instanceof TypeError) {
    if (err.message === '20' as ErrorCodes.InvalidJSONError) {
      logger.error(err.message, file ?? '"unknown"')
    } else {
      logger.error('1' as ErrorCodes.FetchError, err.message)
    }
  }

  return data
}

const acceptedTypes = [
  'application/json',
  'text/x-json',
]

export async function jsonFetcher(url: string): Promise<unknown> {
  return fetch(
    new URL(url, window.location.origin),
    {
      headers: {
        Accept: acceptedTypes.join(', '),
      },
    })
    .then((res) => {
      const contentType = res.headers.get('Content-Type') ?? ''
      const isJson = acceptedTypes.reduce(
        (accepted, str) => contentType.includes(str) || accepted, false
      )

      if (res.ok && isJson) {
        return res.json() as Promise<unknown>
      }

      return Promise.reject(new TypeError('20' as ErrorCodes.InvalidJSONError))
    })
}

export async function jsonToObject<T>(input: unknown, type: 'schema' | 'plugin' = 'schema'): Promise<T> {
  if (process.env.NODE_ENV === 'development') {
    return Promise.all([
      import('ajv'),
      import('ajv-formats'),
      import('./schemas'),
    ]).then(([
      { default: Ajv },
      { default: addFormats },
      { configSchema, pluginSchema, htmlTagSchema },
    ]) => {
      console.log(Ajv)
      try {
        const ajv = new Ajv({ schemas: [configSchema, pluginSchema, htmlTagSchema] })
        addFormats(ajv)

        const validate = ajv.getSchema(
          type === 'schema' ? configSchema.$id : pluginSchema.$id
        ) as ValidateFunction<JSONSchemaType<Config>>

        validate(input)

        const { errors: cause } = validate

        if (cause) {
          return Promise.reject(new TypeError('21' as ErrorCodes.JSONValidationError, { cause }))
        }
      } catch (err: unknown) {
        return Promise.reject(new TypeError('22' as ErrorCodes.JSONSchemaError, { cause: (err as TypeError).message }))
      }

      return Promise.resolve(input as T)
    })
  }
  return Promise.resolve(input as T)
}

export function jsonToObjectCatcher<T>(err: TypeError | undefined, data: T, file?: string): T {
  if (process.env.NODE_ENV === 'development' && err instanceof TypeError) {
    const handledCodes = ['21', '22'] as [ErrorCodes.JSONValidationError, ErrorCodes.JSONSchemaError]
    if ((handledCodes as string[]).includes(err.message)) {
      logger.error(err.message, file ?? '"unknown"', (err.cause as null | ErrorObject) ? JSON.stringify(err.cause) : 'null')
    } else {
      logger.error(err.message)
    }
  }

  return data
}
