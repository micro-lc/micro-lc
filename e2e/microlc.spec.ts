import {expect, test} from '@playwright/test'

import {firstValidPlugin} from './constants'
import {waitMicrolcLoaded} from "./utils";


test('Navigate to first valid plugin', async ({page}) => {
  await waitMicrolcLoaded(page)
  expect(page.url()).toBe(firstValidPlugin)
})
