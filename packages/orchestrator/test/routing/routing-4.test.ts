import { expect } from '@open-wc/testing'

import { removeRouter, reroute } from '../../src/web-component/lib/router'

import { createRouter, templateHTML } from './interface'

const entryFetch = templateHTML`
  <!DOCTYPE html>
  <html lang="en">
  <head></head>
  <body>
    <script src="/unauthorized.js"></script>
    <script>
      function fn(global) {
        Object.assign(
          global,
          'UNAUTHORIZED',
          {
            bootstrap: () => Promise.resolve(),
            mount: () => Promise.resolve(),
            unmount: () => Promise.resolve(null),
            update: () => Promise.resolve()
          }
        )
      }
      ;(function register(global, factory) {
        global.__MICRO_LC_4XX = {}
        factory(global.__MICRO_LC_4XX, global)
      })(window, fn)
    </script>
  </body>
  </html>
`

describe('routing tests', () => {
  it(`
    should reroute correctly
    mapping: 
      default => /home
      home => ./home
  `, async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const router = createRouter({
      home: { entry: entryFetch, route: './home' },
    }, container, '/home')

    await reroute.call(router)
    expect(container.querySelector('qiankun-head')?.nextElementSibling).dom.to.equal('<div>Error</div>')

    removeRouter()
  })
})
