import {test, expect} from '@playwright/test'

import {baseUrl, burgerSelector} from './constants'

test('Sidemenu has loaded plugins correctly', async ({page}) => {
  await page.goto(baseUrl)
  await page.waitForSelector(burgerSelector, {state: 'attached'})
  await page.$eval(burgerSelector, (element: any) => element.click())
  await page.textContent('"Href same window"')
  await page.textContent('"Href different window"')
});

test('Correctly change page for href same window', async ({page}) => {
  await page.goto(baseUrl)
  await page.waitForSelector(burgerSelector, {state: 'attached'})
  await page.$eval(burgerSelector, (element: any) => element.click())
  await page.click('"Href same window"')
  expect(page.url()).toBe('https://www.google.it/')
});

test('Correctly stay on previous page page for href different window', async ({page}) => {
  await page.goto(baseUrl)
  await page.waitForSelector(burgerSelector, {state: 'attached'})
  await page.$eval(burgerSelector, (element: any) => element.click())
  await page.click('"Href different window"')
  expect(page.url()).toBe(`${baseUrl}/`)
});
