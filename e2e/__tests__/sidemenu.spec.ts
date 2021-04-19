import {expect, test} from '@playwright/test'

import {baseUrl, burgerSelector, firstValidPlugin} from '../utils/constants'
import {waitMicrolcLoaded} from '../utils/utils'

test('Sidemenu has loaded plugins correctly', async ({page}) => {
  await waitMicrolcLoaded(page)
  await page.$eval(burgerSelector, (element: any) => element.click())
  await page.textContent('"Href same window"')
  await page.textContent('"Href different window"')
  await page.textContent('"IFrame"')
});

test('Correctly change page for href same window', async ({page}) => {
  await waitMicrolcLoaded(page)
  await page.$eval(burgerSelector, (element: any) => element.click())
  await page.click('"Href same window"')
  expect(page.url()).toBe('https://www.google.it/')
});

test('Correctly stay on previous page for href different window', async ({page}) => {
  await waitMicrolcLoaded(page)
  await page.$eval(burgerSelector, (element: any) => element.click())
  await page.click('"Href different window"')
  expect(page.url()).toBe(firstValidPlugin)
});

test('Correctly change url for iframe plugin', async ({page}) => {
  await waitMicrolcLoaded(page)
  await page.$eval(burgerSelector, (element: any) => element.click())
  await page.click('"IFrame"')
  expect(page.url()).toBe(`${baseUrl}/iframe`)
});
