import type { CompleteConfig } from '../config'

type CSSRules = Record<string, string | number | undefined>

type CSSNode = Record<string, CSSRules>

const MICRO_LC_CSS_PREFIX = '--micro-lc'

function composeCSSRuleText(rules: CSSRules, prefix?: string): string {
  return Object.keys(rules).reduce((cssText, ruleName) => {
    const ruleValue = rules[ruleName]
    if (ruleValue !== undefined) {
      return cssText.concat(`${prefix ? `${prefix}-` : ''}${ruleName}: ${ruleValue};\n`)
    }
    return cssText
  }, '')
}

function composeCSSNodeText(selector: string, rules: CSSRules, prefix?: string): string {
  return `
    ${selector} {
      ${composeCSSRuleText(rules, prefix)}
    }
  `
}

function composeTextStyleSheet(node: CSSNode, prefix?: string): string {
  return Object.entries(node).reduce((stylesheet, [selector, rules]) => {
    return stylesheet.concat(`${composeCSSNodeText(
      selector,
      rules,
      prefix
    )}\n`)
  }, '')
}

function composeStyleSheet(node: CSSNode, prefix?: string): CSSStyleSheet {
  return Object.entries(node).reduce((stylesheet, [selector, rules]) => {
    stylesheet.insertRule(`${composeCSSNodeText(
      selector,
      rules,
      prefix
    )}\n`)
    return stylesheet
  }, new CSSStyleSheet())
}

export function createCSSStyleSheets(
  { global, nodes }: CompleteConfig['css']
): CSSStyleSheet[] {
  const globalNode = { ':host': global } as CSSNode

  const stylesheets: CSSStyleSheet[] = []
  nodes && stylesheets.push(composeStyleSheet(nodes))
  global && stylesheets.push(composeStyleSheet(globalNode, MICRO_LC_CSS_PREFIX))

  return stylesheets
}

export function createStyleElements(
  { global, nodes }: CompleteConfig['css'],
  [globalTag, nodesTag]: HTMLStyleElement[],
  shadow: boolean
): HTMLStyleElement[] {
  const selector = shadow ? ':host' : ':root'
  const globalNode = { [selector]: global } as CSSNode

  const elements: HTMLStyleElement[] = []

  global && elements.push(Object.assign(
    globalTag, {
      textContent: composeTextStyleSheet(globalNode, MICRO_LC_CSS_PREFIX),
    }
  ))
  nodes && elements.push(Object.assign(
    nodesTag, {
      textContent: composeTextStyleSheet(nodes),
    }
  ))

  return elements
}
