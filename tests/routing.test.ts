import test, { expect } from '@playwright/test'

import type Microlc from '../packages/orchestrator/src/web-component'

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
})
