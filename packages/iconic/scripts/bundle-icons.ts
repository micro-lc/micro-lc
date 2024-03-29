import { createRequire } from 'module'
import {
  basename, dirname, resolve,
} from 'path'
import { fileURLToPath } from 'url'

import { build } from 'esbuild'
import { globSync } from 'glob'

import settings from '../../../settings.json' assert {type: 'json'}

import bundlePhosphorIcons from './bundle-phosphor-icons.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const require = createRequire(import.meta.url)

const reduceToFiles = (globs: string[]) => globs.reduce<string[]>((names, name) => {
  const filename = basename(name, '.js')
  if (filename) {
    names.push(filename)
  }

  return names
}, [])

type LibKey = 'fab' | 'fas' | 'far' | 'ant'

const mapping: Record<LibKey, string> = {
  ant: '@ant-design/icons-svg',
  fab: '@fortawesome/free-brands-svg-icons',
  far: '@fortawesome/free-regular-svg-icons',
  fas: '@fortawesome/free-solid-svg-icons',
}

const __fabDir = dirname(require.resolve('@fortawesome/free-brands-svg-icons'))
const __fasDir = dirname(require.resolve('@fortawesome/free-solid-svg-icons'))
const __farDir = dirname(require.resolve('@fortawesome/free-regular-svg-icons'))
const __antDir = resolve(dirname(require.resolve('@ant-design/icons-svg')), '../es/asn')

const fab = reduceToFiles(globSync(`${__fabDir}/*.js`))
const fas = reduceToFiles(globSync(`${__fasDir}/*.js`))
const far = reduceToFiles(globSync(`${__farDir}/*.js`))
const ant = reduceToFiles(globSync(`${__antDir}/*.js`))

Promise.all([bundlePhosphorIcons(), ...Object.entries({ ant, fab, far, fas }).map(([key, files]) => {
  const mappingKey = key as LibKey
  console.log(`bundling ${key} folder from icons in ${mapping[mappingKey]}`)
  return build({
    ...(key !== 'ant' && { banner: {
      js: `
        /* Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com
        License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
        Copyright 2022 Fonticons, Inc.*/
    ` },
    }),
    bundle: true,
    entryPoints: files.map((file) => (key === 'ant' ? `${__antDir}/${file}` : require.resolve(`${mapping[mappingKey]}/${file}`))),
    format: 'esm',
    legalComments: 'inline',
    minify: true,
    outdir: resolve(__dirname, `../dist/${key}`),
    target: settings.target,
  })
})]).then(() => {
  Object.values({ ...mapping, ph: 'phosphor' }).forEach((lib) => {
    console.log(`✓ ${lib}`)
  })
}).catch(console.error)
