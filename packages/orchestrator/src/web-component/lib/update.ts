import type { Config, PluginConfiguration } from '@micro-lc/interfaces/v2'
import type { Entry } from 'qiankun'

import type { ResolvedConfig } from '../../composer'
import { createComposerContext, premount } from '../../composer'
import { defaultConfig } from '../../config'
import { assignContent } from '../../dom-manipulation'
import logger from '../../logger'
import { toArray } from '../../utils/array'
import type { SchemaOptions } from '../../utils/json'
import { invalidJsonCatcher, jsonFetcher, jsonToObject, jsonToObjectCatcher } from '../../utils/json'
import type { Microlc } from '../micro-lc'

import type { MicrolcApi } from './api'
import type { BaseExtension } from './extensions'

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

export async function fetchConfig(url: string): Promise<Config> {
  return jsonFetcher(url)
    .then((json) => {
      if (process.env.NODE_ENV === 'development') {
        return Promise.all<[unknown, SchemaOptions]>([
          Promise.resolve(json),
          import('../../utils/schemas').then<SchemaOptions | undefined>((schemas) => ({
            id: schemas.configSchema.$id,
            parts: schemas,
          })),
        ])
      }
      return [json, undefined] as [unknown, SchemaOptions | undefined]
    })
    .then(([json, schema]) =>
      jsonToObject<Config>(json, schema)
        .catch((err: TypeError) =>
          jsonToObjectCatcher<Config>(
            err, defaultConfig, '"micro-lc config"'
          )
        )
    )
    .catch((err: TypeError) =>
      invalidJsonCatcher<Config>(
        err, defaultConfig, '"micro-lc config"'
      )
    )
}

export function updateGlobalImportMap<T extends BaseExtension>(this: Microlc<T>) {
  const {
    _config: {
      importmap,
    },
  } = this

  if (this._disableShims || !('importShim' in window)) {
    assignContent(this._globalImportmap, importmap)
    !this._globalImportmap.isConnected && this.ownerDocument.head.appendChild(this._globalImportmap)

    return
  }

  importShim.addImportMap(importmap)
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
    schema = await import('../../utils/schemas').then<SchemaOptions>((schemas) => ({
      id: schemas.pluginSchema.$id,
      parts: schemas,
    }))
  }

  return schema
}

function getContainer<T extends BaseExtension>(this: Microlc<T>, selector: string): HTMLElement {
  // SAFETY: has been mounted on update lifecycle

  return this.querySelector<HTMLElement>(selector) ?? this
}

export async function updateApplications<T extends BaseExtension>(this: Microlc<T>): Promise<void> {
  const {
    _config: {
      settings: {
        '4xx': pages4xx,
        '5xx': pages5xx,
        composerUri,
        mountPointSelector,
      },
      applications,
    },
  } = this

  const errorPages = [
    ...Object.entries(pages4xx),
    ...Object.entries(pages5xx),
  ]

  errorPages.forEach(([statusCode, uri]) => {
    const name = `${this._instance}-${statusCode}`
    let entry: Entry
    switch (uri.match(/\.([^.]+)$/)?.[0]) {
    case 'js':
      entry = { scripts: [uri] }
      break
    case 'html':
      entry = { html: uri }
      break
    default:
      entry = uri
      break
    }
    this._loadedApps.set(name, [undefined, {
      container: getContainer.call<Microlc<T>, [string], HTMLElement>(this, mountPointSelector),
      entry,
      name,
    }])
  })

  const schema = await getApplicationSchema()

  Object.entries(applications).reduce((acc, [id, app]) => {
    let entry: Entry
    let config: string | PluginConfiguration | undefined
    switch (app.integrationMode) {
    case 'compose':
      entry = { scripts: [composerUri] }
      config = typeof app.config === 'string'
        ? app.config
        : { ...app.config }
      break
    case 'iframe':
      entry = { scripts: [composerUri] }
      config = {
        content: {
          attributes: {
            style: `width: inherit;
                    height: inherit;
                    border: none;`,
            ...app.attributes,
            src: app.src,
          },
          content: {
            content: 'Your browser does not support iframes',
            tag: 'p',
          },
          properties: {
            onerror: 'onerror',
            onload: 'onload',
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

    acc.routes.set(id, app.route)
    acc.apps.set(id, [app.route, {
      container: getContainer.call<Microlc<T>, [string], HTMLElement>(this, mountPointSelector),
      entry,
      name: id,
      props: {
        composerApi: {
          createComposerContext: app.integrationMode !== 'iframe'
            ? createComposerContext.bind(this)
            : (content) => createComposerContext.call(this, content, {
              context: {
                onload() {
                  /** noop */
                },
              },
              extraProperties: ['onload'],
            }),
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
