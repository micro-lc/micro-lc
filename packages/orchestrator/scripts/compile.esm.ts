import { build } from 'esbuild'

import settings from '../../../settings.json'

import entryPoints from './glob'

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
}).catch(console.error)
