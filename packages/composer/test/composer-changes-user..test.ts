import type { PluginConfiguration } from '@micro-lc/interfaces/v2'
import { expect, waitUntil } from '@open-wc/testing'
import { BehaviorSubject } from 'rxjs'

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
    const name = window.crypto.randomUUID()
    const config = {
      content: {
        attributes: { id: 'inner-div' },
        content: [
          'Hello',
          {
            attributes: { id: 'paragraph' },
            booleanAttributes: 'hidden',
            tag: 'p',
          },
        ],
        tag: 'div',
      },
    } as PluginConfiguration

    const userBus = new BehaviorSubject<Partial<Record<string, unknown>>>({})

    await bootstrap({ config, name })

    const container = document.createElement('div')

    await mount({
      composerApi: { context: { key: 1 } },
      container,
      microlcApi: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        subscribe: (callback) => userBus.asObservable().subscribe(callback),
      },
      name,
    })

    const expectedDom = `
      <div>
        <div id="inner-div">
          Hello
          <p hidden id="paragraph"></p>
        </div>
      </div>
    `

    expect(container).dom.to.equal(expectedDom)
    expect(container.firstElementChild).to.have.property('currentUser', undefined)
    expect(container.firstElementChild).to.have.property('key', 1)

    userBus.next({ user: 'john doe' })

    await waitUntil(() => (container.firstElementChild as HTMLElement & {currentUser: string}).currentUser === 'john doe', 'should have rerendered', { timeout: 10000 })
    expect(container).dom.to.equal(expectedDom)
  })
})
