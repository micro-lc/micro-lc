import { expect, waitUntil } from '@open-wc/testing'
import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import { defaultConfig } from '../src/config'
import MicroLC from '../src/micro-lc'

describe('micro-lc config tests', () => {
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

  it('should receive attribute input and merge config', async () => {
    const config = { $schema: 'my-schema' }
    const fetch = sandbox.stub(window, 'fetch').callsFake(() => Promise.resolve(new Response(
      JSON.stringify(config),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    )))

    // TEST
    // 1. append micro-lc
    const microlc = document.createElement('micro-lc') as MicroLC
    microlc.setAttribute('config-src', './config.json')
    microlc.setAttribute('shadow-dom', '')
    document.body.appendChild(microlc)

    // 2. await for config fetch
    await waitUntil(() =>
      microlc.configSrc === './config.json', 'configSrc property should be set after successful fetch'
    )
    expect(fetch).to.be.calledOnceWith(new URL('./config.json', window.location.origin))

    // 3. state must be reflected on web-component
    expect(microlc.configSrc).to.equal('./config.json')
    expect(microlc).dom.equal(`
      <micro-lc
        config-src="./config.json"
        shadow-dom=""
      ></micro-lc>
    `)
    expect(microlc.renderRoot).instanceOf(ShadowRoot)

    // 4. when update is done, config must be available
    await waitUntil(() => microlc.updateCompleted)
    expect(microlc.config).to.have.property('$schema', 'my-schema')
    //
  })

  it(`should remove 'config-src' attribute
      when config file is fetched with wrong 'Content-Type',
      default config must be used instead`, async () => {
    const fetch = sandbox.stub(window, 'fetch').callsFake(() => Promise.resolve(new Response(
      'my config file',
      {
        headers: { 'Content-Type': 'text/plain' },
        status: 200,
      }
    )))

    // TEST
    // 1. append micro-lc
    const microlc = document.createElement('micro-lc') as MicroLC
    microlc.setAttribute('config-src', './config.json')
    document.body.appendChild(microlc)

    // 2. fetch fails
    expect(fetch).to.be.calledOnceWith(new URL('./config.json', window.location.origin))
    expect(microlc.configSrc).to.be.undefined
    expect(microlc.renderRoot).instanceOf(MicroLC)

    // 3. default config is used instead
    await waitUntil(() => microlc.updateCompleted)
    expect(microlc.config).to.eql(defaultConfig)
  })

  it('should load config from property setting', async () => {
    // TEST
    // 1. append micro-lc
    const config = { $schema: 'my-schema' }
    const microlc = document.createElement('micro-lc') as MicroLC
    document.body.appendChild(
      Object.assign(microlc, { config })
    )

    // 2. check config
    await waitUntil(() => microlc.updateCompleted)
    expect(microlc.config).to.have.property('$schema', 'my-schema')
    //
  })
})
