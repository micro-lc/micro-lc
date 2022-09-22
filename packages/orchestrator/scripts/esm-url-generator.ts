import { readFileSync } from 'fs'
import { resolve } from 'path'

type Mode = '64' | 'utf8'

const esm = (mode: Mode) => (lit: TemplateStringsArray, ...vars: string[]): string => {
  if (lit.raw.length === 0) {
    return ''
  }

  const [first] = lit.raw
  const output = (inject: string) => `data:text/javascript;${mode === '64' ? 'base64' : 'utf8'},${mode === '64' ? Buffer.from(inject).toString('base64') : encodeURIComponent(inject)}`
  const code = lit.raw.slice(1).reduce((template, el, idx) => {
    return template.concat(`${el}${vars[idx]}`)
  }, first)

  return output(code)
}

(async () => {
  const argv = process.argv.slice(2)
  const [flag] = argv
  let [input] = argv
  let mode: Mode = '64'
  if (['--64', '--utf8'].includes(flag)) {
    input = argv[1]
    mode = flag.slice(2) as Mode
  }

  let template: string
  if ((input as string | undefined) === undefined) {
    throw new TypeError('must input either a string or a valid file path')
  }
  try {
    const entryPoint = resolve(input)
    const text = readFileSync(entryPoint).toString()
    template = text
  } catch (_) {
    console.error(_)
    template = input
  }

  const esmmode = esm(mode)
  return esmmode`${template}`
})()
  .then((output) => {
    console.log('\n👇 find the result here\n')
    console.log(output)
    console.log('\n 👋 Bye!\n')
  })
  .catch(console.error)
