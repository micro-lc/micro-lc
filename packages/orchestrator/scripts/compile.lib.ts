import fs from 'fs/promises'

import { build } from 'esbuild'

import settings from '../../../settings.json' assert {type: 'json'}

import entryPoints from './glob.js'

build({
  banner: {
    js: ['/*!', ...settings.banner, '*/'].join('\n'),
  },
  entryPoints,
  format: 'esm',
  outdir: 'dist/es',
  target: settings.target,
}).then(() => {
  console.log('✓ es module')
}).then(async () => {
  await fs.cp('src/assets', 'dist/es/assets', { recursive: true })
  console.log('✓ asset copied to dist/es/assets')
})
  .catch(console.error)

build({
  banner: {
    js: ['/*!', ...settings.banner, '*/'].join('\n'),
  },
  entryPoints,
  format: 'cjs',
  outdir: 'dist/cjs',
  target: settings.target,
}).then(() => {
  console.log('✓ cjs module')
}).then(async () => {
  await fs.cp('src/assets', 'dist/cjs/assets', { recursive: true })
  console.log('✓ asset copied to dist/cjs/assets')
})
  .catch(console.error)
