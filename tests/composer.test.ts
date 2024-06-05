import test, { expect } from '@playwright/test'

import { goto, data, js, json, base } from './complete-config'

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
  should fetch config from url using micro-lc api
  and then mount it. Accept-Language should contain fallback
`, async ({ page, browserName }) => {
  // SAFETY: Playwright API testing does not work fine with firefox and webkit/epiphany due to fuzzy interplay with service workers
  if (browserName === 'webkit' || browserName === 'firefox') { test.skip() }

  const config = {
    applications: {
      home: {
        config: '/configurations/home.config.json',
        integrationMode: 'compose' as const,
        route: './',
      },
    },
    version: 2 as const,
  }

  let acceptLanguangeResolve: (value: unknown) => void
  const acceptLanguagePromise = new Promise((resolve) => { acceptLanguangeResolve = resolve })
  await page.route(`${base}/configurations/home.config.json`, async (route) => {
    const request = route.request()
    const acceptLanguage = await request.headerValue('Accept-Language')
    acceptLanguangeResolve(acceptLanguage)
    await route.continue()
  }, { times: 1 })

  await goto(page, config, `${base}/pages/language.html`)

  expect(await acceptLanguagePromise).toEqual('en-US, en;q=0.5, jp;q=0.1')
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

  await page.waitForFunction(() => {
    const item = document.getElementById('test')
    return item !== null && 'microlcApi' in item
  })

  await page.evaluate(() => window.history.pushState('', '', '/example'))
  const frame = page.frameLocator('iframe')
  await expect(frame.getByRole('heading', { name: 'Example Domain' })).toBeVisible()

  await page.evaluate(() => window.history.pushState('', '', '/'))

  await page.waitForFunction(() => {
    const item = document.getElementById('test')
    return item !== null && 'microlcApi' in item
  })
})

test(`
  [composition]
  [currentUser]
  currentUser persisted
`, async ({ page }) => {
  const parcel = js`
    let container
    let composerApi
    let context
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined"
        ? factory(exports)
        : typeof define === "function" && define.amd
          ? define(["exports"], factory)
          : (
            global = typeof globalThis !== "undefined"
              ? globalThis
              : global || self, factory(global.__parcel = {})
          )
    })(this, function(exports) {
      exports.bootstrap = () => Promise.resolve(null)
      exports.mount = (props) => {
        console.log(props)
        container = props.container
        if(props.composerApi) {
          context = props.composerApi.context
          microlcApi = props.composerApi.context.microlcApi
        }

        if(microlcApi) {
          microlcApi.subscribe(({user}) => {
            const { document } = self
            const div1 = Object.assign(
              document.createElement('div'),
              {
                textContent: user.user,
              }
            )
            const div2 = Object.assign(
              document.createElement('div'),
              {
                textContent: context.headers['Accept'],
              }
            )
            container.replaceChildren(div1, div2)
          })
        }
        return Promise.resolve(null)
      }
      exports.unmount = () => Promise.resolve(null)

      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    })
  `
  const userInfoUrl = json`
    {"user": "Pe$"}
  `
  const config = {
    applications: {
      home: {
        integrationMode: 'iframe' as const,
        route: './example',
        src: 'https://example.com',
      },
      parcel: {
        entry: { scripts: parcel },
        integrationMode: 'parcel' as const,
        route: './parcel',
      },
    },
    layout: {
      content: {
        properties: {
          menuItems: [
            {
              icon: {
                library: '@ant-design/icons-svg',
                selector: 'MessageOutlined',
              },
              id: 'parcel',
              label: 'Parcel',
              type: 'application',
            },
            {
              icon: {
                library: '@ant-design/icons-svg',
                selector: 'ShoppingOutlined',
              },
              id: 'home',
              label: 'Example',
              type: 'application',
            },
          ],
          mode: 'fixedSideBar',
          userMenu: {
            userInfoUrl,
          },
        },
        tag: 'mlc-layout',
      },
      sources: '/packages/layout/dist/mlc-layout.js',
    },
    settings: {
      defaultUrl: './parcel',
    },
    shared: {
      properties: {
        headers: {
          Accept: 'application/pdf',
        },
      },
    },
    version: 2 as const,
  }

  await goto(page, config)

  await expect(page.getByText('Pe$', { exact: true })).toBeVisible()
  await expect(page.getByText('application/pdf', { exact: true })).toBeVisible()

  // move to parcel
  await page.getByText('Example').click()
  const frame = page.frameLocator('iframe')
  await expect(frame.getByRole('heading', { name: 'Example Domain' })).toBeVisible()

  // move back to parcel
  await page.getByText('Parcel').click()
  await expect(page.getByText('Pe$', { exact: true })).toBeVisible()
  await expect(page.getByText('application/pdf', { exact: true })).toBeVisible()
})

test(`
  [composition]
  check that compose/iframe applications are mounted once
`, async ({ page }) => {
  let mounts = 0
  // file is served by ./tests/server.ts
  const config = {
    applications: {
      home: {
        config: { content: { attributes: { id: 'test' }, content: 'Hello', tag: 'div' } },
        integrationMode: 'compose' as const,
        route: './',
      },
    },
    settings: {
      composerUri: '/packages/composer/dist/composer.development.js',
      defaultUrl: './',
    },
    version: 2 as const,
  }

  page.on('console', (message) => {
    if (message.type() === 'log' || message.type() === 'info') {
      if (/\[micro-lc\]\[composer\]: home-.*starting mounting.../.test(message.text())) {
        mounts += 1
      }
    }
  })

  await goto(page, config)

  await expect(page.getByText('Hello')).toBeVisible()

  await page.waitForTimeout(500)

  expect(mounts).toEqual(1)
})

test(`
  [composition]
  multiple MFEs in a single compose page
`, async ({ page }) => {
  const config = {
    applications: {
      home: {
        config: {
          content: {
            attributes: {
              style: 'display: flex;',
            },
            content: [
              {
                attributes: {
                  style: 'width: 50%;',
                },
                booleanAttributes: ['disable-shadow-dom'],
                properties: {
                  application: {
                    entry: {
                      html: '/applications/react-memory-router/',
                    },
                    integrationMode: 'parcel',
                  },
                },
                tag: 'microfrontend-loader',
              },
              {
                attributes: {
                  style: 'width: 50%; height: inherit',
                },
                properties: {
                  application: {
                    integrationMode: 'iframe',
                    src: 'https://example.com',
                  },
                },
                tag: 'microfrontend-loader',
              },
            ],
            tag: 'div',
          },
          sources: '/packages/orchestrator/dist/microfrontend-loader.js',
        },
        integrationMode: 'compose' as const,
        route: './home',
      },
    },
    settings: {
      composerUri: '/packages/composer/dist/composer.development.js',
      defaultUrl: './home',
    },
    version: 2 as const,
  }

  await goto(page, config)

  await expect(page.getByText('Go To About Page')).toBeVisible()
  await expect(page.frameLocator('iframe').getByText('Example Domain')).toBeVisible()

  await page.getByRole('link', { name: 'Go To About Page' }).click()

  expect(page.url()).toEqual(`${base}/home`)

  await expect(page.getByText('Go Home')).toBeVisible()
  await expect(page.frameLocator('iframe').getByText('Example Domain')).toBeVisible()
})
