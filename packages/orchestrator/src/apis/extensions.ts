import type { SchemaOptions } from '../utils/json'
import { jsonFetcher, jsonToObject, jsonToObjectCatcher } from '../utils/json'

import type { Microlc } from './micro-lc'

type HTTPClient = Record<string, unknown>

interface JsonCatcherOptions<S> {
  defaultValue?: S
  file?: string
}

export type BaseExtension = Record<string, unknown> & {
  httpClient: HTTPClient
  json: {
    fetcher: typeof jsonFetcher
    validator: <S>(json: unknown, schema: SchemaOptions, opts?: JsonCatcherOptions<S>) => Promise<S>
  }
}

export function initBaseExtensions<T extends BaseExtension>(this: Microlc<T>): T {
  return {
    // TODO
    httpClient: {},
    json: {
      fetcher: jsonFetcher,
      async validator<S>(
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
    },
  } as T
}
