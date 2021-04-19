import { test, expect } from '@playwright/test'

import {baseUrl, logoUrl, logoSelector} from './constants'

test('Logo is loaded correctly', async ({ page }) => {
  await page.goto(baseUrl)
  await page.waitForSelector(logoSelector)
  const logoSrc = await page.$eval(logoSelector, (element) => element.getAttribute('src'))
  expect(logoSrc).toBe(logoUrl)
});
