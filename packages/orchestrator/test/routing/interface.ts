import type { Entry, LoadableApp } from 'qiankun'

import type { MicrolcDefaultConfig, ComposableApplicationProperties } from '../../src'
import { createQiankunInstance } from '../../src'
import type { RouterContainer } from '../../src/web-component/lib/router'
import { MatchCache } from '../../src/web-component/lib/router'

export class Router implements RouterContainer {
  applicationMapping = new Map<string, string>()
  config!: MicrolcDefaultConfig
  instance = '78006fe0-3567-423f-b747-0d330c215c85'
  loadedApps = new Map<string, [string | undefined, LoadableApp<ComposableApplicationProperties>]>()
  loadedRoutes = new Map<string, string>()
  matchCache = new MatchCache()
  ownerDocument = document
  qiankun = createQiankunInstance()
}

enum TemplateMode {
  HTML = 'text/html',
  JS = 'text/javascript'
}

const template = (mode: TemplateMode) => (lit: TemplateStringsArray, ...vars: string[]): string => {
  if (lit.raw.length === 0) {
    return ''
  }

  const [first] = lit.raw
  const output = (inject: string) => `data:${mode};base64,${window.btoa(inject)}`
  const code = lit.raw.slice(1).reduce((te, el, idx) => {
    return te.concat(`${el}${vars[idx]}`)
  }, first)

  return output(code)
}

export const templateHTML = template(TemplateMode.HTML)
export const templateJS = template(TemplateMode.JS)

const entryError = templateHTML`
  <!DOCTYPE html>
  <html lang="en">
  <head></head>
  <body>
    <div>Error</div>
    <script>
      function fn(global) {
        Object.assign(
          global,
          '4xx',
          {
            bootstrap: () => Promise.resolve(),
            mount: () => Promise.resolve(),
            unmount: () => Promise.resolve(null),
            update: () => Promise.resolve()
          }
        )
      }
      ;(function register(global, factory) {
        global.__MICRO_LC_4XX = {}
        factory(global.__MICRO_LC_4XX, global)
      })(window, fn)
    </script>
  </body>
  </html>
`

const entryApp = templateJS`
  function fn(exports, _) {
    Object.assign(exports, {
      async bootstrap() {
        return Promise.resolve(null)
      },

      async mount({container, name}) {
        container.appendChild(Object.assign(document.createElement('div'), {textContent: name}))
        return Promise.resolve(null)
      },

      async unmount({container}) {
        for(const child of container.children) {
          child.remove()
        }
        return Promise.resolve(null)
      },

      async update() {
        return Promise.resolve(null)
      },
    })
  }

  (function register(global, factory) {
    global.__APP = {}
    factory(global.__APP, global)
  }(window, fn))
`

export function createRouter(
  applications: Record<string, string | {entry: Entry; route: string}>,
  container: HTMLElement,
  defaultUrl = './'
): Router {
  const router = Object.assign<Router, {config: MicrolcDefaultConfig}>(new Router(), {
    config: {
      applications: {},
      importmap: {},
      layout: { content: { tag: 'slot' } },
      settings: {
        '4xx': {},
        '5xx': {},
        composerUri: './composer.test.js',
        defaultUrl,
        mountPoint: '',
        mountPointSelector: '__MICRO_LC_MOUNT_POINT',
      },
      shared: { properties: {} },
      version: 2,
    },
  })

  Object.entries(applications).forEach(([name, routeOrEntry]) => {
    const route = typeof routeOrEntry === 'string' ? routeOrEntry : routeOrEntry.route
    const entry = typeof routeOrEntry === 'string' ? { scripts: [entryApp] } : routeOrEntry.entry
    const qiankunId = `${name}-${window.crypto.randomUUID()}`
    router.applicationMapping.set(qiankunId, name)
    router.loadedRoutes.set(qiankunId, route)
    router.loadedApps.set(name, [route, {
      container,
      entry,
      name: qiankunId,
    }])
  }, {})

  router.loadedApps.set(`${router.instance}-401`, [undefined, {
    container,
    entry: entryError,
    name: `${router.instance}-401`,
  }])
  router.loadedApps.set(`${router.instance}-404`, [undefined, {
    container,
    entry: entryError,
    name: `${router.instance}-404`,
  }])
  router.loadedApps.set(`${router.instance}-500`, [undefined, {
    container,
    entry: entryError,
    name: `${router.instance}-500`,
  }])

  return router
}

export const getQiankunId = (router: Router, name: string): string | undefined =>
  router.loadedApps.get(name)?.[1]?.name

