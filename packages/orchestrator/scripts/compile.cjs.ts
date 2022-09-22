import { build } from 'esbuild'

import entryPoints from './glob'

build({
  entryPoints,
  format: 'cjs',
  outdir: 'dist/cjs',
}).then(() => {
  console.log('✓ cjs module')
}).catch(console.error)
