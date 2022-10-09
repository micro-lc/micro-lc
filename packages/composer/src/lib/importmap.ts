import type { PluginConfiguration, ImportMap } from '@micro-lc/interfaces/v2'

import { toArray } from './to-array'

export function parseSources(sources: Exclude<PluginConfiguration['sources'], undefined>): string[] {
  const arrayOrObject:
      | string[]
      | {importmap?: ImportMap | undefined; uris: string | string[]}
     = typeof sources === 'string' ? [sources] : sources
  return Array.isArray(arrayOrObject) ? arrayOrObject : toArray(arrayOrObject.uris)
}
