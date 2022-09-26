import type { PluginConfiguration } from '@micro-lc/interfaces'
import type { Entry } from 'qiankun'

import type { ResolvedConfig } from '../composer'
import { createComposerContext, premount } from '../composer'
import { createStyleElements, createCSSStyleSheets, assignContent } from '../dom'
import logger from '../logger'
import { toArray } from '../utils/array'
import type { SchemaOptions } from '../utils/json'

import type { MicrolcApi } from './core'
import type { BaseExtension } from './extensions'
import type { Microlc } from './micro-lc'

interface ESMSInitOptions {
  mapOverride?: boolean
  shimMode?: boolean
}

export async function initImportMapSupport<T extends BaseExtension>(this: Microlc<T>) {
  let optScript = this.ownerDocument
    .querySelector('script[type=esms-options]')

  if (!optScript) {
    optScript = Object.assign(this.ownerDocument.createElement('script'), {
      textContent: '{}',
      type: 'esms-options',
    })
  }

  const { textContent } = optScript as HTMLScriptElement
  const options = JSON.parse(textContent ?? '{}') as ESMSInitOptions
  optScript.textContent = JSON.stringify({
    ...options,
    mapOverride: true,
    shimMode: !this._disableShims,
  } as ESMSInitOptions)

  if (!optScript.isConnected) {
    this._esmsOptionsScript = optScript as HTMLScriptElement
    this.ownerDocument.head.appendChild(optScript)
  }

  // Load `es-module-shims`
  await import('es-module-shims').catch(
    logger.dynamicImportError('es-module-shims')
  )
}

export const handleInitImportMapError = (_: TypeError): void => {
  console.error(_)
}

export function createHistoryProxy<T extends BaseExtension>(this: Microlc<T>): History {
  this._$$originalHistory = window.history

  return window.history
}

export function updateCSS<T extends BaseExtension>(this: Microlc<T>): void {
  const {
    _config: {
      css,
    },
  } = this

  this._styleTags.forEach((style) => { style.remove() })

  if (this._isShadow() && 'adoptedStyleSheets' in this.ownerDocument) {
    const stylesheets = createCSSStyleSheets(css)
    this.shadowRoot.adoptedStyleSheets = stylesheets
  } else {
    const styleTags = Array(2).fill(0).map(() => this.ownerDocument.createElement('style'))
    this._styleTags = createStyleElements(css, styleTags, this._isShadow())
    this._styleTags.forEach((el) => {
      this._isShadow()
        ? this.shadowRoot.insertBefore(el, this.shadowRoot.firstChild)
        : this.ownerDocument.head.appendChild(el)
    })
  }
}

export function updateGlobalImportapMap<T extends BaseExtension>(this: Microlc<T>) {
  const {
    _config: {
      importmap,
    },
  } = this

  const currentType = this._globalImportmap.type
  const newType = this._disableShims ? 'importmap' : 'importmap-shim'
  if (currentType !== newType) {
    this._globalImportmap.type = newType
  }

  assignContent(this._globalImportmap, importmap)
  !this._globalImportmap.isConnected && this.ownerDocument.head.appendChild(this._globalImportmap)
}

type PremountReturnType =
  (id: string, config: PluginConfiguration) => Promise<ResolvedConfig>

interface ComposerApi {
  createComposerContext: typeof createComposerContext
  premount: PremountReturnType
}

export interface ComposableApplicationProperties<T extends BaseExtension = BaseExtension> {
  composerApi: ComposerApi
  config: string | PluginConfiguration | undefined
  microlcApi: MicrolcApi<T>
  schema: SchemaOptions | undefined
}

export async function getApplicationSchema(): Promise<SchemaOptions | undefined> {
  let schema: SchemaOptions | undefined
  if (process.env.NODE_ENV === 'development') {
    schema = await import('../utils/schemas').then<SchemaOptions>((schemas) => ({
      id: schemas.pluginSchema.$id,
      parts: schemas,
    }))
  }

  return schema
}

export async function updateApplications<T extends BaseExtension>(this: Microlc<T>): Promise<void> {
  const {
    _config: {
      settings: {
        // defaultUrl,
        pluginMountPointSelector,
      },
      applications,
    },
  } = this

  const composerUrl = `./composer-plugin.${process.env.NODE_ENV}.js`
  const schema = await getApplicationSchema()

  applications.reduce((acc, app) => {
    const { id, route } = app

    let entry: Entry
    let config: string | PluginConfiguration | undefined
    switch (app.integrationMode) {
    case 'compose':
      entry = { scripts: [composerUrl] }
      config = typeof app.config === 'string'
        ? app.config
        : { ...app.config }
      break
    case 'iframe':
      entry = { scripts: [composerUrl] }
      config = {
        content: {
          attributes: {
            style: `width: 100%;
                    height: 100%;
                    position: fixed;
                    border: none;`,
            ...app.attributes,
            src: app.src,
          },
          tag: 'iframe',
        },
      }
      break
    case 'qiankun':
    default:
      entry = typeof app.entry === 'string' ? app.entry : {
        html: app.entry.html,
        scripts: toArray(app.entry.scripts) as string[],
        styles: toArray(app.entry.styles ?? []),
      }
      break
    }

    acc.routes.set(id, route)
    acc.apps.set(id, [route, {
      // SAFETY: has been mounted on update lifecycle
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      container: this.querySelector<HTMLElement>(`#${pluginMountPointSelector.id}`)!,
      entry,
      name: id,
      props: {
        composerApi: {
          createComposerContext: createComposerContext.bind(this),
          premount: premount
            .bind<PremountReturnType>(this),
        },
        config,
        microlcApi: this.getApi(),
        schema,
      },
    }])

    return acc
  }, { apps: this._loadedApps, routes: this._loadedRoutes })

  return Promise.resolve()
}

export const handleUpdateError = (_: TypeError): void => {
  console.error(_)
}
