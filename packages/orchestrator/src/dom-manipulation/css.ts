/**
  Copyright 2022 Mia srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
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
