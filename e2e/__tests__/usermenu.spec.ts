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

import {userMenuSelector} from '../utils/constants'
import {waitMicrolcLoaded} from '../utils/utils'

test('User menu is not in page', async ({page}) => {
  await waitMicrolcLoaded(page)
  const userMenu = await page.$(userMenuSelector)
  expect(userMenu).toBeFalsy()
})
