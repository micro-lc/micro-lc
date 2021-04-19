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

import {baseUrl, firstValidPlugin} from '../utils/constants'
import {openSideMenu} from '../utils/utils'

test('Sidemenu has loaded plugins correctly', async ({page}) => {
  await openSideMenu(page)
  await page.textContent('"Href same window"')
  await page.textContent('"Href different window"')
  await page.textContent('"IFrame"')
  await page.textContent('"Qiankun plugin 1"')
  await page.textContent('"Qiankun plugin 2"')
});

test('Correctly change page for href same window', async ({page}) => {
  await openSideMenu(page)
  await page.click('"Href same window"')
  expect(page.url()).toBe('https://www.google.it/')
});

test('Correctly stay on previous page for href different window', async ({page}) => {
  await openSideMenu(page)
  await page.click('"Href different window"')
  expect(page.url()).toBe(firstValidPlugin)
});

test('Correctly change url for iframe plugin', async ({page}) => {
  await openSideMenu(page)
  await page.click('"IFrame"')
  expect(page.url()).toBe(`${baseUrl}/iframe`)
});
