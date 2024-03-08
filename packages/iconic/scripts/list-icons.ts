import { writeFile } from 'fs/promises'
import { createRequire } from 'module'
import { basename, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { globSync } from 'glob'

import { listPhosphorIcons } from './bundle-phosphor-icons.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const require = createRequire(import.meta.url)

interface LibraryData {
  icons: string[]
  meta: {
    name: string
  }
}

const reduceToFiles = (globs: string[]) => globs.reduce<string[]>((names, name) => {
  const filename = basename(name, '.js')
  if (filename) {
    names.push(filename)
  }

  return names
}, [])

const main = async () => {
  const distDir = resolve(__dirname, `../dist`)

  const dict: Record<string, LibraryData> = {}

  const __antDir = `${dirname(require.resolve('@ant-design/icons-svg'))}/asn`
  const __fabDir = dirname(require.resolve('@fortawesome/free-brands-svg-icons'))
  const __fasDir = dirname(require.resolve('@fortawesome/free-solid-svg-icons'))
  const __farDir = dirname(require.resolve('@fortawesome/free-regular-svg-icons'))

  const antd = reduceToFiles(globSync(`${__antDir}/*.js`)).sort()
  const fab = reduceToFiles(globSync(`${__fabDir}/*.js`)).filter((iconName) => iconName.startsWith('fa')).sort()
  const fas = reduceToFiles(globSync(`${__fasDir}/*.js`)).filter((iconName) => iconName.startsWith('fa')).sort()
  const far = reduceToFiles(globSync(`${__farDir}/*.js`)).filter((iconName) => iconName.startsWith('fa')).sort()

  dict['@ant-design/icons-svg'] = { icons: antd, meta: { name: 'Ant Design' } }
  dict['@fortawesome/free-brands-svg-icons'] = { icons: fab, meta: { name: 'Font Awesome Brands' } }
  dict['@fortawesome/free-regular-svg-icons'] = { icons: far, meta: { name: 'Font Awesome Regular' } }
  dict['@fortawesome/free-solid-svg-icons'] = { icons: fas, meta: { name: 'Font Awesome Solid' } }

  const phDict = await listPhosphorIcons()

  await writeFile(`${distDir}/icons-list.json`, JSON.stringify({ ...dict, ...phDict }, null, 2))
}

main()
  .then(() => console.log('✓ icons list'))
  .catch((err) => console.error('Error generating icons list', err))
