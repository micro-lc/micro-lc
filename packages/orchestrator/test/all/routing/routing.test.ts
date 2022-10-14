import { expect } from '@open-wc/testing'

import { removeRouter, reroute } from '../../../src/web-component/lib/router'

import { createRouter } from './interface'

describe('routing tests', () => {
  it('without applications it should reroute to the 404 page', async () => {
    const container = document.createElement('div')
    const router = createRouter({}, container)

    await reroute.call(router)
    expect(container.querySelector('qiankun-head')?.nextElementSibling).dom.to.equal('<div>Error</div>')

    removeRouter()
  })
})
