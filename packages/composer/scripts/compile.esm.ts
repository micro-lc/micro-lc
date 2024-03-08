import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { build } from 'esbuild'

import settings from '../../../settings.json' assert {type: 'json'}

import entryPoints from './glob.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

build({
  banner: {
    js: ['/*!', ...settings.banner, '*/'].join('\n'),
  },
  entryPoints,
  format: 'esm',
  outdir: 'dist/lib',
  target: settings.target,
}).then(() => {
  console.log('✓ es module')
}).catch(console.error)

build({
  banner: {
    js: ['/*!', ...settings.banner, '*/'].join('\n'),
  },
  bundle: true,
  entryPoints: [resolve(__dirname, '..', 'src/lib/index.ts')],
  format: 'esm',
  minify: true,
  outfile: 'dist/bundle/index.min.js',
  target: settings.target,
}).then(() => {
  console.log('✓ es module bundle')
}).catch(console.error)
