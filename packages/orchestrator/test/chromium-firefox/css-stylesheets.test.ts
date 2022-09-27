import { expect, chai } from '@open-wc/testing'
import chaiString from 'chai-string'

import type { CSSConfig } from '../../src/dom-manipulation'
import { createCSSStyleSheets } from '../../src/dom-manipulation'

chai.use(chaiString)

describe('`adoptedStyleSheets` only => css manipulation tests', () => {
  it(`should create a global stylesheet according with shadow-dom being enabled;
      while transforming it must also remove non-standard CSS properties`, () => {
    const cssInJss: CSSConfig = {
      global: {
        '--micro-lc-global-variable': '#1725aa',
        'background-color': 'blue',
        backgroundColor: 'blue',
        unknownProperty: 'unknowValue',
      },
    }

    const stylesheets = createCSSStyleSheets(cssInJss)

    expect(stylesheets).to.have.lengthOf(1)

    const [globalStylesheet] = stylesheets
    expect(globalStylesheet.cssRules).to.have.lengthOf(1)

    const [node] = globalStylesheet.cssRules
    expect(node.cssText).to.equalIgnoreSpaces(`
      :host {
        --micro-lc-global-variable: #1725aa;
        background-color: blue;
      }
    `)
  })

  it(`should create multiple stylesheets according
      with shadow-dom being enabled`, () => {
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

    const stylesheets = createCSSStyleSheets(cssInJss)

    expect(stylesheets).to.have.lengthOf(2)

    const [nodesStylesheet, globalStylesheet] = stylesheets

    expect(nodesStylesheet.cssRules).to.have.lengthOf(2)
    const [node1, node2] = nodesStylesheet.cssRules
    expect(node1.cssText).to.equalIgnoreSpaces(`
      :host {
        --another-var: 25px;
      }
    `)
    expect(node2.cssText).to.equalIgnoreSpaces(`
      .container .center {
        display: flex;
      }
    `)

    expect(globalStylesheet.cssRules).to.have.lengthOf(1)

    const [node] = globalStylesheet.cssRules
    expect(node.cssText).to.equalIgnoreSpaces(`
      :host {
        --micro-lc-global-variable: #1725aa;
        background-color: blue;
      }
    `)
  })
})
