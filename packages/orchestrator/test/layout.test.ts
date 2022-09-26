import type { Config } from '@micro-lc/interfaces'
import { expect, waitUntil } from '@open-wc/testing'
import { createSandbox } from 'sinon'

import type { ExtendedHTMLElement } from '../src/composer'
import type { MicrolcApi, BaseExtension } from '../src/web-component'
import MicroLC from '../src/web-component'

type MicrolcApiExtended = ExtendedHTMLElement<{microlcApi: MicrolcApi<BaseExtension>}>

describe('micro-lc config tests', () => {
  before(() => {
    customElements.define('micro-lc', MicroLC)
  })

  afterEach(() => {
    for (const child of document.body.children) {
      child.remove()
    }
  })

  it('should receive attribute input and merge config', async () => {
    const sandbox = createSandbox()

    // TEST
    // 1. append micro-lc
    const microlc = document.createElement('micro-lc') as MicroLC
    document.body.appendChild(
      Object.assign(microlc, { config: {
        layout: {
          content: [
            { booleanAttributes: 'hidden', content: 'Layout', properties: { prop: 'a' }, tag: 'div' },
            { attributes: { name: 'container' }, tag: 'slot' },
          ],
        },
        settings: { pluginMountPointSelector: { id: 'ROOT', slot: 'container' } },
        version: 2,
      } as Config })
    )
    // 2. await for config fetch
    await waitUntil(() => microlc.updateComplete)
    expect(microlc.shadowRoot.innerHTML.replace(/\s/g, '')).to.equal(`
      <!---->
      <div hidden="">Layout</div>
      <slot name="container"></slot>
    `.replace(/\s/g, ''))
    const [div, slot] = Array.prototype.slice.call(microlc.shadowRoot.children) as HTMLElement[]

    // div is properly injected
    expect(div).to.have.property('microlcApi')
    expect(div).to.have.property('prop', 'a')
    expect((div as MicrolcApiExtended).microlcApi.getApplications()).to.have.lengthOf(0)

    // mount point is attached to the slot
    expect((slot as HTMLSlotElement).assignedElements()).to.have.lengthOf(1)

    sandbox.restore()
  })
})
