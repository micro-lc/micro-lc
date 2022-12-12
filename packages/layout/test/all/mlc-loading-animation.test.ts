import { elementUpdated, expect, fixture, html } from '@open-wc/testing'
import { LitElement } from 'lit'
// import { createSandbox } from 'sinon'

import type { MlcLoadingAnimation } from '../../src'

import '../../src/web-components/mlc-loading-animation'

class LoadableDiv extends LitElement {
  onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => unknown) | null = () => {
    this.onload?.call(window, new Event('load'))
  }
  connectedCallback(): void {
    super.connectedCallback()
  }
  protected render(): unknown {
    return html`<div>Content</div>`
  }
}

customElements.define('mlc-loadable-div', LoadableDiv)

describe('mlc-loading-animation', () => {
  it('should send configuration to micro-lc API with default values', async () => {
    // const sandbox = createSandbox()
    const el = await fixture<MlcLoadingAnimation>(html`
      <mlc-loading-animation primary-color="red">
        <mlc-loadable-div></mlc-loadable-div>
      </mlc-loading-animation>
    `)

    const loadable = el.querySelector('mlc-loadable-div') as HTMLElement
    expect(el.style.fill).to.equal('red')
    expect(el.shadowRoot?.querySelector('slot')?.assignedElements()).to.have.length(1)
    expect(loadable.style).to.have.property('display', 'none')

    loadable.click()
    expect(loadable.style).to.have.property('display', '')

    await elementUpdated(el)
    expect((el.shadowRoot?.firstElementChild as HTMLElement).style).to.have.property('display', 'none')
  })
})
