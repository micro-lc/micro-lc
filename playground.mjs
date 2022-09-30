/* eslint-disable require-atomic-updates */
import { lstatSync } from 'fs'
import { lstat } from 'fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { startDevServer } from '@web/dev-server'
import glob from 'glob'

const dir = dirname(fileURLToPath(import.meta.url))

const folders = glob
  .sync(`${resolve(dir, 'playground')}/*`)
  .filter((path) => lstatSync(path).isDirectory())
  .map((path) => `/playground${path.split('/playground')[1]}`)

const main = async () => {
  await startDevServer({
    config: {
      middleware: [
        async function rewriteIndex(ctx, next) {
          const oneOfThem = [...folders, '/packages/orchestrator', '/packages/layout'].reduce((oneOtThem, folder) => {
            return oneOtThem || ctx.url.includes(folder)
          }, false)

          const url = await Promise.allSettled([
            lstat(resolve(dir, `.${ctx.url}`)),
            lstat(resolve(dir, `.${ctx.url}`, 'index.html')),
          ]).then(([
            { status: directStatus, value: directValue },
            { status: indexStatus, value: indexValue },
          ]) => {
            if (directStatus === 'fulfilled' || indexStatus === 'fulfilled') {
              if (directValue?.isFile()) {
                return ctx.url
              }

              if (indexValue?.isFile()) {
                return ctx.url.endsWith('/') ? `${ctx.url}index.html` : `${ctx.url}/index.html`
              }
            }
          })
          if (oneOfThem && url) {
            ctx.url = url
            return next()
          }

          ctx.url = '/index.html'
          return next()
        },
      ],
      open: true,
    },
  })
}

main().catch(console.error)
