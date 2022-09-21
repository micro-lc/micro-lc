import type { BaseExtension } from '../apis'
import type { CompleteConfig } from '../config'
import type MicroLC from '../micro-lc'

export function appendMountPoint<T extends BaseExtension>(
  this: MicroLC<T>,
  pluginMountPointSelector: CompleteConfig['settings']['pluginMountPointSelector']
): string | HTMLElement {
  let mountPoint: string | HTMLElement = pluginMountPointSelector.id
  if (this.isShadowDom()) {
    const { id, slot } = typeof pluginMountPointSelector === 'object'
      ? pluginMountPointSelector
      : { id: pluginMountPointSelector, slot: undefined }
    mountPoint = this.mountPoint instanceof HTMLElement
      ? this.mountPoint
      : this.ownerDocument.createElement('div')
    mountPoint.setAttribute('id', id)
    slot && mountPoint.setAttribute('slot', slot)

    !mountPoint.isConnected && this.appendChild(mountPoint)
  }

  return mountPoint
}
