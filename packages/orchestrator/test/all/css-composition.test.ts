import { expect, chai } from '@open-wc/testing'
import chaiString from 'chai-string'

import type { CSSConfig } from '../../src/dom-manipulation'
import { injectStyleToElements } from '../../src/dom-manipulation'

chai.use(chaiString)

describe('css manipulation tests', () => {
  it(`when shadow dom is not enabled, or when 'adoptedStyleSheets' are not available,
      should fill up provided html style tags; shadow root selector can be toggled`, () => {
    const cssInJss: CSSConfig = {
      global: {
        '--micro-lc-global-variable': '#1725aa',
        'background-color': 'blue',
      },
      nodes: {
        '.container .center': {
          display: 'flex',
        },
        ':host': {
          '--another-var': '25px',
        },
      },
    }

    const elements = Array(2).fill(0).map(() =>
      document.createElement('style')) as [HTMLStyleElement, HTMLStyleElement]

    injectStyleToElements(cssInJss, elements, true)

    const [global, nodes] = elements

    expect(global.textContent).to.equalIgnoreSpaces(`
      :host {
        --micro-lc-global-variable: #1725aa;
        background-color: blue;
      }
    `)
    expect(nodes.textContent).to.equalIgnoreSpaces(`
      .container .center {
        display: flex;
      }
      :host {
        --another-var: 25px;
      }
    `)

    injectStyleToElements(cssInJss, elements, false)

    expect(global.textContent).to.equalIgnoreSpaces(`
      :root {
        --micro-lc-global-variable: #1725aa;
        background-color: blue;
      }
    `)
    expect(nodes.textContent).to.equalIgnoreSpaces(`
      .container .center {
        display: flex;
      }
      :host {
        --another-var: 25px;
      }
    `)
  })
})
