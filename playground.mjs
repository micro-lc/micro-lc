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
          const [oneOfThem, playgroundScope] = folders.reduce(([oneOtThem, prevFolder], folder) => {
            return [oneOtThem || ctx.url.includes(folder), ctx.url.includes(folder) ? folder : prevFolder]
          }, [false, undefined])

          if (oneOfThem) {
            const incoming = ctx.url
            const url = await lstat(resolve(dir, `.${incoming}`))
              .then((stat) => (stat.isFile() ? incoming : playgroundScope))
              .catch(() => playgroundScope)

            // eslint-disable-next-line require-atomic-updates
            ctx.url = url

            return next()
          }

          if (ctx.url.startsWith('/packages') || ctx.url.startsWith('/back-kit')) {
            return next()
          }

          ctx.url = '/index.html'
          return next()
        },
      ],
      open: true,
      plugins: [
        {
          name: 'nonce',
          transform(ctx) {
            function randomString(length) {
              let text = ''
              const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
              for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length))
              }
              return text
            }
            const nonce = randomString(32)
            if (ctx.response.is('html')) {
              return { body: ctx.body.replace(/\*\*CSP_NONCE\*\*/g, nonce) }
            }
          },
        },
      ],
    },
  })
}

main().catch(console.error)
