import type { ResolvedConfig } from '@micro-lc/composer'
import { createComposerContext } from '@micro-lc/composer'
import type { Config, GlobalImportMap, PluginConfiguration } from '@micro-lc/interfaces/v2'
import type { Entry } from 'qiankun'


import { defaultConfig } from '../../config'
import type { ErrorCodes } from '../../logger'
import logger from '../../logger'
import { toArray } from '../../utils/array'
import type { SchemaOptions } from '../../utils/json'
import { invalidJsonCatcher, jsonFetcher, jsonToObject, jsonToObjectCatcher } from '../../utils/json'
import type { Microlc } from '../micro-lc'

import type { MicrolcApi } from './api'
import type { BaseExtension } from './extensions'

const defaultInitOptions: Partial<ESMSInitOptions> = {
  mapOverrides: true,
  shimMode: true,
}

export async function initImportMapSupport(): Promise<void> {
  const { esmsInitOptions } = window
  !esmsInitOptions
    && Object.defineProperty(window, 'esmsInitOptions', {
      configurable: true, value: defaultInitOptions, writable: true,
    })

  const done = Promise.resolve()

  // Load `es-module-shims
  if (!('importShim' in window)) {
    await import('es-module-shims').catch(
      logger.dynamicImportError('es-module-shims')
    )
  }

  return done
}

export const handleInitImportMapError = (err: TypeError): void => {
  logger.error('2' as ErrorCodes.ImportMapError, err.message)
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

export async function updateGlobalImportMap(importmap: GlobalImportMap): Promise<void> {
  importShim.addImportMap(importmap)
  return Promise.resolve()
}

type PremountReturnType = (config: PluginConfiguration) => Promise<ResolvedConfig>

interface ComposerApi {
  createComposerContext: typeof createComposerContext
  premount: PremountReturnType
}

export interface ComposableApplicationProperties<T extends BaseExtension = BaseExtension> {
  composerApi: Partial<ComposerApi>
  config: string | PluginConfiguration | undefined
  injectBase: boolean | undefined
  microlcApi: Partial<MicrolcApi<T>>
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

function getContainer<T extends BaseExtension>(this: Microlc<T>, selector: string | undefined): HTMLElement {
  const selected = selector
    ? this.querySelector<HTMLElement>(selector)
    : this._container
  return selected ?? this._container
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

  const pages = [
    ...errorPages,
    ...Object.entries(applications),
  ]

  const schema = await getApplicationSchema()

  pages.reduce((acc, [id, app], idx) => {
    let injectBase: boolean | undefined = false
    let entry: Entry
    let config: string | PluginConfiguration | undefined
    let properties: Record<string, unknown> | undefined
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
          tag: 'iframe',
        },
      }
      break
    case 'parcel':
    default:
      injectBase = app.injectBase
      entry = typeof app.entry === 'string' ? app.entry : {
        html: app.entry.html,
        scripts: toArray(app.entry.scripts) as string[],
        styles: toArray(app.entry.styles ?? []),
      }
      properties = app.properties
      break
    }

    let idScopedByInstance = id
    const name = `${id}-${window.crypto.randomUUID()}`
    if (idx < errorPages.length) {
      idScopedByInstance = `${this._instance}-${id}`
      acc.mapping.set(name, idScopedByInstance)
    } else {
      acc.mapping.set(name, idScopedByInstance)
      app.route && acc.routes.set(name, app.route)
    }

    acc.apps.set(idScopedByInstance, [app.route, {
      container: getContainer.call<Microlc<T>, [string | undefined], HTMLElement>(this, mountPointSelector),
      entry,
      name,
      props: {
        composerApi: {
          createComposerContext: app.integrationMode !== 'iframe'
            ? createComposerContext
            : (content, opts) => createComposerContext(content, {
              context: {
                ...opts?.context,
                onload() {
                  /** noop */
                },
              },
              extraProperties: [...(opts?.extraProperties ?? []), 'onload'],
            }),
        },
        config,
        injectBase,
        microlcApi: this.getApi() as Partial<MicrolcApi<BaseExtension>>,
        schema,
        ...properties,
      },
    }])

    return acc
  }, {
    apps: this.loadedApps,
    mapping: this.applicationMapping,
    routes: this.loadedRoutes,
  })

  return Promise.resolve()
}
