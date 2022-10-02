import type { Config } from '@micro-lc/interfaces/v2'
import type { ErrorObject, JSONSchemaType, SchemaObject, ValidateFunction } from 'ajv'

import type { ErrorCodes } from '../logger'
import logger from '../logger'

import { toArray } from './array'

interface MultipleSchemas {
  id: string
  parts: SchemaObject[]
}

export type SchemaOptions = SchemaObject | MultipleSchemas

const acceptedTypes = [
  'application/json',
  'text/x-json',
]

function isSchemaOptions(input: SchemaOptions): input is MultipleSchemas {
  return Object.prototype.hasOwnProperty.call(input, 'id')
    && Object.prototype.hasOwnProperty.call(input, 'parts')
}

export async function jsonFetcher(url: string): Promise<unknown> {
  return fetch(
    new URL(url, window.document.baseURI),
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

export async function jsonToObject<T>(input: unknown, schema?: SchemaOptions): Promise<T> {
  // ⚠️ DO NOT collapse if statements here
  // This statements are separated to allow conditional compilation
  if (process.env.NODE_ENV === 'development') {
    if (schema) {
      return Promise.all([
        import('ajv'),
        import('ajv-formats'),
      ]).then(([
        { default: Ajv },
        { default: addFormats },
      ]) => {
        try {
          let schemas = toArray(schema) as SchemaObject[]
          // SAFETY: id will be defined either here or inside the next `if`
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          let id: string = (schema as SchemaObject).$id!
          if (isSchemaOptions(schema)) {
            schemas = schema.parts
            id = schema.id
          }
          const ajv = new Ajv({ schemas })
          addFormats(ajv)

          const validate = ajv
            .getSchema(id) as ValidateFunction<JSONSchemaType<Config>>

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
  }

  return Promise.resolve(input as T)
}

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
