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
  '@babel/runtime/regenerator/index.js',
  'ajv/dist/ajv.js',
  'ajv-formats/dist/index.js',
  'chai-string/chai-string.js',
]

build({
  ...config,
  define: { 'process.env.NODE_ENV': JSON.stringify('development') },
  entryPoints: depsEntryPoints,
  outdir: resolve(__dirname, '../node_modules'),
}).then(() => {
  console.log('\x1b[32m%s\x1b[0m', `✔ [development] compiled successfully ${depsEntryPoints.join(', ')}`)
}).catch((err) => {
  console.log('\x1b[31m%s\x1b[0m', `✖ [development] failed compiling ${depsEntryPoints.join(', ')}`)
  console.error(err)
})

//
