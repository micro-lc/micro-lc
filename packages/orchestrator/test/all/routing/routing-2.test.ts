import { expect, waitUntil } from '@open-wc/testing'

import { removeRouter, reroute } from '../../../src/web-component/lib/router'

import { createRouter, getQiankunId } from './interface'

describe('routing tests', () => {
  it(`
    should reroute after 404 on a given application
    mapping: 
      default => ./home
      home => none
      other => ./other
  `, async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const router = createRouter({
      other: './other',
    }, container, './home')

    await reroute.call(router)
    expect(container.querySelector('qiankun-head')?.nextElementSibling).dom.to.equal('<div>Error</div>')

    await reroute.call(router, '/home')
    expect(container.querySelector('qiankun-head')?.nextElementSibling).dom.to.equal('<div>Error</div>')

    await reroute.call(router, '/other')
    const qiankunId = getQiankunId(router, 'other') ?? 'not-found'
    await waitUntil(() => {
      let found = false
      for (const div of container.querySelectorAll('div')) {
        if (div.textContent?.replace(/\s/g, '') === qiankunId) {
          found = true
          break
        }
      }
      return found
    })

    await reroute.call(router, '/home')
    expect(container.querySelector('qiankun-head')?.nextElementSibling).dom.to.equal('<div>Error</div>')

    removeRouter()
  })
})
