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
import type { ComposerOptions, ComposerApi } from '@micro-lc/composer'
import { premount, createComposerContext } from '@micro-lc/composer'
import type { Application, Config, Content, GlobalImportMap, PluginConfiguration } from '@micro-lc/interfaces/v2'
import type { Entry } from 'qiankun'
import type { Observable } from 'rxjs'
import { take } from 'rxjs'


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

export const handleUpdateError = (currentApplication$: Observable<string | undefined>, err: TypeError): void => {
  currentApplication$.pipe(take(1)).subscribe((app) => {
    logger.error('50' as ErrorCodes.UpdateError, app ?? '[unknown]', err.message)
  })
}

export async function fetchConfig(url: string, init?: RequestInit): Promise<Config> {
  return jsonFetcher(url, init)
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

const buildComposer = (mode: Application['integrationMode'], extraProperties: Record<string, unknown>): Partial<ComposerApi> => {
  const defaultComposerApi: ComposerApi = {
    context: extraProperties,
    createComposerContext,
    premount,
  }
  switch (mode) {
  case 'iframe':
    return {
      ...defaultComposerApi,
      createComposerContext: (content: Content, opts: ComposerOptions | undefined) => createComposerContext(content, {
        context: {
          ...opts?.context,
          onload() {
          /** noop */
          },
        },
        extraProperties: new Set([...(opts?.extraProperties ?? []), 'onload']),
      }),
      premount,
    }
  case 'compose':
    return { context: defaultComposerApi.context }
  case 'parcel':
  default:
    return defaultComposerApi
  }
}

const getExtraIFrameAttributes = (app: {attributes?: Record<string, string>; src?: string; srcdoc?: string}) => {
  const extraIframeAttributes: Record<string, string> = {}
  if (typeof app.attributes?.src === 'string') {
    extraIframeAttributes.src = app.attributes.src
  }
  if (typeof app.src === 'string') {
    extraIframeAttributes.src = app.src
  }
  if (typeof app.attributes?.srcdoc === 'string') {
    extraIframeAttributes.srcdoc = app.attributes.srcdoc
  }
  if (typeof app.srcdoc === 'string') {
    extraIframeAttributes.srcdoc = app.srcdoc
  }
  return extraIframeAttributes
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
      shared: {
        properties: sharedProperties,
      },
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
    const name = `${id}-${window.crypto.randomUUID()}`
    switch (app.integrationMode) {
    case 'compose':
      entry = {
        html: `
          <!DOCTYPE html>
          <html>
          <head></head>
          <body><div id="${name}"></div></body>
          </html>
        `,
        scripts: [composerUri],
        styles: [],
      }
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
            ...getExtraIFrameAttributes(app),
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
    if (idx < errorPages.length) {
      idScopedByInstance = `${this._instance}-${id}`
    } else if (app.route !== undefined) {
      acc.routes.set(name, app.route)
    }

    acc.mapping.set(name, idScopedByInstance)
    acc.apps.set(idScopedByInstance, [app.route, {
      container: getContainer.call<Microlc<T>, [string | undefined], HTMLElement>(this, mountPointSelector),
      entry,
      name,
      props: {
        composerApi: buildComposer(app.integrationMode, {
          microlcApi: this.getApi(),
          ...sharedProperties,
        }),
        config,
        injectBase,
        microlcApi: this.getApi() as Partial<MicrolcApi<BaseExtension>>,
        schema,
        ...sharedProperties,
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
