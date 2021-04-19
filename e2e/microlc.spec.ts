import {test} from '@playwright/test'

import {baseUrl, burgerSelector} from './constants'


test('Navigation to first plugin', async ({page}) => {
  await page.goto(baseUrl)
})
