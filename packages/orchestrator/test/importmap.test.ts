import type { Config } from '@micro-lc/interfaces'
import { expect, waitUntil } from '@open-wc/testing'
import { createSandbox, match } from 'sinon'

import Microlc from '../src/apis'

describe('micro-lc config tests', () => {
  before(() => {
    customElements.define('micro-lc', Microlc)
  })

  afterEach(() => {
    for (const child of document.body.children) {
      child.remove()
    }
  })

  it(`should install importmap using shims,
      then 2 module script must use the dependency,
      the second request will not be executed due to caching`, async () => {
    const sandbox = createSandbox()
    const fetch = sandbox.stub(window, 'fetch').callsFake(
      (input: RequestInfo | URL) => {
        const { pathname } = new URL(input as string)
        if (pathname === '/write-test.js') {
          return Promise.resolve(new Response(
            `export default function () {
              Object.defineProperty(
                window,
                '__write_test',
                {
                  value: '__write_test',
                  writable: true,
                  configurable: true
                }
              )
            }
            export function remove () {
              delete window.__write_test
            }`,
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

    const config: Config = {
      importmap: {
        imports: {
          'write-test': './write-test.js',
        },
      },
      version: 2,
    }

    // TEST
    // 1. append micro-lc
    const microlc = document.createElement('micro-lc') as Microlc
    document.body.appendChild(
      Object.assign(microlc, { config })
    )

    // 2. await for config fetch
    await waitUntil(() => microlc.updateComplete)

    // 3. inject module script using bare modules
    document.body.appendChild(
      Object.assign(document.createElement('script'), {
        textContent: `
          import writeTest from 'write-test'
          writeTest()
        `,
        type: 'module-shim',
      })
    )
    await waitUntil(() => Object.prototype.hasOwnProperty.call(window, '__write_test'))
    expect(fetch).to.be.calledOnceWith(match((val: string) => val.match(/\/write-test.js/)))

    // 4. inject module script that should use caching
    document.body.appendChild(
      Object.assign(document.createElement('script'), {
        textContent: `
          import {remove} from 'write-test'
          remove()
        `,
        type: 'module-shim',
      })
    )
    await waitUntil(() => !Object.prototype.hasOwnProperty.call(window, '__write_test'))
    // 5. es-module-shims caching
    expect(fetch).to.be.calledOnce
    sandbox.restore()
  })
})
