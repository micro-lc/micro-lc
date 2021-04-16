import {test} from '@playwright/test'

import {baseUrl, burgerSelector} from './constants'

test("Sidemenu has loaded plugins correctly", async ({page}) => {
  await page.goto(baseUrl)
  await page.waitForSelector(burgerSelector, {state: 'attached'})
  await page.$eval(burgerSelector, (element: any) => element.click())
  await page.textContent('"Href different window"')
  await page.textContent('"Href same window"')
  await page.textContent('"Qiankun plugin 1"')
  await page.textContent('"Qiankun plugin 2"')
  await page.textContent('"IFrame"')
  await page.textContent('"Qiankun as iframe"')
});
