import type { Microlc, MicrolcConfig } from '@micro-lc/orchestrator'
import test, { expect } from '@playwright/test'

import completeConfig, { base, goto } from './complete-config'

test(`
  [config injection]
  [development mode]
  empty config should go to 404 error page
`, async ({ page }) => {
  const config: MicrolcConfig = { version: 2 }
  await goto(page, config, `http://localhost:3000/dev/`)

  await expect(page.getByText('Application cannot be found')).toBeVisible()
  await expect(page.getByText('Page /dev/ cannot be found')).toBeVisible()
})

test(`
  [config injection]
  empty config should go to 404 error page
`, async ({ page }) => {
  const config: MicrolcConfig = { version: 2 }
  await goto(page, config)

  await expect(page.getByText('Application cannot be found')).toBeVisible()
  await expect(page.getByText('Page / cannot be found')).toBeVisible()
})

test(`
  [config injection]
  empty config with custom 404 error page
  should show the custom page
`, async ({ page }) => {
  const config: MicrolcConfig = {
    settings: {
      '4xx': {
        404: {
          integrationMode: 'iframe',
          src: 'https://example.org',
        },
      },
    },
    version: 2,
  }
  await goto(page, config)

  const frame = page.frameLocator('iframe')
  await expect(frame.getByRole('heading', { name: 'Example Domain' })).toBeVisible()
})

test(`
  [attributes]
  Accept-Language should contain fallback language
`, async ({ page, browserName }) => {
  // SAFETY: Playwright API testing does not work fine with firefox and webkit/epiphany due to fuzzy interplay with service workers
  if (browserName === 'webkit' || browserName === 'firefox') { test.skip() }

  let jpFallbackResolve: (value: unknown) => void
  const jpFallback = new Promise((resolve) => { jpFallbackResolve = resolve })
  await page.route(`${base}/pages/api/config.json`, async (route) => {
    const request = route.request()
    const acceptLanguage = await request.headerValue('Accept-Language')
    route.fulfill({ json: { version: 2 } })
      .then(() => jpFallbackResolve(acceptLanguage))
      .catch(console.error)
  }, { times: 1 })

  await page.goto(`${base}/pages/language.html`)
  expect(await jpFallback).toEqual('en-US, en;q=0.5, jp;q=0.1')

  // //////////////////////////////////////////////////////////////////////////////////////////////////////

  await page.waitForTimeout(300)
  let frFallbackResolve: (value: unknown) => void
  const frFallback = new Promise((resolve) => { frFallbackResolve = resolve })
  await page.route(`${base}/pages/api/config.json`, async (route) => {
    const request = route.request()
    const acceptLanguage = await request.headerValue('Accept-Language')
    route.fulfill({ json: { version: 2 } })
      .then(() => frFallbackResolve(acceptLanguage))
      .catch(console.error)
  }, { times: 1 })

  await page.evaluate(() => {
    const mlc = window.document.querySelector('micro-lc') as Microlc
    mlc.fallbackLanguage = 'fr'
  })
  expect(await frFallback).toEqual('en-US, en;q=0.5, fr;q=0.1')

  // //////////////////////////////////////////////////////////////////////////////////////////////////////

  let noDuplicateFallbackResolve: (value: unknown) => void
  const noDuplicateFallback = new Promise((resolve) => { noDuplicateFallbackResolve = resolve })
  await page.route(`${base}/pages/api/config.json`, async (route) => {
    const request = route.request()
    const acceptLanguage = await request.headerValue('Accept-Language')
    route.fulfill({ json: { version: 2 } })
      .then(() => noDuplicateFallbackResolve(acceptLanguage))
      .catch(console.error)
  }, { times: 1 })

  await page.evaluate(() => {
    const mlc = window.document.querySelector('micro-lc') as Microlc
    mlc.fallbackLanguage = 'en'
  })
  expect(await noDuplicateFallback).toEqual('en-US, en;q=0.5')

  // //////////////////////////////////////////////////////////////////////////////////////////////////////

  let noFallbackResolve: (value: unknown) => void
  const noFallback = new Promise((resolve) => { noFallbackResolve = resolve })
  await page.route(`${base}/pages/api/config.json`, async (route) => {
    const request = route.request()
    const acceptLanguage = await request.headerValue('Accept-Language')
    route.fulfill({ json: { version: 2 } })
      .then(() => noFallbackResolve(acceptLanguage))
      .catch(console.error)
  }, { times: 1 })

  await page.evaluate(() => {
    const mlc = window.document.querySelector('micro-lc') as Microlc
    mlc.fallbackLanguage = null
  })
  expect(await noFallback).toEqual('en-US, en;q=0.5')
})

test(`
  [config injection]
  should use default url
`, async ({ page }) => {
  const config: MicrolcConfig = {
    applications: {
      example: {
        integrationMode: 'iframe',
        route: '/home',
        src: 'https://example.org',
      },
    },
    settings: {
      defaultUrl: '/home',
    },
    version: 2,
  }
  await goto(page, config)

  const frame = page.frameLocator('iframe')
  await expect(frame.getByRole('heading', { exact: true, name: 'Example Domain' })).toBeVisible()
})

test(`
  [config injection]
  should mount each type of application
`, async ({ page }) => {
  const config: MicrolcConfig = {
    applications: {
      example: {
        integrationMode: 'iframe',
        route: '/example',
        src: 'https://example.org',
      },
      'landing-page': {
        config: {
          content: 'Hello!',
        },
        integrationMode: 'compose',
        route: './',
      },
      'react-browser': {
        entry: '/applications/react-browser-router/',
        injectBase: true,
        integrationMode: 'parcel',
        route: '/react-browser-router',
      },
      'react-hash': {
        entry: '/applications/react-hash-router/',
        integrationMode: 'parcel',
        route: '/react-hash-router',
      },
    },
    version: 2,
  }
  await goto(page, config)

  await expect(page.getByText('Hello!', { exact: true })).toBeVisible()

  // redirect to wikipedia iframe
  await page.evaluate(() => window.history.pushState(null, '', '/example'))

  const frame = page.frameLocator('iframe')
  await expect(frame.getByRole('heading', { name: 'Example Domain' })).toBeVisible()

  // redirect to wikipedia react-browser parcel app
  await page.evaluate(() => window.history.pushState(null, '', '/react-browser-router'))

  const reactBrowserLink = page.getByRole('link', { name: 'Go To About Page' })
  await expect(reactBrowserLink).toBeVisible()
  expect(page.url()).toEqual(`${base}/react-browser-router`)
  await reactBrowserLink.click()
  expect(page.url()).toEqual(`${base}/react-browser-router/about`)

  // redirect to wikipedia react-browser parcel app
  await page.evaluate(() => window.history.pushState(null, '', '/react-hash-router'))

  const reactHashLink = page.getByRole('link', { name: 'Go To About Page' })
  await expect(reactHashLink).toBeVisible()
  expect(page.url()).toEqual(`${base}/react-hash-router`)
  await reactHashLink.click()
  expect(page.url()).toEqual(`${base}/react-hash-router#/about`)
})

test(`
  [config injection]
  providing a full-fledged config with menu
  1. it must go to home since it is the defaultUrl
  2. then should move to plain app
  3. perform some internal navigation without changing the plugin
    -> with history
    -> with micro-lc api
  4. render a react parcel
`, async ({ page }) => {
  await goto(page, completeConfig)

  await page.waitForFunction(() => window.location.href.endsWith('/home'))
  const frame = page.frameLocator('iframe')
  await expect(frame.getByRole('heading', { name: 'Example Domain' })).toBeVisible()

  await page.getByRole('menuitem', { name: 'Plain App' }).click()
  await expect(page.locator('strong', { hasText: 'Home' })).toBeVisible()

  await page.evaluate(() => window.history.pushState(null, '', '/plain/about'))
  await expect(page.getByText('About')).toBeVisible()

  const microlcHandle = await page.evaluateHandle<Microlc>('document.querySelector(\'micro-lc\')')

  await page.evaluate((microlc) => microlc.getApi().router.goToApplication('plain/details'), microlcHandle)
  await expect(page.getByText('Hello')).toBeVisible()

  await page.evaluate((microlc) => microlc.getApi().router.goToApplication('react'), microlcHandle)
  await expect(page.getByRole('link', { name: 'Go To About Page' })).toBeVisible()
})

test(`
  [config injection]
  parcel config as {"html": "<path>"}
`, async ({ page }) => {
  await goto(page, {
    applications: {
      react: {
        entry: { html: '/applications/react-browser-router/' },
        injectBase: true,
        integrationMode: 'parcel',
        route: './react/',
      },
    },
    settings: {
      defaultUrl: './react/',
    },
    version: 2,
  })

  const microlcHandle = await page.evaluateHandle<Microlc>('document.querySelector(\'micro-lc\')')

  await page.evaluate((microlc) => microlc.getApi().router.goToApplication('react'), microlcHandle)
  await expect(page.getByRole('link', { name: 'Go To About Page' })).toBeVisible()
})

test(`
  [config injection]
  error page customization should not override all defaults
`, async ({ page }) => {
  await goto(page, {
    settings: {
      '4xx': {
        400: {
          integrationMode: 'iframe',
          src: 'https://example.com',
        },
      },
      defaultUrl: '/home',
    },
    version: 2,
  })

  await expect(page.locator('svg')).toBeVisible()
})
