import type { BaseExtension } from '../apis'
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

export function appendStyleTag<T extends BaseExtension>(
  this: MicroLC<T>,
  tag: HTMLStyleElement,
): HTMLStyleElement {
  return this.isShadowDom()
    ? this.renderRoot.insertBefore(tag, this.renderRoot.firstChild)
    : this.ownerDocument.head.appendChild(tag)
}

function appendStyle<T extends BaseExtension>(
  this: MicroLC<T>,
  textContent: string,
): HTMLStyleElement {
  const style = this.ownerDocument.createElement('style')
  return appendStyleTag
    .call<MicroLC<T>, [HTMLStyleElement], HTMLStyleElement>(
      this, Object.assign(style, { textContent })
    )
}

export function appendCSS<T extends BaseExtension>(
  this: MicroLC<T>, { global, nodes }: CompleteConfig['css']
): HTMLStyleElement[] {
  const styleTags: HTMLStyleElement[] = []
  const shadow = this.isShadowDom()
  const selector = shadow ? ':host' : ':root'
  const globalNode = { [selector]: global } as CSSNode

  if (shadow && 'adoptedStyleSheets' in this.ownerDocument) {
    const stylesheets: CSSStyleSheet[] = []
    nodes && stylesheets.push(composeStyleSheet(nodes))
    global && stylesheets.push(composeStyleSheet(globalNode, MICRO_LC_CSS_PREFIX))
    ;((this.renderRoot as ShadowRoot).adoptedStyleSheets = [...stylesheets])
  } else {
    this.styleTags.forEach((style) => { style.remove() })
    global && styleTags.push(appendStyle
      .call<MicroLC<T>, [string], HTMLStyleElement>(
        this, composeTextStyleSheet(globalNode, MICRO_LC_CSS_PREFIX)
      )
    )
    nodes && styleTags.push(appendStyle
      .call<MicroLC<T>, [string], HTMLStyleElement>(
        this, composeTextStyleSheet(nodes)
      )
    )
  }

  return styleTags
}
