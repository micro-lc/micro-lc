import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { build } from 'esbuild'

import settings from '../../../settings.json' assert {type: 'json'}

const __dirname = dirname(resolve(fileURLToPath(import.meta.url)))

build({
  banner: {
    js: '#!/usr/bin/env node',
  },
  bundle: true,
  entryPoints: [resolve(__dirname, '../src/cli/index.ts')],
  minify: true,
  outdir: resolve(__dirname, '../dist/cli'),
  platform: 'node',
  target: settings.target,
}).then(() => {
  console.log('\x1b[32m%s\x1b[0m', `✔ cli compiled successfully`)
}).catch((err) => {
  console.log('\x1b[31m%s\x1b[0m', `✖ cli compiling failed`)
  console.error(err)
})
