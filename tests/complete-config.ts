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

const config: Config = {
  applications: {
    // composer_new: {
    //   config: './ingredients_v2.json',
    //   integrationMode: 'compose',
    //   route: './:app/ingredients/',
    // },
    // composer_old: {
    //   entry: '/element-composer/',
    //   integrationMode: 'parcel',
    //   properties: {
    //     configurationName: '../../../../ingredients_v1',
    //   },
    //   route: './ingredients_old',
    // },
    // emptyFrame: {
    //   integrationMode: 'iframe',
    //   route: './empty-frame',
    // },
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
      entry: 'https://micro-lc.io/applications/react-browser-router/',
      injectBase: true,
      integrationMode: 'parcel',
      route: './react/',
    },
    // srcdoc: {
    //   integrationMode: 'iframe',
    //   route: './srcdoc',
    //   srcdoc: '<!DOCTYPE><html><head></head><body>IFrame Content</body></html>',
    // },
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
            // {
            //   href: 'https://docs.mia-platform.eu',
            //   id: 'href_1',
            //   label: 'Link 1',
            //   target: '_blank',
            //   type: 'href',
            // },
            // {
            //   id: 'srcdoc',
            //   label: 'SRCDOC',
            //   type: 'application',
            // },
            // {
            //   children: [
            //     {
            //       id: 'plain',
            //       label: 'Inline',
            //       selectedAlsoOn: ['plain_details', 'plain_about'],
            //       type: 'application',
            //     },
            //     {
            //       id: 'composer_new',
            //       label: 'Composer V2',
            //       type: 'application',
            //     },
            //     {
            //       id: 'composer_old',
            //       label: 'Composer V1',
            //       type: 'application',
            //     },
            //     {
            //       children: [
            //         {
            //           id: 'react',
            //           label: 'React',
            //           type: 'application',
            //         },
            //         {
            //           href: './www.google.com',
            //           id: 'href_2',
            //           label: 'Link 2',
            //           target: '_blank',
            //           type: 'href',
            //         },
            //       ],
            //       id: 'group_1',
            //       label: { en: 'Group 1', it: 'Gruppo 1' },
            //       type: 'group',
            //     },
            //   ],
            //   id: 'category_1',
            //   label: { en: 'Category 1', it: 'Categoria 1' },
            //   type: 'category',
            // },
          ],
          mode: 'fixedSideBar',
          // userMenu: {
          //   userInfoUrl: './userinfo.json',
          // },
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

  const microlc = await page.evaluateHandle(() => window.document.querySelector('micro-lc') as Microlc)
  await page.evaluate(async ([mlc, conf]) => {
    await window.customElements.whenDefined('micro-lc')
    mlc.config = conf
  }, [microlc, cc])

  return microlc
}

const data = (literals: TemplateStringsArray): string => {
  const [first] = literals.raw
  return `data:text/javascript;base64,${Buffer.from(first).toString('base64')}`
}

export { base, goto, data, js, json }
export default config
