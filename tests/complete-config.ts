import type { ElementHandle, Page } from '@playwright/test'

import type { Config } from '../packages/interfaces/schemas/v2'
import type Microlc from '../packages/orchestrator/src/web-component'

/**
 * applications:
 *  --> home https://example.com as iframe
 *  --> main (test importmap) /main as compose
 *  --> plain (as application made of compose pages) as compose
 */

const mainApplicationCode = `
  import * as rxjs from 'rxjs'

  window.rxjs = rxjs
`

const js = (literals: TemplateStringsArray, ...vars: string[]): string => {
  if (literals.raw.length === 0) {
    return ''
  }

  const [first] = literals.raw
  const output = (inject: string) => `data:text/javascript;base64,${Buffer.from(inject).toString('base64')}`
  const code = literals.raw.slice(1).reduce((template, el, idx) => {
    return template.concat(`${el}${vars[idx]}`)
  }, first)

  return output(code)
}

const json = (literals: TemplateStringsArray, ...vars: string[]): string => {
  if (literals.raw.length === 0) {
    return ''
  }

  const [first] = literals.raw
  const output = (inject: string) => `data:applicaation/json;base64,${Buffer.from(inject).toString('base64')}`
  const code = literals.raw.slice(1).reduce((template, el, idx) => {
    return template.concat(`${el}${vars[idx]}`)
  }, first)

  return output(code)
}

const html = (literals: TemplateStringsArray, ...vars: string[]): string => {
  if (literals.raw.length === 0) {
    return ''
  }

  const [first] = literals.raw
  const output = (inject: string) => `data:text/html;base64,${Buffer.from(inject).toString('base64')}`
  const code = literals.raw.slice(1).reduce((template, el, idx) => {
    return template.concat(`${el}${vars[idx]}`)
  }, first)

  return output(code)
}

const config: Config = {
  applications: {
    angular12: {
      entry: '/applications/angular12/',
      injectBase: true,
      integrationMode: 'parcel',
      route: './angular12/',
    },
    angular13: {
      entry: '/applications/angular13/',
      injectBase: true,
      integrationMode: 'parcel',
      route: './angular13/',
    },
    angular14: {
      entry: '/applications/angular14/',
      injectBase: true,
      integrationMode: 'parcel',
      route: './angular14/',
    },
    home: {
      integrationMode: 'iframe',
      route: './home',
      src: 'https://example.com',
    },
    main: {
      config: {
        content: {
          properties: { textContent: 'Ciao Main' },
          tag: 'div',
        },
        sources: js`${mainApplicationCode}`,
      },
      integrationMode: 'compose',
      route: './main',
    },
    'override-base': {
      entry: html`
        <!DOCTYPE html>
        <html>
          <head>
            <base href="/another-place/" target="_blank" />
            <script entry>
              window['override-base'] = {
                bootstrap: () => Promise.resolve(),
                mount: () => Promise.resolve(),
                unmount: () => Promise.resolve()
              }
            </script>
          </head>
          <body>
            <button>Go To About Page</button>
            <script async defer>
              const button = document.querySelector('button')
              button.onclick = () => {
                const href = document.querySelector('qiankun-head base')?.href ?? window.location.href
                console.log(href)
                window.history.pushState(null, '', new URL('./about', href).href)
              }
            </script>
          </body>
        </html>
      `,
      injectBase: 'override',
      integrationMode: 'parcel',
      route: './override-base/',
    },
    plain: {
      config: { content: { content: 'Home', tag: 'strong' } },
      integrationMode: 'compose',
      route: './plain/',
    },
    'plain/about': {
      config: { content: { content: 'About', tag: 'div' } },
      integrationMode: 'compose',
      route: './plain/about',
    },
    'plain/details': {
      config: { content: { content: 'Hello', tag: 'div' } },
      integrationMode: 'compose',
      route: './plain/details/',
    },
    react: {
      entry: '/applications/react-browser-router/',
      injectBase: true,
      integrationMode: 'parcel',
      route: './react/',
    },
  },
  importmap: {
    imports: {
      rxjs: 'https://cdn.jsdelivr.net/npm/@esm-bundle/rxjs@7.5.6/esm/es2015/rxjs.min.js',
    },
  },
  layout: {
    content: [
      {
        attributes: {
          'primary-color': '#cd1c8c',
        },
        tag: 'mlc-antd-theme-manager',
      },
      {
        properties: {
          logo: {
            onClickHref: '/home',
            url: '/packages/orchestrator/public/favicon.png',
          },
          menuItems: [
            {
              icon: {
                library: '@ant-design/icons-svg',
                selector: 'HomeOutlined',
              },
              id: 'home',
              label: 'Home',
              type: 'application',
            },
            {
              icon: {
                library: '@fortawesome/free-regular-svg-icons',
                selector: 'faImage',
              },
              id: 'plain',
              label: 'Plain App',
              selectedAlsoOn: ['plain/details', 'plain/about'],
              type: 'application',
            },
            {
              icon: {
                library: '@ant-design/icons-svg',
                selector: 'BugOutlined',
              },
              id: 'react',
              label: 'React Parcel',
              type: 'application',
            },
            {
              icon: {
                library: '@ant-design/icons-svg',
                selector: 'MessageOutlined',
              },
              id: 'angular12',
              label: 'Angular 12 Parcel',
              type: 'application',
            },
            {
              icon: {
                library: '@ant-design/icons-svg',
                selector: 'HeatMapOutlined',
              },
              id: 'angular13',
              label: 'Angular 13 Parcel',
              type: 'application',
            },
            {
              icon: {
                library: '@ant-design/icons-svg',
                selector: 'ApiOutlined',
              },
              id: 'angular14',
              label: 'Angular 14 Parcel',
              type: 'application',
            },
            {
              id: 'override-base',
              label: 'Override Base',
              type: 'application',
            },
          ],
          mode: 'fixedSideBar',
        },
        tag: 'mlc-layout',
      },
    ],
    sources: {
      importmap: {
        imports: {
          react: 'https://esm.sh/react@18.2.0',
          'react-dom': 'https://esm.sh/react-dom@18.2.0',
        },
        scopes: {
          'https://esm.sh/react-dom@next': {
            '/client': 'https://esm.sh/react-dom@18.2.0/client',
          },
        },
      },
      uris: [
        '/packages/layout/dist/mlc-layout.min.js',
        '/packages/layout/dist/mlc-antd-theme-manager.min.js',
      ],
    },
  },
  settings: {
    defaultUrl: './home',
  },
  shared: {
    properties: {
      headers: {
        key: 'value',
      },
    },
  },
  version: 2,
}


const base = `http://localhost:3000`

const goto = async (page: Page, cc: Config, url = base): Promise<ElementHandle<Microlc>> => {
  await page.goto(url, { waitUntil: 'commit' })

  await page.evaluate(async (conf) => {
    await window.customElements.whenDefined('micro-lc')
    const mlc = window.document.querySelector('micro-lc') as Microlc
    mlc.config = conf
  }, cc)
  const microlc = await page.evaluateHandle(() => window.document.querySelector('micro-lc') as Microlc)

  return microlc
}

const data = (literals: TemplateStringsArray): string => {
  const [first] = literals.raw
  return `data:text/javascript;base64,${Buffer.from(first).toString('base64')}`
}

export { base, goto, data, js, json }
export default config
