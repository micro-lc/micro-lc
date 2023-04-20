import test from '@playwright/test'

test('base tag => on `injectBase` href base attribute must be computed according to the application route', async ({ page }) => {
  await page.goto('http://localhost:3000/__reverse/index.html')

  await page.waitForFunction(() => {
    const base = document.querySelector('qiankun-head base') as HTMLBaseElement
    return Boolean(base) && base.getAttribute('href') === '/__reverse/react/'
  })
})
