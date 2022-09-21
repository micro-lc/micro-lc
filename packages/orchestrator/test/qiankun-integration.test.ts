import { expect, waitUntil } from '@open-wc/testing'
import { match, createSandbox } from 'sinon'

import MicroLC from '../src/micro-lc'

describe('qiankun integration tests', () => {
  before(() => {
    customElements.define('micro-lc', MicroLC)
  })

  it.skip('should load config from property setting', async () => {
    const sandbox = createSandbox()
    const fetch = sandbox.stub(window, 'fetch').callsFake(
      (input: RequestInfo | URL) => {
        const { pathname } = new URL(input as string)
        if (pathname === '/composer.development.js') {
          return Promise.resolve(new Response(
            `(o=>{
                o.purehtml={
                  bootstrap:()=>(console.log("purehtml bootstrap"),Promise.resolve()),
                  mount:()=>{console.log("purehtml mount")},
                  unmount:()=>(console.log("purehtml unmount"),Promise.resolve())
                }
              })(window);`,
            {
              headers: { 'Content-Type': 'application/javascript' },
              status: 200,
            }
          ))
        }

        return Promise.resolve(new Response(
          'Not found',
          {
            status: 404,
            statusText: 'Not found',
          }
        ))
      })
    // TEST
    // 1. append micro-lc
    // const config = { layout: { content: 'my-content' } }
    const microlc = document.createElement('micro-lc') as MicroLC
    document.body.appendChild(
      Object.assign(microlc, { config: {} })
    )

    // 2. check config
    await waitUntil(() => microlc.updateCompleted)

    expect(fetch).to.be.calledOnceWith(match(/\/composer.development.js$/))
    // expect(microlc.config.layout).to.have.property('content', 'my-content')
    sandbox.restore()
    //
  })
})
