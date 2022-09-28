import type { GlobalImportMap, ImportMap } from '@micro-lc/interfaces/v2'

export interface ImportMapTarget extends HTMLElement {
  disableShims: boolean
}

export class ImportMapRegistry extends Map<string, HTMLScriptElement> {
  private idx = new Set<string>()
  private _target: ImportMapTarget
  constructor(target: ImportMapTarget) {
    super()
    this._target = target
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

    const { _target: { ownerDocument, disableShims } } = this

    if (!this.idx.has(id)) {
      tag = assignContent(
        createImportMapTag(ownerDocument, disableShims), importmap
      )

      this.idx.add(id)
    } else {
      // SAFETY: idx and this are doubly linked due to the super.set below
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tag = this.get(id)!
    }

    tag.type = disableShims ? 'importmap' : 'importmap-shim'
    tag.textContent = JSON.stringify(importmap)
    !tag.isConnected && ownerDocument.head.appendChild(tag)

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
