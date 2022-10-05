import { waitUntil, expect } from '@open-wc/testing'
import { html, render } from 'lit-html'
import { createSandbox } from 'sinon'

import Microlc from '../../src/web-component'
import { base64 } from '../utils'

describe('micro-lc initialization tests', () => {
  before(() => {
    customElements.define('micro-lc', Microlc)
  })

  it('should render no config --> empty page with no mount point', async () => {
    const { body } = document
    const root = body.appendChild(document.createElement('div'))

    render(html`
      <micro-lc></micro-lc>
    `, root)

    const microlc = root.firstElementChild as Microlc
    await waitUntil(() => microlc.updateComplete)

    expect(microlc).dom.to.equal(`<micro-lc></micro-lc>`)
    expect(microlc).shadowDom.to.equal(``)
    expect(window.importShim).to.be.undefined

    root.remove()
  })

  it('should render default config', async () => {
    const sandbox = createSandbox()
    const page404 = base64`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>4xx :: Error</title>
      </head>
      <body>
        <div>Error</div>
        <script>
          function fn(global) {
            Object.assign(
              global,
              '4xx',
              {
                bootstrap: () => Promise.resolve(),
                mount: () => Promise.resolve(),
                unmount: () => Promise.resolve(null),
                update: () => Promise.resolve()
              }
            )
          }
          ;(function register(global, factory) {
            global.__MICRO_LC_4XX = {}
            factory(global.__MICRO_LC_4XX, global)
          })(window, fn)
        </script>
      </body>
      </html>
    `
    const { body } = document
    const root = body.appendChild(document.createElement('div'))

    render(html`
      <micro-lc></micro-lc>
    `, root)

    const microlc = root.firstElementChild as Microlc
    microlc.config = { settings: { '4xx': { 404: page404 } } }

    await waitUntil(() => microlc.updateComplete)

    expect(microlc.querySelector('#__MICRO_LC_MOUNT_POINT')).not.to.be.undefined
    expect(window.importShim).not.to.be.undefined

    root.remove()
    sandbox.restore()
  })
})
