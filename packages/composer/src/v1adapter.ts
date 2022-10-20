/*
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
import type { Component, Content, PluginConfiguration, ImportMap } from '@micro-lc/interfaces/v2'

/**
 * @deprecated will be removed on 1.0.0
 */
type V1Component = Record<string, unknown> & {
  type: 'element' | 'row' | 'column'
}

/**
 * @deprecated will be removed on 1.0.0

*/
export type V1Content = V1Component | V1Component[]

function toArray<T>(input: T | T[]): T[] {
  return Array.isArray(input) ? input : [input]
}

function parseSources(sources: Exclude<PluginConfiguration['sources'], undefined>): string[] {
  const arrayOrObject:
      | string[]
      | {importmap?: ImportMap | undefined; uris: string | string[]}
     = typeof sources === 'string' ? [sources] : sources
  return Array.isArray(arrayOrObject) ? arrayOrObject : toArray(arrayOrObject.uris)
}

/**
 * this function can be removed since it is idempotent on v2 configs
 * @param {V1Content} input raw json
 * @param {string[]} sources the uri list of assets to download
 * @returns {Component} the v2 plugin component
 * @deprecated will be removed on 1.0.0
 */
export function v1Adapter(input: V1Content | Content, sources: string[]): Content {
  // compatibility
  if (import.meta.env.MODE === 'development') {
    if (typeof input === 'string' || typeof input === 'number') {
      return input
    }

    if (Array.isArray(input)) {
      return input.map((content) => v1Adapter(content as V1Component, sources) as Component)
    }

    const { tag, type, url, attributes: inAttributes, content: inContent, properties, busDiscriminator } = input as V1Component

    typeof url === 'string' && sources.push(url)
    const attributes = (inAttributes ?? {}) as Record<string, string>
    const content = (inContent as V1Content | undefined) && v1Adapter(inContent as V1Content, sources)
    const extra: Partial<Component> = {}

    if (typeof busDiscriminator === 'string') {
      extra.properties = { eventBus: `eventBus.pool.${busDiscriminator}` }
      if (properties) {
        extra.properties = { ...extra.properties, ...properties } as Component['properties']
      }
    } else if (properties) {
      extra.properties = properties as Component['properties']
    }

    extra.tag = 'div'
    switch (type) {
    case 'row':
      extra.attributes = {
        ...attributes,
        style: `display: flex; flex-direction: column; ${attributes.style}`,
      }
      break
    case 'column':
      extra.attributes = {
        ...attributes,
        style: `display: flex; flex-direction: row; ${attributes.style}`,
      }
      break
    default:
      extra.tag = tag as string
      extra.attributes = attributes
      break
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return {
      content,
      ...(extra),
    }
  }

  return input as Content
}

/**
 * this function can be removed since it is idempotent on v2 configs
 * @param {PluginConfiguration} config incoming v2 config
 * @param {string[]} extraSources assets uri to add
 * @return {ResolvedConfig} the plugin config including adapted sources
 * @deprecated will be removed on 1.0.0
 */
export function v1AddSources(config: PluginConfiguration, extraSources: string[]): PluginConfiguration {
  if (import.meta.env.MODE === 'development') {
    let uris: string[] = []
    let importmap: ImportMap | undefined


    if (config.sources) {
      const { sources } = config

      uris = parseSources(sources)
      importmap = (!Array.isArray(sources) && typeof sources !== 'string')
        ? sources.importmap
        : undefined
    }

    return {
      content: config.content,
      sources: { importmap, uris: [...uris, ...extraSources] },
    }
  }

  return config
}
