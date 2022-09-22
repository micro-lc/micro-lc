import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { build } from 'esbuild'

const __dirname = dirname(resolve(fileURLToPath(import.meta.url)))

build({
  bundle: true,
  entryPoints: [resolve(__dirname, '../cli/index.ts')],
  minify: true,
  outdir: resolve(__dirname, '../dist/cli'),
  platform: 'node',
}).then(() => {
  console.log('\x1b[32m%s\x1b[0m', `✔ cli compiled successfully`)
}).catch((err) => {
  console.log('\x1b[31m%s\x1b[0m', `✖ cli compiling failed`)
  console.error(err)
})
