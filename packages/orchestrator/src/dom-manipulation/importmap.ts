import type { GlobalImportMap, ImportMap } from '@micro-lc/interfaces'

import type { BaseExtension } from '../web-component'
import type Microlc from '../web-component'

export class ImportMapRegistry<T extends BaseExtension> extends Map<string, HTMLScriptElement> {
  private idx = new Set<string>()
  private _microlc: Microlc<T>
  constructor(microlc: Microlc<T>) {
    super()
    this._microlc = microlc
  }

  remove(id: string): void {
    this.get(id)?.remove()
    this.idx.delete(id)
  }

  removeAll(): void {
    for (const id of this.idx.keys()) {
      this.remove(id)
    }
  }

  createSetMount(id: string, importmap: ImportMap | GlobalImportMap): this {
    let tag: HTMLScriptElement

    if (!this.idx.has(id)) {
      tag = assignContent(createImportMapTag(this._microlc.ownerDocument, this._microlc.disableShims), importmap)
      console.log('tag', tag)
      this.idx.add(id)
    } else {
      // SAFETY: idx and this are doubly linked due to the super.set below
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
