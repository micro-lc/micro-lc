import type { GlobalImportmap, Importmap, Settings } from '@micro-lc/interfaces'
import { html, render } from 'lit-html'

import { compose } from './composer'
import { interpolate } from './composer/compiler'
import { jsonToHtml } from './composer/json'
import { lexer } from './composer/lexer'
import type { CompleteConfig } from './config'
import logger from './logger'
import type MicroLC from './micro-lc'

type CSSRules = Record<string, string | number | undefined>

type CSSNode = Record<string, CSSRules>

interface ImportmapState {
  importmapTag: HTMLScriptElement | undefined
  stack: Importmap[]
}

const MICRO_LC_CSS_PREFIX = '--micro-lc'

const importmapState: ImportmapState = {
  importmapTag: undefined,
  stack: [],
}

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

function appendStyle(
  textContent: string,
  {
    doc = document,
    container = document.head,
  }: {container?: HTMLElement | ShadowRoot; doc?: Document} = {}
) {
  const style = doc.createElement('style')

  container.appendChild(
    Object.assign(style, { textContent })
  )
}

function appendImportMap(
  importmap: GlobalImportmap,
  {
    state = importmapState,
    doc = document,
    options = { useShims: true },
  } = {}
) {
  state.stack.push(importmap)
  if (state.importmapTag === undefined) {
    state.importmapTag = doc.createElement('script')
    state.importmapTag.type = `importmap${options.useShims ? '-shim' : ''}`

    doc.head.appendChild(state.importmapTag)
  }

  state.importmapTag.textContent = JSON.stringify(importmap)
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
function createSandbox(windowObject: Window = window) {
}

function appendMountPoint(
  this: MicroLC,
  { id, slot }: Exclude<Settings['pluginMountPointSelector'], string | undefined>
) {
  const mountPoint = this.ownerDocument.createElement('div')
  mountPoint.setAttribute('id', id)
  slot && mountPoint.setAttribute('slot', slot)

  this.appendChild(mountPoint)
}

export async function setup(this: MicroLC, config: CompleteConfig): Promise<void> {
  const {
    css: {
      global,
      nodes,
    },
    importmap,
    layout,
    settings: {
      pluginMountPointSelector,
    },
  } = config

  // createSandbox()

  // mount-point
  if (this.isShadowDom()) {
    const mountPointAttributes = typeof pluginMountPointSelector === 'object'
      ? pluginMountPointSelector
      : { id: pluginMountPointSelector, slot: undefined }
    appendMountPoint.call(this, mountPointAttributes)
  }

  // css handling
  const container = this.isShadowDom() ? this.renderRoot : this.ownerDocument.head
  const appendOptions = { container, doc: this.ownerDocument }
  nodes && appendStyle(composeStyleSheet(nodes), appendOptions)
  global && appendStyle(
    composeCSSNodeText(this.isShadowDom() ? ':host' : ':root', global, MICRO_LC_CSS_PREFIX),
    appendOptions
  )

  // importmap
  appendImportMap(importmap, { doc: this.ownerDocument })
  await import('es-module-shims').catch(logger.dynamicImportError('es-module-shims'))

  // TODO: qiankun starts here
  // function isPlugin(app: Application): app is ComposableApplication | QiankunApplication {
  //   return app.integrationMode !== 'iframe'
  // }

  // const plugins = applications.filter(isPlugin)

  // // application
  // if (plugins.length !== 0) {
  //   const registrableApps = Array<RegistrableApp<ObjectType>>(plugins.length)
  //   registerMicroApps(
  //     plugins.reduce((apps, { integrationMode, id, route, ...rest }) => {
  //       if (!['compose', 'qiankun'].includes(integrationMode)) {
  //         return apps
  //       }

  //       const application: Partial<RegistrableApp<ObjectType>> = {
  //         activeRule: route,
  //         name: id,
  //       }

  //       switch (integrationMode) {
  //       case 'compose':
  //         application.entry = { scripts: ['/composer/'] }
  //         break
  //       case 'qiankun':
  //       default:
  //         application.entry = (rest as Partial<QiankunApplication>).entry as Entry
  //         break
  //       }

  //       apps.push(application as RegistrableApp<ObjectType>)
  //       return apps
  //     }, registrableApps)
  //   )

  //   setDefaultMountApp(defaultUrl)
  // }

  // TODO: layout
  // layout
  compose(layout.content, this.renderRoot)
}
