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

const jsonAcceptedTypes = [
  'application/json',
  'text/x-json',
]
const yamlAcceptedTypes = [
  'application/yaml',
  'application/x-yaml',
  'text/yaml',
]

const acceptedTypes = [
  ...jsonAcceptedTypes,
  ...yamlAcceptedTypes,
]

function isSchemaOptions(input: SchemaOptions): input is MultipleSchemas {
  return Object.prototype.hasOwnProperty.call(input, 'id')
    && Object.prototype.hasOwnProperty.call(input, 'parts')
}

export async function jsonFetcher(url: string, init?: RequestInit): Promise<unknown> {
  return fetch(
    new URL(url, window.document.baseURI),
    {
      ...init,
      headers: {
        ...init?.headers,
        Accept: acceptedTypes.join(', '),
      },
    })
    .then((res) => {
      const contentType = res.headers.get('Content-Type') ?? ''
      const isJson = jsonAcceptedTypes.reduce(
        (accepted, str) => contentType.includes(str) || accepted, false
      )
      const isYaml = yamlAcceptedTypes.reduce(
        (accepted, str) => contentType.includes(str) || accepted, false
      )

      if (res.ok && isJson) {
        return res.json() as Promise<unknown>
      }

      if (res.ok && isYaml) {
        return Promise.all([import('js-yaml'), res.text()])
          .then(([{ default: yaml }, data]) => {
            return yaml.load(data, { json: true, schema: yaml.JSON_SCHEMA })
          })
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
