import type { Schema } from 'ajv'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import axios from 'axios'

import type { Config as V1 } from '../types/v1/index'
import type { Config as V2 } from '../types/v2/index'

import type { IntakeOptions, Latest, Version } from './types'
import { toArray } from './utils'

export const supportedVersions: Version[] = ['v1', 'v2']

const client = axios.create({ headers: { 'Cache-Control': 'no-cache', Expires: '0', Pragma: 'no-cache' } })

const cache = new Map<Version, Schema[]>()

const schemaUrls: Record<Version, string | string[]> = {
  v1: 'https://raw.githubusercontent.com/epessina/interfaces/config/schemas/v1/config-schema.json',
  v2: [
    'https://raw.githubusercontent.com/epessina/interfaces/config/schemas/v2/config-schema.json',
    'https://raw.githubusercontent.com/epessina/interfaces/config/schemas/v2/plugin-schema.json',
    'https://raw.githubusercontent.com/epessina/interfaces/config/schemas/v2/html-tags-schema.json',
  ],
}

const setup = (versions: Version[]): Map<Version, Promise<Schema[]>> => {
  return versions.reduce((map, version) => {
    // SAFETY: versions are certainly available here
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const getFromCachePromise = Promise.resolve(cache.get(version)!)

    const getFromUrlPromise = Promise
      .all(toArray(schemaUrls[version]).map(url => client.get(url).then(({ data }) => data as Schema)))
      .then((schemas) => schemas)

    map.set(version, cache.has(version) ? getFromCachePromise : getFromUrlPromise)

    return map
  }, new Map<Version, Promise<Schema[]>>())
}

export function one2two(_: V1): V2 {
  return {
    $schema: schemaUrls.v2[0],
    version: 2,
  }
}

export async function intake(input: string | Buffer, path: string, opts: IntakeOptions = {}): Promise<V1 | V2 | Latest> {
  const latest = 'v2'

  const { version = 1, ...json } = JSON.parse(input.toString()) as { version?: number }
  const inputVersion = `v${version}` as Version

  if (!supportedVersions.includes(inputVersion)) { throw new TypeError(`${version} should an integer larger than 0`) }

  if (inputVersion === latest) { return { version, ...json } }

  const to = opts.to ?? latest
  if (inputVersion === to) { return { version, ...json } }

  const schemas = setup([inputVersion, to])
  // SAFETY: versions are certainly available here
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const schema = await schemas.get(inputVersion)!

  const [main, ...rest] = schema

  const ajv = addFormats(new Ajv())
  ajv.addSchema(rest)

  const validate = ajv.compile(main)

  if (!validate(json)) { throw new TypeError(JSON.stringify(validate.errors)) }

  switch ([inputVersion, to].join('')) {
  case 'v1v2':
  default: return one2two(json)
  }
}
