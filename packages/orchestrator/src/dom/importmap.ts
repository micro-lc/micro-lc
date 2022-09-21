import type { GlobalImportMap, ImportMap } from '@micro-lc/interfaces'

import type { BaseExtension } from '../apis'
import type MicroLC from '../micro-lc'

// export interface ImportmapState {
//   global?: GlobalImportMap
//   map: SideEffectMap
//   tags: Map<string, HTMLScriptElement>
// }

// const importmap: ImportmapState = {
//   map: new SideEffectMap(),
//   tags: new Map(),
// }

export class SideEffectMap<T extends BaseExtension> extends Map<string, ImportMap | GlobalImportMap> {
  static idx = new Set<string>()

  private _microlc: MicroLC<T>
  constructor(microlc: MicroLC<T>) {
    super()
    this._microlc = microlc
  }

  set(id: string, importmap: ImportMap | GlobalImportMap): this {
    if (!SideEffectMap.idx.has(id)) {
      const tag = assignContent(createImportMapTag
        .call<MicroLC<T>, [], HTMLScriptElement>(this._microlc), importmap)
      appendImportMapTag
        .call<MicroLC<T>, [HTMLScriptElement], void>(this._microlc, tag)

      SideEffectMap.idx.add(id)
      super.set(id, importmap)
    }

    return this
  }
}

export function assignContent(tag: HTMLScriptElement, importmap: ImportMap | GlobalImportMap): HTMLScriptElement {
  return Object.assign(tag, { textContent: JSON.stringify(importmap) })
}

export function createImportMapTag<T extends BaseExtension>(
  this: MicroLC<T>, useShims = true
): HTMLScriptElement {
  return Object.assign(
    this.ownerDocument.createElement('script'),
    {
      type: `importmap${useShims ? '-shim' : ''}`,
    }
  )
}

export function appendImportMapTag<T extends BaseExtension>(this: MicroLC<T>, tag: HTMLScriptElement | null = this.importmap): void {
  tag && this.ownerDocument.head.appendChild(tag)
}
