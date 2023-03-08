import test, { expect } from '@playwright/test'

import { goto, data } from './complete-config'

test(`
  [composition]
  should create a configuration mirror inside a given element;
  premount must append importmaps when requested and uris must be fetch;
  on createComposerContext properties and elements are appended
`, async ({ page }) => {
  const script = data`
    import React from 'react'
    window.React = React

    class CustomButton extends HTMLElement {
      connectedCallback() {
        this.appendChild(
          Object.assign(this.ownerDocument.createElement('button'), {textContent: "Click Me!"})
        )
      }
    }
    customElements.define('custom-button', CustomButton)
  `
  const now = new Date()
  const config = {
    content: {
      attributes: {
        id: 'root',
      },
      content: [
        0,
        {
          tag: 'custom-button',
        },
        {
          attributes: {
            style: 'display: flex;',
          },
          content: '1',
          tag: 'li',
        },
        {
          content: '2',
          tag: 'li',
        },
        {
          content: '3',
          properties: {
            array: {},
            date: now,
            // fn() { return 0 },
            isodate: now.toISOString(),
          },
          tag: 'li',
        },
      ],
      properties: {
        'extra-property': 'extra-property.[0]',
      },
      tag: 'div',
    },
    sources: {
      importmap: {
        imports: {
          react: 'https://cdn.jsdelivr.net/npm/@esm-bundle/react@17.0.2-fix.1/+esm',
        },
      },
      uris: [script],
    },
  }
  const microlcConfig = {
    applications: {
      home: {
        config,
        integrationMode: 'compose' as const,
        route: './home',
      },
    },
    settings: {
      defaultUrl: './home',
    },
    version: 2 as const,
  }

  await goto(page, microlcConfig)

  await page.waitForFunction(() => window.location.href.endsWith('/home'))

  await page.waitForFunction(() => 'React' in window)

  await expect(page.getByRole('listitem').filter({ hasText: '1' })).toBeVisible()
  await expect(page.getByRole('listitem').filter({ hasText: '2' })).toBeVisible()
  await expect(page.getByRole('listitem').filter({ hasText: '3' })).toBeVisible()
  await expect(page.getByRole('button', { exact: true, name: 'Click Me!' })).toBeVisible()
})

test(`
  [composition]
  should fetch config from url using micro-lc api
  and then mount it. shared props must be available
`, async ({ page }) => {
  // file is served by ./tests/server.ts
  const config = {
    applications: {
      home: {
        config: '/configurations/home.config.json',
        integrationMode: 'compose' as const,
        route: './',
      },
    },
    shared: {
      properties: {
        header: {
          Authentication: 'Bearer 1234',
        },
      },
    },
    version: 2 as const,
  }

  await goto(page, config)

  await expect(page.getByText('Hello')).toBeVisible()
  await expect(page.locator('p#paragraph')).not.toBeVisible()

  await page.waitForFunction(() => {
    const div = window.document.querySelector('div#inner-div') as HTMLDivElement
    const paragraph = window.document.querySelector('p#paragraph') as HTMLParagraphElement

    if (!('eventBus' in div && 'eventBus' in paragraph)) {
      return false
    }

    return div.eventBus !== paragraph.eventBus
  })

  const bearer = await page.evaluate('document.querySelector(\'div#inner-div\').header.Authentication')

  expect(bearer).toEqual('Bearer 1234')
})

test(`
  [composition]
  context persistence across mounts
`, async ({ page }) => {
  // file is served by ./tests/server.ts
  const config = {
    applications: {
      home: {
        config: { content: { attributes: { id: 'test' }, content: 'Hello', tag: 'div' } },
        integrationMode: 'compose' as const,
        route: './',
      },
      other: {
        integrationMode: 'iframe' as const,
        route: './example',
        src: 'https://example.com',
      },
    },
    shared: {
      properties: {
        header: {
          Authentication: 'Bearer 1234',
        },
      },
    },
    version: 2 as const,
  }

  await goto(page, config)

  await page.waitForFunction(() => document.getElementById('test') && 'microlcApi' in document.getElementById('test'))

  await page.evaluate(() => window.history.pushState('', '', '/example'))
  const frame = page.frameLocator('iframe')
  await expect(frame.getByRole('heading', { name: 'Example Domain' })).toBeVisible()

  await page.evaluate(() => window.history.pushState('', '', '/'))

  await page.waitForFunction(() => document.getElementById('test') && 'microlcApi' in document.getElementById('test'))
})


