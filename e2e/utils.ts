import {Page} from 'playwright'

import {baseUrl, burgerSelector} from './constants'

export const waitMicrolcLoaded = async (page: Page) => {
  await page.goto(baseUrl)
  await page.waitForSelector(burgerSelector, {state: 'attached'})
}
