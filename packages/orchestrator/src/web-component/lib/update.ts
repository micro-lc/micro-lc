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
import type { ComposerApi } from '@micro-lc/composer'
import type {
  Application,
  Config,
  GlobalImportMap,
  PluginConfiguration,
} from '@micro-lc/interfaces/v2'
import type { Observable } from 'rxjs'
import { take } from 'rxjs'


import { defaultConfig } from '../../config'
import type { ErrorCodes } from '../../logger'
import logger from '../../logger'
import type { SchemaOptions } from '../../utils/json'
import { invalidJsonCatcher, jsonFetcher, jsonToObject, jsonToObjectCatcher } from '../../utils/json'
import type { Microlc } from '../micro-lc'

import type { MicrolcApi, MicrolcEvent } from './api'
import type { BaseExtension } from './extensions'
import { prepareApplicationConfig } from './mfe-loader'

const defaultInitOptions: Partial<ESMSInitOptions> = {
  mapOverrides: true,
  shimMode: true,
}

export const COMPOSER_BODY_CLASS = 'composer-body'

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

export interface ComposableApplicationProperties<T extends BaseExtension = BaseExtension, E extends MicrolcEvent = MicrolcEvent> extends Record<string, unknown> {
  composerApi: Partial<ComposerApi>
  config: string | PluginConfiguration | undefined
  injectBase: boolean | 'override' | undefined
  microlcApi: Partial<MicrolcApi<T, E>>
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

function getContainer<T extends BaseExtension, _ extends MicrolcEvent>(this: Microlc<T, _>, selector: string | undefined): HTMLElement {
  const selected = selector
    ? this.querySelector<HTMLElement>(selector)
    : this._container
  return selected ?? this._container
}

export async function updateApplications<T extends BaseExtension, E extends MicrolcEvent>(this: Microlc<T, E>): Promise<void> {
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

  pages.reduce((acc, [id, app], idx) => {
    const { name, makeConfig } = prepareApplicationConfig<T, E>(id, app as Application, composerUri)
    const container = getContainer.call<Microlc<T, E>, [string | undefined], HTMLElement>(this, mountPointSelector)

    let idScopedByInstance = id
    if (idx < errorPages.length) {
      idScopedByInstance = `${this._instance}-${id}`
    } else if (app.route !== undefined) {
      acc.routes.set(name, app.route)
    }

    acc.mapping.set(name, idScopedByInstance)
    acc.apps.set(idScopedByInstance, [app.route, makeConfig(container, this.getApi(), sharedProperties)])

    return acc
  }, {
    apps: this.loadedApps,
    mapping: this.applicationMapping,
    routes: this.loadedRoutes,
  })

  return Promise.resolve()
}
