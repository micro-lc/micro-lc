import { exec } from 'child_process'
import { lstatSync } from 'fs'
import { lstat } from 'fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { startDevServer } from '@web/dev-server'
import { globSync } from 'glob'

const dir = dirname(fileURLToPath(import.meta.url))

const folders = globSync(`${resolve(dir, 'playground')}/*`)
  .filter((path) => lstatSync(path).isDirectory())
  .map((path) => `/playground${path.split('/playground')[1]}`)

const logger = (error, stdout, stderr) => {
  if (error) {
    console.log(`[docker-compose] error: ${error.message}`)
    return
  }
  if (stderr) {
    console.log(`[docker-compose] stderr: ${stderr}`)
    return
  }
  console.log(`[docker-compose] stdout: ${stdout}`)
}

const main = async () => {
  exec('docker-compose --file playground/docker-compose.yml up -d --build --force-recreate', logger)

  await startDevServer({
    config: {
      injectWebSocket: false,
      middleware: [
        async function noCache(ctx, next) {
          ctx.set({ 'Cache-Control': 'no-cache' })
          return next()
        },
        async function accessControl(ctx, next) {
          ctx.set({ 'Access-Control-Allow-Origin': '*' })
          return next()
        },
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

main()
  .then(() => {
    console.log('\n\tRemind dropping docker-compose environment\n')
    console.log('\n\tRun: `docker-compose --file playground/docker-compose.yml down`\n')
  })
  .catch(console.error)
