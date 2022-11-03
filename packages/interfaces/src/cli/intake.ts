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
import type { Schema } from 'ajv'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import axios from 'axios'

import type { Config as V1 } from '../../schemas/v1'
import type { Config as V2 } from '../../schemas/v2'

import { toArray } from './utils'

export type Latest = V2

export type Mode = 'config' | 'compose'
export type Version = 'v1' | 'v2'

export interface IntakeOptions {
  from?: Version
  mode?: Mode
  to?: Version
}

export interface Context extends IntakeOptions{
  console: boolean
  files: string[]
}
export const supportedVersions: Version[] = ['v1', 'v2']
export const modes: Mode[] = ['config', 'compose']

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export function one2two(input: V1): V2 {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    plugins = [],
  } = input
}

export async function intake(input: string | Buffer, _: string, { from, to }: Required<IntakeOptions>): Promise<V1 | V2 | Latest> {
  const latest: Version = 'v2'

  const { version = from, ...json } = JSON.parse(input.toString()) as { version?: number }
  const inputVersion = `v${version}` as Version

  if (!supportedVersions.includes(inputVersion)) {
    throw new TypeError(`${version} should be one of ${['1', '2'].join(', ')}`)
  }

  if (inputVersion === latest) { return { version, ...json } }
  if (inputVersion === to) { return { version, ...json } }

  const schemas = setup([inputVersion, to])
  // SAFETY: versions are certainly available here since schema is
  // not given away as a reference anywhere else
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
