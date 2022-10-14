import { waitUntil } from '@open-wc/testing'

import { removeRouter, reroute } from '../../../src/web-component/lib/router'

import { createRouter, getQiankunId } from './interface'

describe('routing tests', () => {
  it(`
    should reroute correctly
    mapping: 
      default => /home
      home => ./home
      other => ./other
  `, async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const router = createRouter({
      home: './home',
      other: './other',
    }, container, '/home')

    await reroute.call(router)
    const homeId = getQiankunId(router, 'home') ?? 'not-found'
    await waitUntil(() => {
      let found = false
      for (const div of container.querySelectorAll('div')) {
        if (div.textContent?.replace(/\s/g, '') === homeId) {
          found = true
          break
        }
      }
      return found
    })

    await reroute.call(router, '/other')
    const otherId = getQiankunId(router, 'other') ?? 'not-found'
    await waitUntil(() => {
      let found = false
      for (const div of container.querySelectorAll('div')) {
        if (div.textContent?.replace(/\s/g, '') === otherId) {
          found = true
          break
        }
      }
      return found
    })

    removeRouter()
  })
})
