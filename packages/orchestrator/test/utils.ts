export function base64(literals: TemplateStringsArray, ...values: string[]): string {
  if (literals.raw.length === 0) {
    return ''
  }

  const [first] = literals.raw
  const output = (inject: string) => `data:text/html;base64,${window.btoa(inject)}`
  const code = literals.raw.slice(1).reduce((template, el, idx) => {
    return template.concat(`${el}${values[idx]}`)
  }, first)

  return output(code)
}
