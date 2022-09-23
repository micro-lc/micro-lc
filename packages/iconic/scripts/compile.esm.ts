import { build } from 'esbuild'

import entryPoints from './glob'

build({
  entryPoints,
  format: 'esm',
  outdir: 'dist',
}).then(() => {
  console.log('✓ es module')
}).catch(console.error)
