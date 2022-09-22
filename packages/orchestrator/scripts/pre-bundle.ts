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
}).then(() => {
  console.log('\x1b[32m%s\x1b[0m', `✔ [development] compiled successfully ${depsEntryPoints.join(', ')}`)
}).catch((err) => {
  console.log('\x1b[31m%s\x1b[0m', `✖ [development] failed compiling ${depsEntryPoints.join(', ')}`)
  console.error(err)
})

//

// external dependency

const modes = ['development', 'production']
const composerEntryPoints = ['../src/composer-plugin.ts'].map((path) => resolve(__dirname, path))
Promise.all(modes.map(async (mode) => {
  return build({
    ...config,
    define: { 'process.env.NODE_ENV': JSON.stringify(mode) },
    entryPoints: composerEntryPoints,
    outfile: resolve(__dirname, `../dist/composer-plugin.${mode}.js`),
  }).then(() => {
    console.log('\x1b[32m%s\x1b[0m', `✔ [${mode}] compiled successfully ${composerEntryPoints.join(', ')}`)
  }).catch((err) => {
    console.log('\x1b[31m%s\x1b[0m', `✖ [${mode}] failed compiling ${composerEntryPoints.join(', ')}`)
    console.error(err)
  })
})).catch(console.error)

//
