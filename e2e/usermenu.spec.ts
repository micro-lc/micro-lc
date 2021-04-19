import {expect, test} from '@playwright/test'

import {userMenuSelector} from './constants'
import {waitMicrolcLoaded} from './utils'

test('User menu is not in page', async ({page}) => {
  await waitMicrolcLoaded(page)
  const userMenu = await page.$(userMenuSelector)
  expect(userMenu).not.toBeTruthy()
})
