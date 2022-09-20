import type { CompleteConfig } from '../config'
import type MicroLC from '../micro-lc'

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

function composeCSSNodeText(selector: string, rules: CSSRules, prefix?: string) {
  return `
    ${selector} {
      ${composeCSSRuleText(rules, prefix)}
    }
  `
}

function composeStyleSheet(node: CSSNode, prefix?: string): string {
  return Object.entries(node).reduce((stylesheet, [selector, rules]) => {
    return stylesheet.concat(`${composeCSSNodeText(
      selector,
      rules,
      prefix
    )}\n`)
  }, '')
}

export function appendStyleTag(
  this: MicroLC,
  tag: HTMLStyleElement,
): HTMLStyleElement {
  const container = this.isShadowDom() ? this.renderRoot : this.ownerDocument.head
  return container.appendChild(tag)
}

function appendStyle(
  this: MicroLC,
  textContent: string,
): HTMLStyleElement {
  const style = this.ownerDocument.createElement('style')

  return appendStyleTag.call(this, Object.assign(style, { textContent }))
}

export function appendCSS(this: MicroLC, { global, nodes }: CompleteConfig['css']): HTMLStyleElement[] {
  const styleTags: HTMLStyleElement[] = []
  nodes && styleTags.push(appendStyle.call(this, composeStyleSheet(nodes)))
  global && styleTags.push(appendStyle.call(
    this,
    composeCSSNodeText(this.isShadowDom() ? ':host' : ':root', global, MICRO_LC_CSS_PREFIX))
  )

  return styleTags
}
