import {expect, test} from '@playwright/test'

import {firstValidPlugin} from '../utils/constants'
import {waitMicrolcLoaded} from "../utils/utils";


test('Navigate to first valid plugin', async ({page}) => {
  await waitMicrolcLoaded(page)
  expect(page.url()).toBe(firstValidPlugin)
})
