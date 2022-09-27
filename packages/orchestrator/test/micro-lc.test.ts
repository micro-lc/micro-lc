/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Config } from '@micro-lc/interfaces'
import { expect, waitUntil } from '@open-wc/testing'
import { html, render } from 'lit-html'
import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import { mergeConfig } from '../src/config'
import Microlc from '../src/web-component'

describe('micro-lc lifecycle tests', () => {
  let sandbox: SinonSandbox

  before(() => {
    customElements.define('micro-lc', Microlc)
  })

  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should default attributes/properties', () => {
    const { body } = document
    render(html`
      <micro-lc config-src=""></micro-lc>
    `, body)

    const microlc = body.querySelector('micro-lc')!

    expect(microlc).to.have.attribute('config-src', '')
    expect(microlc).not.to.have.attribute('disable-shadow-dom')
    expect(microlc).not.to.have.attribute('use-shims')
    expect(microlc).to.have.property('configSrc', undefined)
    expect(microlc).to.have.property('disableShadowDom', false)
    expect(microlc).to.have.property('disableShims', false)

    microlc.remove()
  })


  it('should react on boolean attribute change', async () => {
    const configSrc = window.crypto.randomUUID()
    const { body } = document
    render(html`
      <micro-lc
        config-src=${configSrc}
        disable-shadow-dom
        disable-shims
      ></micro-lc>
    `, body)

    const microlc: Microlc = body.querySelector('micro-lc')!

    await waitUntil(() => microlc.updateComplete)
    expect(microlc).to.have.property('configSrc', configSrc)
    expect(microlc).to.have.property('disableShadowDom', true)
    expect(microlc).to.have.property('$$updatesCount', 1)
    // expect(microlc).to.have.property('useShims', true)
    microlc.remove()
  })

  it('should set config without using config-src', async () => {
    const config: Config = { version: 2 }
    const { body } = document
    render(html`
      <micro-lc config-src="/config.json"></micro-lc>
    `, body)

    const microlc: Microlc = body.querySelector('micro-lc')!
    microlc.config = config

    await waitUntil(() => microlc.updateComplete)
    expect(microlc).not.to.have.attribute('config-src')
    expect(microlc).to.have.property('$$updatesCount', 1)

    microlc.remove()
  })

  it('double rooting', async () => {
    const { body } = document
    render(html`
      <micro-lc disable-shadow-dom></micro-lc>
    `, body)

    const microlc: Microlc = body.querySelector('micro-lc')!
    microlc.appendChild(document.createElement('div'))
    microlc.shadowRoot.appendChild(document.createElement('span'))

    await waitUntil(() => microlc.updateComplete)
    expect(microlc).dom.equal(`
      <micro-lc disable-shadow-dom=""><div></div></micro-lc>
    `)
    expect(microlc).shadowDom.equal(`
      <span></span>
    `)

    microlc.remove()
  })

  it.only('config injection', async () => {
    const configSrc = window.crypto.randomUUID()
    const config: Config = { version: 2 }
    const fetch = sandbox.stub(window, 'fetch').callsFake((input: RequestInfo | URL) => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const { pathname } = new URL(input.toString(), window.location.origin)

      if (pathname === `/${configSrc}`) {
        return Promise.resolve(new Response(
          JSON.stringify(config),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
          }
        ))
      }

      return Promise.resolve(new Response('Not Found', { status: 404 }))
    })

    const { body } = document
    render(html`
      <micro-lc config-src=${configSrc}></micro-lc>
    `, body)

    const microlc: Microlc = body.querySelector('micro-lc')!

    await waitUntil(() => microlc.updateComplete)

    expect(microlc.querySelector('#__MICRO_LC_MOUNT_POINT div')?.parentElement).dom.to.equal(`
      <qiankun-head>
        <title>
          4xx :: Error
        </title>
      </qiankun-head>
      <div>
        Error
      </div>
    `)
    expect(microlc).shadowDom.to.equal('')

    expect(document.head.querySelector('script[type=esms-options]')?.textContent).to.equal(JSON.stringify({
      mapOverride: true,
      shimMode: true,
    }))

    expect(microlc).to.have.property('configSrc', configSrc)
    expect(fetch).to.be.calledOnceWith()
    expect(microlc.config).to.eql(mergeConfig(config))
    expect(microlc.$$updatesCount).to.equal(1)
  })

  it('config injection with qiankun applications', async () => {
    const config: Config = {
      applications: [
        {
          config: {
            content: {
              content: 0,
              tag: 'div',
            },
            sources: {
              importmap: {
                imports: {
                  dep: 'http://example.com',
                },
              },
              uris: 'data:text/javascript;base64,CmltcG9ydCB7UmVwbGF5U3ViamVjdH0gZnJvbSAncnhqcycKCmNvbnNvbGUubG9nKFJlcGxheVN1YmplY3QpCg==',
            },
          },
          id: 'main',
          integrationMode: 'compose',
          route: '/',
        },
      ],
      layout: {
        content: {
          tag: 'slot',
        },
      },
      version: 2,
    }

    const { body } = document
    render(html`
      <micro-lc></micro-lc>
    `, body)

    const microlc: Microlc = body.querySelector('micro-lc')!
    microlc.config = config

    await waitUntil(() => microlc.updateComplete)

    expect(microlc).dom.to.equal(`
      <micro-lc>
        <div id="__MICRO_LC_MOUNT_POINT">
          <div
            data-name="main"
            data-version="2.8.1"
            id="__qiankun_microapp_wrapper_for_main__"
          >
            <qiankun-head></qiankun-head>
          </div>
        </div>
      </micro-lc>
    `)
    expect(microlc).shadowDom.to.equal(`
      <slot></slot>
    `)

    microlc.remove()
  })
})
