import type MicroLC from '../apis'
import type { SchemaOptions } from '../utils/json'
import { jsonToObject, jsonToObjectCatcher } from '../utils/json'

type HTTPClient = Record<string, unknown>

interface JsonCatcherOptions<S> {
  defaultValue?: S
  file?: string
}

export type BaseExtension = Record<string, unknown> & {
  httpClient: HTTPClient
  jsonValidator: <S>(json: unknown, schema: SchemaOptions, opts?: JsonCatcherOptions<S>) => Promise<S>
}

export function initBaseExtensions<T extends BaseExtension>(this: MicroLC<T>): T {
  return {
    // TODO
    httpClient: {},
    async jsonValidator<S>(
      json: unknown,
      schema: SchemaOptions,
      {
        defaultValue = json as S,
        file,
      }: JsonCatcherOptions<S> = {}
    ) {
      return jsonToObject(json, schema)
        .catch((err: TypeError) =>
          jsonToObjectCatcher<S>(err, defaultValue, file)
        )
    },
  } as T
}
