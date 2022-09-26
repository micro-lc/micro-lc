import type { GlobalImportMap, ImportMap } from '@micro-lc/interfaces'

import type { BaseExtension } from '../apis'
import type Microlc from '../apis'

export class ImportMapRegistry<T extends BaseExtension> extends Map<string, HTMLScriptElement> {
  static idx = new Set<string>()

  private _microlc: Microlc<T>
  constructor(microlc: Microlc<T>) {
    super()
    this._microlc = microlc
  }

  remove(id: string): void {
    this.get(id)?.remove()
    ImportMapRegistry.idx.delete(id)
  }

  removeAll(): void {
    for (const id of ImportMapRegistry.idx.keys()) {
      this.remove(id)
    }
  }

  createSetMount(id: string, importmap: ImportMap | GlobalImportMap): this {
    let tag: HTMLScriptElement

    if (!ImportMapRegistry.idx.has(id)) {
      tag = assignContent(createImportMapTag(this._microlc.ownerDocument, this._microlc.disableShims), importmap)
      console.log('tag', tag)
      ImportMapRegistry.idx.add(id)
    } else {
      tag = this.get(id)!
    }

    tag.textContent = JSON.stringify(importmap)
    !tag.isConnected && this._microlc.ownerDocument.head.appendChild(tag)

    super.set(id, tag)

    return this
  }

  getImportmap(id: string): ImportMap | undefined {
    const textContent = this.get(id)?.textContent
    if (typeof textContent === 'string' && textContent !== '') {
      return JSON.parse(textContent) as ImportMap
    }
  }
}

export function assignContent(tag: HTMLScriptElement, importmap: ImportMap | GlobalImportMap): HTMLScriptElement {
  return Object.assign(tag, { textContent: JSON.stringify(importmap) })
}

export function createImportMapTag(
  document: Document, disableShims = false
): HTMLScriptElement {
  return Object.assign(
    document.createElement('script'), {
      textContent: '{}',
      type: disableShims ? 'importmap' : 'importmap-shim',
    }
  )
}
