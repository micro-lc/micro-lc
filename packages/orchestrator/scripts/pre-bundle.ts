import { resolve } from 'path'

import { build } from 'esbuild'
import type { BuildOptions } from 'esbuild'

import target from './target'

const config: BuildOptions = {
  bundle: true,
  format: 'esm',
  minify: true,
  target,
}

// lib dependencies

const depsEntryPoints = [
  'ajv/dist/ajv.js',
  'ajv-formats/dist/index.js',
  '@babel/runtime/regenerator/index.js',
]

build({
  ...config,
  define: { 'process.env.NODE_ENV': 'development' },
  entryPoints: depsEntryPoints,
  outdir: resolve(__dirname, '../node_modules'),
}).catch(console.error)

//

// external dependency

const modes = ['development', 'production']
Promise.all(modes.map(async (mode) => {
  return build({
    ...config,
    define: { 'process.env.NODE_ENV': JSON.stringify(mode) },
    entryPoints: ['./src/composer-plugin.ts'],
    outfile: resolve(__dirname, `../dist/composer.${mode}.js`),
  })
})).catch(console.error)

//
