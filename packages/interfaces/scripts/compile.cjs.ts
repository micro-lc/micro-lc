import { build } from 'esbuild'

import settings from '../../../settings.json'

import entryPoints from './glob'

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
}).catch(console.error)
