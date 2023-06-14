import test, { expect } from '@playwright/test'

import { goto } from './complete-config'

test.describe('iconic react tests', () => {
  test('should render an antd icon', async ({ page }) => {
    const config = {
      applications: {
        icon: {
          config: {
            content: [
              {
                attributes: {
                  library: '@ant-design/icons-svg',
                  selector: 'AccountBookFilled',
                },
                tag: 'mlc-iconic',
              },
              {
                attributes: {
                  library: '@fortawesome/free-solid-svg-icons',
                  selector: 'faPalette',
                },
                tag: 'mlc-iconic',
              },
            ],
            sources: '/packages/layout/dist/mlc-iconic.js',
          },
          integrationMode: 'compose' as const,
          route: './',
        },
      },
      version: 2 as const,
    }
    await goto(page, config)

    await expect(page.locator('mlc-iconic').nth(0)).toBeVisible()
    await expect(page.locator('mlc-iconic').nth(1)).toBeVisible()
  })

  test('should use react hook to generate an icon', async ({ page }) => {
    test.slow()

    await page.goto('http://localhost:3000/pages/icons.html')

    await expect(page.locator('svg').nth(0)).toBeVisible()
    await expect(page.locator('svg').nth(1)).toBeVisible()
    await expect(page.locator('svg').nth(2)).toBeVisible()
  })

  test('should render an icon embedded in mlc-iconic custom webcomponent', async ({ page }) => {
    await page.goto('http://localhost:3000/pages/mlc-icons.html')
    const iconHandle = await page.evaluateHandle(() => document.querySelector('mlc-iconic') as HTMLElement)

    await page.evaluate((iconic) => {
      iconic.setAttribute('library', '@ant-design/icons-svg')
      iconic.setAttribute('selector', 'MessageOutlined')
    }, iconHandle)


    await expect(page.locator('svg[viewBox]')).toBeVisible()
  })

  test('should fail fetching an icon and keep the fallback', async ({ page }) => {
    await page.goto('http://localhost:3000/pages/mlc-icons.html')
    const iconHandle = await page.evaluateHandle(() => document.querySelector('mlc-iconic') as HTMLElement)

    await page.evaluate((iconic) => {
      iconic.setAttribute('library', '@ant-design/icons-svg')
      iconic.setAttribute('selector', 'MessageOutlined_')
    }, iconHandle)

    await page.waitForFunction((icon) => icon.textContent === '', iconHandle)
  })

  test('should show a fontawesome regular icon', async ({ page }) => {
    await page.goto('http://localhost:3000/pages/mlc-icons.html')
    const iconHandle = await page.evaluateHandle(() => document.querySelector('mlc-iconic') as HTMLElement)

    await page.evaluate((iconic) => {
      iconic.setAttribute('library', '@fortawesome/free-regular-svg-icons')
      iconic.setAttribute('selector', 'faAddressBook')
    }, iconHandle)

    await expect(page.locator('svg[viewBox]')).toBeVisible()
  })
})
