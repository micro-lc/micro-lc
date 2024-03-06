import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { JSDOM } from 'jsdom'
import JSZip from 'jszip'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface IconComponent {
  attrs: Record<string, unknown>
  children: IconComponent[]
  tag: string
}

interface LibraryData {
  icons: string[]
  meta: {
    name: string
  }
}

type Dict = Record<string, LibraryData>

const rootDir = path.resolve(__dirname, '..')
const workingDir = path.resolve(rootDir, 'assets')
const distPhDir = path.resolve(rootDir, 'dist/ph')

const phosphorIconsFilename = 'phosphor-icons.zip'
const phosphorIconsLocalPathname = path.resolve(workingDir, phosphorIconsFilename)

function fromElementToContent(el: Element): IconComponent {
  return Array.from(el.attributes)
    .reduce<IconComponent>((content, attr) => {
      content.attrs[attr.name] = attr.value
      return content
    }, { attrs: {}, children: Array.from(el.children).map((innerElement) => fromElementToContent(innerElement)), tag: el.tagName })
}

const parseIcon = (iconName: string, parser: DOMParser, content: string) => {
  const { firstElementChild } = parser.parseFromString(content, 'text/html').body

  if (!firstElementChild) {
    console.log(parser.parseFromString(content, 'text/html').body.innerHTML)
    throw new TypeError(`no first child in icon ${iconName} with content ${content}`)
  }

  return JSON.stringify({ icon: fromElementToContent(firstElementChild) })
}

const bundlePhosphorIcons = async () =>
  new Promise<void>((resolve, reject) => {
    fs.readFile(phosphorIconsLocalPathname, (err, data) => {
      if (!err) {
        const zip = new JSZip()
        const jsdom = new JSDOM()
        const domParser = new jsdom.window.DOMParser()
        zip.loadAsync(data).then((contents) => {
          Promise.all(
            Object.entries(contents.files)
              .filter(([key, entry]) => key.startsWith('2.0.0/SVGs/') && !entry.dir && entry.name.endsWith('.svg'))
              .map(async ([key, { name }]) => {
                const content = await zip.file(key)?.async('nodebuffer')
                if (!content) {
                  return Promise.resolve()
                }

                const iconPath = path.resolve(distPhDir, name.replace('2.0.0/SVGs/', ''))
                const iconDir = path.dirname(iconPath)
                const iconName = path.basename(iconPath, '.svg')
                await fs.promises.mkdir(iconDir, { recursive: true })

                const defaultExport = `const svg=${parseIcon(iconName, domParser, content.toString('utf-8'))};export default svg`
                return fs.promises.writeFile(path.resolve(iconDir, `${iconName}.js`), defaultExport)
              })
          ).then(() => resolve()).catch(reject)
        }).catch(reject)
      }
    })
  })

const capitalize = (input: string) => `${input.charAt(0).toUpperCase()}${input.substring(1)}`

const listPhosphorIcons = async () =>
  new Promise<Dict>((resolve, reject) => {
    fs.readFile(phosphorIconsLocalPathname, (err, data) => {
      if (!err) {
        const zip = new JSZip()
        zip.loadAsync(data).then((contents) =>
          resolve(
            Object.entries(contents.files)
              .filter(([key, entry]) => key.startsWith('2.0.0/SVGs/') && !entry.dir && entry.name.endsWith('.svg'))
              .reduce<Dict>((dict, [, { name }]) => {
                const [libPostFix, iconName] = name.replace('2.0.0/SVGs/', '').split('/')

                const lib = `phosphor/${libPostFix}`

                const current = (dict[lib] as LibraryData | undefined) ?? { icons: [], meta: { name: `Phosphor ${capitalize(libPostFix)}` } }
                current.icons.push(iconName.replace(/\.svg$/, ''))

                dict[lib] = current

                return dict
              }, {})
          )
        ).catch(reject)
      }
    })
  })

export { listPhosphorIcons }
export default bundlePhosphorIcons
