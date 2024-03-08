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
  console.log('✓ asset copied')
})
  .catch(console.error)
