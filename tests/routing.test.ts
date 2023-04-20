import test, { expect } from '@playwright/test'

import type Microlc from '../packages/orchestrator/src/web-component'

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
