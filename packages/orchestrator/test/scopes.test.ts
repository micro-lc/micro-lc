import type { Config } from '@micro-lc/interfaces'
import { expect, waitUntil } from '@open-wc/testing'
import { createSandbox } from 'sinon'

import MicroLC from '../src/apis'

describe('micro-lc config tests', () => {
  before(() => {
    customElements.define('micro-lc', MicroLC)
  })

  afterEach(() => {
    for (const child of document.body.children) {
      child.remove()
    }
  })

  it('should install importmap using shims and scoping by url', async () => {
    const sandbox = createSandbox()
    const fetch = sandbox.stub(window, 'fetch').callsFake(
      (input: RequestInfo | URL) => {
        const { pathname } = new URL(input as string)
        if (pathname === '/read-test.js') {
          return Promise.resolve(new Response(
            `export default function () {
              Object.defineProperty(
                window,
                '__read_test',
                {
                  value: '__read_test',
                  writable: true,
                  configurable: true
                }
              )
            }
            export function remove () {
              delete window.__read_test
            }`,
            {
              headers: { 'Content-Type': 'application/javascript' },
              status: 200,
            }
          ))
        }

        if (pathname === '/another-test.js') {
          return Promise.resolve(new Response(
            `export default function () {
              Object.defineProperty(
                window,
                '__another_test',
                {
                  value: '__another_test',
                  writable: true,
                  configurable: true
                }
              )
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
          'read-test': './read-test.js',
        },
        scopes: {
          './': {
            'another-test': './another-test.js',
          },
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

    // 2. await for config fetch
    await waitUntil(() => microlc.updateCompleted)

    // 3. inject module script using bare modules
    document.body.appendChild(
      Object.assign(document.createElement('script'), {
        textContent: `
          import readTest from 'read-test'
          import anotherTest from 'another-test'
          readTest()
          anotherTest()
        `,
        type: 'module-shim',
      })
    )
    await waitUntil(() => Object.prototype.hasOwnProperty.call(window, '__read_test'))
    await waitUntil(() => Object.prototype.hasOwnProperty.call(window, '__another_test'))
    expect(fetch).to.be.calledTwice
    sandbox.restore()
    // (match((val: string) => val.match(/\/read-test.js/)))
  })
})
