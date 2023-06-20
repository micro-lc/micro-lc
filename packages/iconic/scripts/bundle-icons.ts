import {
  basename, dirname, resolve,
} from 'path'

import { build } from 'esbuild'
import { globSync } from 'glob'

import settings from '../../../settings.json'

const reduceToFiles = (globs: string[]) => globs.reduce<string[]>((names, name) => {
  const filename = basename(name, '.js')
  if (filename) {
    names.push(filename)
  }

  return names
}, [])

type LibKey = 'fab' | 'fas' | 'far'

const mapping: Record<LibKey, string> = {
  fab: '@fortawesome/free-brands-svg-icons',
  far: '@fortawesome/free-regular-svg-icons',
  fas: '@fortawesome/free-solid-svg-icons',
}

const __fabDir = dirname(require.resolve('@fortawesome/free-brands-svg-icons'))
const __fasDir = dirname(require.resolve('@fortawesome/free-solid-svg-icons'))
const __farDir = dirname(require.resolve('@fortawesome/free-regular-svg-icons'))
const fab = reduceToFiles(globSync(`${__fabDir}/*.js`))
const fas = reduceToFiles(globSync(`${__fasDir}/*.js`))
const far = reduceToFiles(globSync(`${__farDir}/*.js`))

Promise.all(Object.entries({ fab, far, fas }).map(([key, files]) => {
  const mappingKey = key as LibKey
  console.log(`bundling ${key} folder from icons in ${mapping[mappingKey]}`)
  return build({
    banner: {
      js: `
        /* Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com
        License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
        Copyright 2022 Fonticons, Inc.*/
    ` },
    bundle: true,
    entryPoints: files.map((file) => require.resolve(`${mapping[mappingKey]}/${file}`)),
    format: 'esm',
    legalComments: 'inline',
    minify: true,
    outdir: resolve(__dirname, `../dist/${key}`),
    target: settings.target,
  })
})).then(() => {
  Object.values(mapping).forEach((lib) => {
    console.log(`✓ ${lib}`)
  })
}).catch(console.error)
