import {expect, test} from '@playwright/test'

import {userMenuSelector} from '../utils/constants'
import {waitMicrolcLoaded} from '../utils/utils'

test('User menu is not in page', async ({page}) => {
  await waitMicrolcLoaded(page)
  const userMenu = await page.$(userMenuSelector)
  expect(userMenu).not.toBeTruthy()
})
