import type { PluginConfiguration } from '@micro-lc/interfaces/v2'
import { expect } from '@open-wc/testing'
import { ReplaySubject } from 'rxjs'
import { createSandbox } from 'sinon'

import { bootstrap, mount } from '../src'

describe('composer tests', () => {
  before(async () => {
    Object.defineProperty(window, 'esmsInitOptions', {
      configurable: true,
      value: {
        mapOverrides: true,
        shimMode: true,
      },
      writable: true,
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await import('es-module-shims')
  })

  it('should fetch config from url', async () => {
    const sandbox = createSandbox()
    const { fetch: originalFetch } = window
    const fetch = sandbox.stub(window, 'fetch').callsFake((input, init) => {
      const { pathname } = new URL(input as string, window.document.baseURI)
      if (pathname === '/config.json') {
        return Promise.resolve(new Response(
          JSON.stringify({
            content: {
              attributes: { id: 'inner-div' },
              content: [
                'Hello',
                {
                  attributes: { id: 'paragraph' },
                  booleanAttributes: 'hidden',
                  properties: { eventBus: 'eventBus.[0]' },
                  tag: 'p',
                },
              ],
              tag: 'div',
            },
          } as PluginConfiguration),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
          }
        ))
      }

      return originalFetch(input, init)
    })
    const name = window.crypto.randomUUID()
    const config = '/config.json'

    await bootstrap({ config,
      microlcApi: {
        getExtensions: () => ({
          json: {
            fetcher: (info, init) => fetch(info, init).then((res) => res.json()),
          },
        }),
      },
      name,
    })
    expect(fetch).to.be.called

    const container = document.createElement('div')

    await mount({ container, name })

    expect(container).dom.to.equal(`
      <div>
        <div id="inner-div">
          Hello
          <p hidden id="paragraph"></p>
        </div>
      </div>
    `)

    expect(container.querySelector('#inner-div')).to.have.property('eventBus')
    const { eventBus } = (container.querySelector('#inner-div') as HTMLDivElement & {eventBus: ReplaySubject<unknown>})

    expect(container.querySelector('#paragraph')).to.have.property('eventBus')
    const { eventBus: $bus } = (container.querySelector('#inner-div') as HTMLParagraphElement & {eventBus: ReplaySubject<unknown>})

    expect(eventBus).to.be.an.instanceOf(ReplaySubject)
    expect($bus).to.be.an.instanceOf(ReplaySubject)
  })
})
