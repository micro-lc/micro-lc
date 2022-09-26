import { expect, waitUntil } from '@open-wc/testing'
import { stub, match } from 'sinon'

import type Microlc from '../src/apis'
import { createRouter, removeRouter, reroute } from '../src/router'

interface PartialMicrolc {
  _loadedApps: [string, Record<string, unknown>][]
  _qiankun: {
    loadMicroApp: () => {
      bootstrapPromise: Promise<null>
      mount: () => Promise<null>
      unmount: () => Promise<null>
    }
  }
}

type MockMicrolc = PartialMicrolc & {
  _reroute: (url?: string | URL) => Promise<void>
}

describe('router tests', () => {
  afterEach(() => {
    removeRouter()
  })
  it('on reroute should pick according with starts with policy', async () => {
    const partialMicrolc: PartialMicrolc = {
      _loadedApps: Array(5).fill(0).map((_, idx) => [
        `/route-${idx}`, {
          key: idx,
        },
      ]),
      _qiankun: {
        loadMicroApp: stub().returns({
          bootstrapPromise: Promise.resolve(null),
          mount: stub().resolves(null),
          unmount: stub().resolves(null),
        }),
      },
    }
    const microlc: MockMicrolc = {
      ...partialMicrolc,
      _reroute: reroute.bind(partialMicrolc as unknown as Microlc),
    }

    createRouter.call(microlc as unknown as Microlc)
    window.history.pushState('', '', `/route-3/${window.crypto.randomUUID()}`)
    // await reroute.call(microlc as unknown as Microlc, '/route-3')

    await waitUntil(() => window.location.pathname.includes('/route-3'))
    expect(microlc._qiankun.loadMicroApp).to.be.calledOnceWith(match.has('key', 3))
    expect(microlc._qiankun.loadMicroApp().mount).to.be.calledOnce
  })
})
