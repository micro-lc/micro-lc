import type { MlcLoadingAnimation } from '@micro-lc/layout'
import test, { expect } from '@playwright/test'

test('mlc-loading-animation: should send configuration to micro-lc API with default values', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/')

  await page.evaluate(() => {
    const src = '/packages/layout/dist/mlc-loading-animation.js'
    const script = window.document.createElement('script')
    Object.assign(script, {
      async: true,
      src,
      type: 'module',
    })
    document.head.appendChild(script)

    window.customElements.whenDefined('mlc-loading-animation').then(() => {
      const div = document.createElement('div')
      const manager = document.createElement('mlc-loading-animation') as MlcLoadingAnimation
      manager.appendChild(div)
      document.body.appendChild(manager)
    }).catch(console.error)
  })

  await expect(page.locator('mlc-loading-animation').locator('svg')).toBeVisible()
})
