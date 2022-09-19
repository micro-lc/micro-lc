import type { Config } from '@micro-lc/interfaces'
import { expect, waitUntil } from '@open-wc/testing'

import MicroLC from '../src/micro-lc'

describe('micro-lc config tests', () => {
  before(() => {
    customElements.define('micro-lc', MicroLC)
  })

  afterEach(() => {
    for (const child of document.body.children) {
      child.remove()
    }
  })

  it(`should add css to micro-lc tag inside shadow-dom when active`, async () => {
    const config: Config = {
      css: {
        global: {
          'font-family': 'Arial, Helvetica, sans-serif',
          'primary-color': '#873232',
        },
        nodes: {
          '.my-css-class': {
            color: 'var(--micro-lc-primary-color)',
            'font-family': 'var(--micro-lc-font-family)',
          },
        },
      },
      layout: {
        content: {
          attributes: {
            class: 'my-css-class',
          },
          content: [
            'Hello, World!',
            {
              tag: 'slot',
            },
          ],
          tag: 'div',
        },
      },
      version: 2,
    }

    // TEST
    // 1. append micro-lc
    const microlc = document.createElement('micro-lc') as MicroLC
    document.body.appendChild(
      Object.assign(microlc, { config })
    )

    // 2. await for config setup
    await waitUntil(() => microlc.updateCompleted)

    // 3. check whether css is properly mounted
    const [nodes, global] = microlc.shadowRoot?.querySelectorAll('style') ?? []
    expect(nodes.outerHTML.replace(/\s/g, '')).to.eql(`
      <style>
        .my-css-class {
          color: var(--micro-lc-primary-color);
          font-family: var(--micro-lc-font-family);
        }
      </style>
    `.replace(/\s/g, ''))
    expect(global.outerHTML.replace(/\s/g, '')).to.eql(`
      <style>
        :host {
          --micro-lc-font-family: Arial, Helvetica, sans-serif;
          --micro-lc-primary-color: #873232;
        }
      </style>
    `.replace(/\s/g, ''))

    // SAFETY: must have been created by layout config parsing
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const computedStyle = window.getComputedStyle(microlc.renderRoot.querySelector('div')!)
    expect(computedStyle).to.have.property('color', 'rgb(135, 50, 50)')
    expect(computedStyle).to.have.property('fontFamily', 'Arial, Helvetica, sans-serif')
    //
  })

  it(`should add css to micro-lc tag on head when shadow-dom is not active`, async () => {
    const config: Config = {
      css: {
        global: {
          'font-family': 'Arial, Helvetica, sans-serif',
          'primary-color': '#873232',
        },
      },
      version: 2,
    }

    // TEST
    // 1. append micro-lc
    const microlc = document.createElement('micro-lc') as MicroLC
    microlc.setAttribute('disable-shadow-dom', '')
    document.body.appendChild(
      Object.assign(microlc, { config })
    )

    await waitUntil(() => microlc.updateCompleted)

    // 2. check whether css is properly mounted
    const [global] = document.head.querySelectorAll('style')
    expect(global.outerHTML.replace(/\s/g, '')).to.equal(`
      <style>
        :root {
          --micro-lc-font-family: Arial, Helvetica, sans-serif;
          --micro-lc-primary-color: #873232;
        }
      </style>
    `.replace(/\s/g, ''))

    // CLEANUP
    global.remove()
  })
})
