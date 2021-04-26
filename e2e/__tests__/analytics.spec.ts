/*
 * Copyright 2021 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {expect, test} from '@playwright/test'

import {waitMicrolcLoaded} from '../utils/utils'


test('Analytics footer appear for new sessions', async ({page}) => {
  await waitMicrolcLoaded(page)
  await page.textContent('"Accept"')
  await page.textContent('"Decline"')
})

test('Analytics footer appear even after refresh', async ({page}) => {
  for (let i = 0; i < 2; i++) {
    await waitMicrolcLoaded(page)
    await page.textContent('"Accept"')
    await page.textContent('"Decline"')
  }
})

test('Analytics footer disappear for accepted answer', async ({page}) => {
  await waitMicrolcLoaded(page)
  await page.click('"Accept"')
  const isAcceptedVisible = await page.$('"Accept"')
  expect(isAcceptedVisible).not.toBeTruthy()
})

test('Analytics footer stay disappeared even after refresh for accepted answer', async ({page}) => {
  await waitMicrolcLoaded(page)
  await page.click('"Accept"')
  await waitMicrolcLoaded(page)
  const isAcceptedVisible = await page.$('"Accept"')
  expect(isAcceptedVisible).not.toBeTruthy()
})

test('Analytics footer disappear for declined answer', async ({page}) => {
  await waitMicrolcLoaded(page)
  await page.click('"Decline"')
  const isAcceptedVisible = await page.$('"Decline"')
  expect(isAcceptedVisible).not.toBeTruthy()
})

test('Analytics footer stay disappeared even after refresh for declined answer', async ({page}) => {
  await waitMicrolcLoaded(page)
  await page.click('"Decline"')
  await waitMicrolcLoaded(page)
  const isAcceptedVisible = await page.$('"Decline"')
  expect(isAcceptedVisible).not.toBeTruthy()
})
