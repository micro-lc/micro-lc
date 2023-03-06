import type { ElementHandle, JSHandle } from '@playwright/test'
import test, { expect } from '@playwright/test'

import type { CSSConfig } from '../packages/orchestrator/src/dom-manipulation/css'
import type Microlc from '../packages/orchestrator/src/web-component'

import { goto } from './complete-config'

test.describe('css manipulation tests', () => {
  test(`
    [css]
    when shadow dom is not enabled, or when 'adoptedStyleSheets' are not available,
    should fill up provided html style tags; shadow root selector can be toggled
  `, async ({ page }) => {
    await goto(page, {
      applications: { home: { config: { content: '' }, integrationMode: 'compose', route: '/home' } },
      layout: {
        content: {
          attributes: {
            class: 'container center',
            id: 'my-div',
            style: 'color: var(--micro-lc-global-variable); border-radius: var(--another-var);',
          },
          content: 'Hello',
          tag: 'div',
        },
      },
      settings: { defaultUrl: '/home' },
      version: 2,
    })

    const windowHandle = await page.evaluateHandle<Window>('window')
    const microlcHandle = await page.evaluateHandle<Microlc>('document.querySelector(\'micro-lc\')')

    const cssInJss = {
      global: {
        '--micro-lc-global-variable': 'rgb(23, 37, 170)',
      },
      nodes: {
        '.container.center': {
          display: 'flex',
        },
        ':host': {
          '--another-var': '25px',
        },
      },
    }

    // await page.evaluate((microlc, css) => microlc.get, microlcHandle)
    await page.evaluate(
      ([microlc, css]) => microlc.getApi().getExtensions().css?.setStyle(css),
      [microlcHandle, cssInJss] as [ElementHandle<Microlc>, CSSConfig]
    )

    await page.waitForFunction(
      (microlc) => microlc.shadowRoot?.querySelector('div#my-div') !== null,
      microlcHandle
    )

    const color = await page.evaluate(
      ([microlc, window]) => (window.getComputedStyle(microlc.shadowRoot?.querySelector('div#my-div') as Element).color),
      [microlcHandle, windowHandle] as [ElementHandle<Microlc>, JSHandle<Window>]
    )

    expect(color).toEqual('rgb(23, 37, 170)')

    await expect(page.locator('div#my-div')).toHaveClass('container center')
    await expect(page.locator('div#my-div')).toHaveCSS('display', 'flex')
    await expect(page.locator('div#my-div')).toHaveCSS('border-radius', '25px')
    // console.log(await page.evaluate('document.createElement(\'style\')'))
    // const elements = Array(2).fill(0).map(() =>
    //   document.createElement('style')) as [HTMLStyleElement, HTMLStyleElement]

    // injectStyleToElements(cssInJss, elements, true)

    // const [global, nodes] = elements

    // expect(global.textContent).to.equalIgnoreSpaces(`
    //   :host {
    //     --micro-lc-global-variable: #1725aa;
    //     background-color: blue;
    //   }
    // `)
    // expect(nodes.textContent).to.equalIgnoreSpaces(`
    //   .container .center {
    //     display: flex;
    //   }
    //   :host {
    //     --another-var: 25px;
    //   }
    // `)

    // injectStyleToElements(cssInJss, elements, false)

    // expect(global.textContent).to.equalIgnoreSpaces(`
    //   :root {
    //     --micro-lc-global-variable: #1725aa;
    //     background-color: blue;
    //   }
    // `)
    // expect(nodes.textContent).to.equalIgnoreSpaces(`
    //   .container .center {
    //     display: flex;
    //   }
    //   :host {
    //     --another-var: 25px;
    //   }
    // `)
  })
})
