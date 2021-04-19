import {expect, test} from '@playwright/test'

import {logoSelector, logoUrl} from '../utils/constants'
import {waitMicrolcLoaded} from '../utils/utils'

test('Logo is loaded correctly', async ({page}) => {
  await waitMicrolcLoaded(page)
  const logoSrc = await page.$eval(logoSelector, (element) => element.getAttribute('src'))
  expect(logoSrc).toBe(logoUrl)
});
