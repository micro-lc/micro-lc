import { test, expect } from '@playwright/test'

import {baseUrl, burgerSelector, userMenuSelector} from "./constants";

test('User menu is not in page', async ({page}) => {
  await page.goto(baseUrl)
  await page.waitForSelector(burgerSelector, {state: 'attached'})
  const userMenu = await page.$(userMenuSelector)
  expect(userMenu).not.toBeTruthy()
})
