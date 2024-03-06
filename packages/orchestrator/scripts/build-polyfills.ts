import { build } from 'esbuild'
import { globSync } from 'glob'

import settings from '../../../settings.json' assert {type: 'json'}

const entryPoints = globSync('src/polyfills/**/*[^d].{j,t}s?(x)')
  .filter((name) => !name.match(/(stories|test)\.(j|t)sx?$/))

build({
  entryPoints,
  outdir: 'dist/polyfills',
  target: settings.target,
}).then(() => {
  console.log('✓ polyfills')
}).catch(console.error)
