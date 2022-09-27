type CSSRules = Record<string, string | number>

type CSSNode = Record<string, CSSRules>

export interface CSSConfig {
  global?: Record<string, string | number>
  nodes?: Record<string, Record<string, string | number>>
}

function composeCSSRuleText(rules: CSSRules): string {
  return Object.keys(rules).reduce((cssText, ruleName) => {
    const ruleValue = rules[ruleName]
    return cssText.concat(`${ruleName}: ${ruleValue};\n`)
  }, '')
}

function composeCSSNodeText(selector: string, rules: CSSRules): string {
  return `
    ${selector} {
      ${composeCSSRuleText(rules)}
    }
  `
}

function composeTextStyleSheet(node: CSSNode): string {
  return Object.entries(node).reduce((stylesheet, [selector, rules]) => {
    return stylesheet.concat(`${composeCSSNodeText(
      selector,
      rules,
    )}\n`)
  }, '')
}

function composeStyleSheet(node: CSSNode): CSSStyleSheet {
  return Object.entries(node).reduce((stylesheet, [selector, rules]) => {
    stylesheet.insertRule(`${composeCSSNodeText(
      selector,
      rules,
    )}\n`)
    return stylesheet
  }, new CSSStyleSheet())
}

export function createCSSStyleSheets(
  { global, nodes }: CSSConfig
): CSSStyleSheet[] {
  const stylesheets: CSSStyleSheet[] = []
  nodes && stylesheets.push(composeStyleSheet(nodes))
  global && stylesheets.push(composeStyleSheet({ ':host': global }))

  return stylesheets
}

export function injectStyleToElements(
  { global, nodes }: CSSConfig,
  [globalTag, nodesTag]: [HTMLStyleElement, HTMLStyleElement],
  shadow: boolean
): [HTMLStyleElement, HTMLStyleElement] {
  const selector = shadow ? ':host' : ':root'
  const elements: HTMLStyleElement[] = []

  global && elements.push(Object.assign(
    globalTag, {
      textContent: composeTextStyleSheet({ [selector]: global }),
    }
  ))
  nodes && elements.push(Object.assign(
    nodesTag, {
      textContent: composeTextStyleSheet(nodes),
    }
  ))

  return elements as [HTMLStyleElement, HTMLStyleElement]
}
