import { expect, waitUntil } from '@open-wc/testing'
import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import MicroLC from '../src/micro-lc'

describe('micro-lc tag', () => {
  let sandbox: SinonSandbox

  before(() => {
    customElements.define('micro-lc', MicroLC)
  })

  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    for (const child of document.body.children) {
      child.remove()
    }
    sandbox.restore()
  })

  it('should receive attribute input', async () => {
    const config = {
      $schema: 'my-schema',
    }
    const fetch = sandbox.stub(window, 'fetch').callsFake(() => Promise.resolve(new Response(
      JSON.stringify(config),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    )))

    // TEST
    const microlc = document.createElement('micro-lc') as MicroLC
    microlc.setAttribute('config-src', './config.json')
    microlc.setAttribute('shadow-dom', '')

    document.body.appendChild(microlc)

    await waitUntil(() =>
      microlc.configSrc !== undefined, 'configSrc property should be set after successful fetch'
    )
    expect(fetch).to.be.calledOnceWith(new URL('./config.json', window.location.origin))
    expect(microlc.configSrc).to.equal('./config.json')
    expect(microlc).dom.equal('<micro-lc config-src="./config.json" shadow-dom=""></micro-lc>')
    expect(microlc.renderRoot).instanceOf(ShadowRoot)

    await waitUntil(() =>
      JSON.stringify(microlc.config) === JSON.stringify(config)
    )
    //
  })

  it('should remove `config-src` when config file is fetched with wrong `Content-Type`', async () => {
    const fetch = sandbox.stub(window, 'fetch').callsFake(() => Promise.resolve(new Response(
      'my config file',
      {
        headers: { 'Content-Type': 'text/plain' },
        status: 200,
      }
    )))

    // TEST
    const microlc = document.createElement('micro-lc') as MicroLC
    microlc.setAttribute('config-src', './config.json')

    document.body.appendChild(microlc)

    expect(fetch).to.be.calledOnceWith(new URL('./config.json', window.location.origin))
    expect(microlc.configSrc).to.be.undefined
    expect(microlc.renderRoot).instanceOf(MicroLC)
    await waitUntil(() =>
      JSON.stringify(microlc.config) === JSON.stringify({})
    )
  })

  it('should load object config', async () => {
    // TEST
    const microlc = document.createElement('micro-lc') as MicroLC
    document.body.appendChild(microlc)
    const config = { $schema: 'my-schema' }
    microlc.config = config

    await waitUntil(() =>
      JSON.stringify(microlc.config) === JSON.stringify(config)
    )
    //
  })
})
