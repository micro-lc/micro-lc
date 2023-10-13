import test, { expect } from '@playwright/test'

import type Microlc from '../packages/orchestrator/src/web-component'
import type { BaseExtension } from '../packages/orchestrator/src/web-component'

import completeConfig, { goto } from './complete-config'

test('base tag => on `injectBase` href base attribute must be computed according to the application route', async ({ page }) => {
  await page.goto('http://localhost:3000/__reverse/')

  await page.waitForFunction(() => {
    const base = document.querySelector('qiankun-head base') as HTMLBaseElement
    return Boolean(base) && base.getAttribute('href') === '/__reverse/react/'
  })

  await expect(page.getByText('About')).toBeVisible()

  await page.evaluate(() => (document.querySelector('micro-lc') as Microlc).getApi().router.goTo('/__reverse/react/'))

  await expect(page.getByText('Go to about page')).toBeVisible()

  await page.getByRole('link', { name: 'Go To About Page' }).click()

  await expect(page.getByText('About')).toBeVisible()

  await page.evaluate(() => (document.querySelector('micro-lc') as Microlc).getApi().router.goToApplication('example'))

  const frame = page.frameLocator('iframe')
  await expect(frame.getByRole('heading', { name: 'Example Domain' })).toBeVisible()

  await page.evaluate(() => (document.querySelector('micro-lc') as Microlc).getApi().router.goTo('/__reverse/react/about'))

  await expect(page.getByText('About')).toBeVisible()
})

test('trailing slash should win on exact on route when trailing slash route is longer', async ({ page }) => {
  await page.goto('http://localhost:3000/__reverse/react')

  await expect(page.getByText('Go to about page')).toBeVisible()
  expect(page.url()).toEqual('http://localhost:3000/__reverse/react/')

  await page.getByRole('link', { name: 'Go To About Page' }).click()

  await expect(page.getByText('About')).toBeVisible()
})

test(`
  [react/angular routing]
  react and angular apps should move to their relative /about page and back
`, async ({ page }) => {
  const microlcHandle = await goto(page, completeConfig, 'http://localhost:3000/zoned/')
  await page.waitForFunction(() => window.location.href.endsWith('/zoned/home'))
  const frame = page.frameLocator('iframe')
  await expect(frame.getByRole('heading', { name: 'Example Domain' })).toBeVisible()

  await page.evaluate((microlc) => microlc.getApi().router.goToApplication('react'), microlcHandle)
  await expect(page.getByRole('link', { name: 'Go To About Page' })).toBeVisible()
  await page.getByRole('link', { name: 'Go To About Page' }).click()
  await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible()
  await page.getByRole('link', { name: 'Go Home' }).click()
  expect(page.url()).toMatch(/\/react\/$/)

  await page.evaluate((microlc) => microlc.getApi().router.goToApplication('angular12'), microlcHandle)
  await expect(page.getByRole('link', { name: 'Go To About Page' })).toBeVisible()
  await page.getByRole('link', { name: 'Go To About Page' }).click()
  await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible()
  await page.getByRole('link', { name: 'Go Home' }).click()
  expect(page.url()).toMatch(/\/angular12\/$/)

  await page.evaluate((microlc) => microlc.getApi().router.goToApplication('angular13'), microlcHandle)
  await expect(page.getByRole('link', { name: 'Go To About Page' })).toBeVisible()
  await page.getByRole('link', { name: 'Go To About Page' }).click()
  await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible()
  await page.getByRole('link', { name: 'Go Home' }).click()
  expect(page.url()).toMatch(/\/angular13\/$/)

  await page.evaluate((microlc) => microlc.getApi().router.goToApplication('angular14'), microlcHandle)
  await expect(page.getByRole('link', { name: 'Go To About Page' })).toBeVisible()
  await page.getByRole('link', { name: 'Go To About Page' }).click()
  await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible()
  await page.getByRole('link', { name: 'Go Home' }).click()
  expect(page.url()).toMatch(/\/angular14\/$/)

  await page.evaluate((microlc) => microlc.getApi().router.goToApplication('vue3'), microlcHandle)
  await expect(page.getByText('You did it!')).toBeVisible()
  await page.getByRole('link', { name: 'About' }).click()
  await expect(page.getByText('This is an about page')).toBeVisible()
  await page.getByRole('link', { name: 'Home' }).click()
  expect(page.url()).toMatch(/\/vue3\/$/)
})

test(`
  [override injectBase routing]
  a parcel application with an existing
  base tag and marked for injectBase "override"
  must see its base tag to be removed and a new one to be injected
  according with the current page location
`, async ({ page }) => {
  await goto(page, completeConfig, 'http://localhost:3000/zoned/')
  await page.waitForFunction(() => window.location.href.endsWith('/zoned/home'))
  await expect(page.frameLocator('iframe').getByRole('heading', { name: 'Example Domain' })).toBeVisible()

  await page.getByText('Override Base').click()

  await page.waitForFunction(() => window.location.href.endsWith('/zoned/override-base/'))
  await page.getByText('Go To About Page', { exact: true }).click()
  await page.waitForFunction(() => window.location.href.endsWith('/zoned/override-base/about'))
})

test(`
  [mount/unmount on routing]
  parcels with a router must be completely unmounted
  before to push a new URL and thus
  before mounting the destination parcel
`, async ({ page }) => {
  const customElements = `
    customElements.define('go-to-button', class extends HTMLElement {
      connectedCallback() {
        const shadowDom = this.attachShadow({mode: 'open'})
        const slot = this.ownerDocument.createElement('slot')
        const button = this.ownerDocument.createElement('button')

        button.onclick = () => this.microlcApi.router.goToApplication(this.application)

        button.appendChild(slot)
        shadowDom.appendChild(button)
      }
    })
    customElements.define('state-holder', class extends HTMLElement {
      connectedCallback() {
        this.microlcApi.setExtension('state', {states: [], push(next) {this.states.push(next)}})
      }
    })
  `
  const appFactory = (name: string) => `
function popStateListener(event) {
  const target = event.target ?? window
  this.microlcApi.getExtensions().state.push(\`app ${name}: \${target.location.href}\`)
}
;(() => {
  const exports = {}
  window['${name}'] = exports

  let root = null
  let router = null

  exports.bootstrap = async () => null
  exports.mount = async ({container, microlcApi}) => {
    const pop = popStateListener.bind({microlcApi})
    const nextRouter = {
      listen: () => window.addEventListener('popstate', pop),
      unlisten: () => window.removeEventListener('popstate', pop)
    }
    nextRouter.listen()
    container.appendChild(
      Object.assign(
        document.createElement('div'),
        {
          textContent: 'content of ${name}'
        }
      )
    )
    router = nextRouter
    root = container
    return null
  }
  exports.unmount = async () => {
    router?.unlisten()
    root?.removeChildren()
    router = null
    root = null

    return null
  }
})()
  `
  const data = (input: string) => `data:text/javascript;base64,${Buffer.from(input).toString('base64')}`
  type Extensions = BaseExtension & {
    state: {
      push(next: string): void
      states: string[]
    }
  }
  const microlcHandle = await goto<Extensions>(page, {
    applications: {
      app1: {
        entry: {
          scripts: [data(appFactory('app1'))],
        },
        integrationMode: 'parcel',
        route: '/app1/',
      },
      app2: {
        entry: {
          scripts: [data(appFactory('app2'))],
        },
        integrationMode: 'parcel',
        route: '/app2/',
      },
    },
    layout: {
      content: [
        {
          content: [
            {
              content: [
                {
                  content: 'app1',
                  properties: {
                    application: 'app1',
                  },
                  tag: 'go-to-button',
                },
                {
                  content: 'app2',
                  properties: {
                    application: 'app2',
                  },
                  tag: 'go-to-button',
                },
              ],
              tag: 'div',
            },
            {
              tag: 'state-holder',
            },
            {
              tag: 'slot',
            },
          ],
          tag: 'div',
        },
      ],
      sources: [
        data(customElements),
      ],
    },
    settings: {
      defaultUrl: '/app1/',
    },
    version: 2 as const,
  })
  await page.waitForFunction(() => window.location.href.endsWith('/app1/'))
  await expect(page.getByText('content of app1', { exact: true })).toBeVisible()

  await page.evaluate(() => window.history.pushState('', '', '/app1/ciao'))

  let first = await page.evaluate((microlc) => microlc.getApi().getExtensions().state?.states[0], microlcHandle)
  let len = await page.evaluate((microlc) => microlc.getApi().getExtensions().state?.states.length, microlcHandle)
  expect(first).toEqual('app app1: http://localhost:3000/app1/ciao')
  expect(len).toEqual(1)

  await page.getByRole('button').nth(1).click()

  first = await page.evaluate((microlc) => microlc.getApi().getExtensions().state?.states[0], microlcHandle)
  len = await page.evaluate((microlc) => microlc.getApi().getExtensions().state?.states.length, microlcHandle)
  expect(first).toEqual('app app1: http://localhost:3000/app1/ciao')
  expect(len).toEqual(1)

  await page.getByRole('button').nth(0).click()

  first = await page.evaluate((microlc) => microlc.getApi().getExtensions().state?.states[0], microlcHandle)
  len = await page.evaluate((microlc) => microlc.getApi().getExtensions().state?.states.length, microlcHandle)
  expect(first).toEqual('app app1: http://localhost:3000/app1/ciao')
  expect(len).toEqual(1)
})
