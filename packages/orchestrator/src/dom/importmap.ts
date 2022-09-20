import type { GlobalImportMap, ImportMap } from '@micro-lc/interfaces'

import type MicroLC from '../micro-lc'

export interface ImportmapState {
  global?: GlobalImportMap
  map: Map<string, ImportMap>
}

const importmap: ImportmapState = {
  map: new Map(),
}

export function createImportMapTag(this: MicroLC, useShims = true): HTMLScriptElement {
  return Object.assign(
    this.ownerDocument.createElement('script'),
    {
      type: `importmap${useShims ? '-shim' : ''}`,
    }
  )
}

export function addGlobalImports(this: MicroLC, globalImportMap: GlobalImportMap): void {
  importmap.global = globalImportMap
  this.importmap && (this.importmap.textContent = JSON.stringify(globalImportMap))
}

export function appendImportMapTag(this: MicroLC): void {
  this.importmap
    && !this.importmap.isConnected
    && this.ownerDocument.head.appendChild(this.importmap)
}

export function setImportMap(
  id: string,
  nextImportmap: GlobalImportMap,
) {
  importmap.map.set(id, nextImportmap)
}

export function applyImportMap(this: MicroLC, id: string) {
  const appImportMap = importmap.map.get(id) ?? {}
  if (this.importmap) {
    this.importmap.textContent = JSON.stringify({
      imports: {
        ...appImportMap.imports,
        ...importmap.global?.imports,
      },
      scopes: {
        ...appImportMap.scopes,
        ...importmap.global?.scopes,
      },
    } as ImportMap)
  }
}
