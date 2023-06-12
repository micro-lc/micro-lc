import { writeFile } from 'fs/promises'
import { basename, dirname, resolve } from 'path'

import { globSync } from 'glob'

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
  const __fasDir = dirname(require.resolve('@fortawesome/free-solid-svg-icons'))
  const __farDir = dirname(require.resolve('@fortawesome/free-regular-svg-icons'))

  const antd = reduceToFiles(globSync(`${__antDir}/*.js`)).sort()
  const fas = reduceToFiles(globSync(`${__fasDir}/*.js`)).filter((iconName) => iconName.startsWith('fa')).sort()
  const far = reduceToFiles(globSync(`${__farDir}/*.js`)).filter((iconName) => iconName.startsWith('fa')).sort()

  dict['@ant-design/icons-svg'] = { icons: antd, meta: { name: 'Ant Design' } }
  dict['@fortawesome/free-regular-svg-icons'] = { icons: far, meta: { name: 'Font Awesome Regular' } }
  dict['@fortawesome/free-solid-svg-icons'] = { icons: fas, meta: { name: 'Font Awesome Solid' } }

  await writeFile(`${distDir}/icons-list.json`, JSON.stringify(dict, null, 2))
}

main()
  .then(() => console.log('✓ icons list'))
  .catch((err) => console.error('Error generating icons list', err))