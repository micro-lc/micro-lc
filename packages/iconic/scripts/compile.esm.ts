import { build } from 'esbuild'

import settings from '../../../settings.json' assert {type: 'json'}

import entryPoints from './glob.js'

build({
  banner: {
    js: ['/*!', ...settings.banner, '*/'].join('\n'),
  },
  entryPoints,
  format: 'esm',
  outdir: 'dist',
  target: settings.target,
}).then(() => {
  console.log('✓ es module')
}).catch(console.error)
