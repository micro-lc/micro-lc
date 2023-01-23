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
import composerUrl from '@micro-lc/composer/composer.production?url'
import type {
  Application,
  Config,
  Content,
  GlobalImportMap,
  PluginConfiguration,
  Settings,
} from '@micro-lc/interfaces/v2'

import page401Url from './assets/401.html?url'
import page404Url from './assets/404.html?url'
import page500Url from './assets/500.html?url'
import { computeAbsoluteRoute } from './web-component/lib'

export const MICRO_LC_MOUNT_POINT = '__MICRO_LC_MOUNT_POINT'

export type CompleteConfig = Required<Pick<Config, 'version' | 'importmap' | 'applications'>> & {
  layout: PluginConfiguration & {content: Content}
  settings: Required<Omit<Settings, 'mountPointSelector' | 'mountPoint'>> & {
    mountPoint?: Settings['mountPoint']
    mountPointSelector?: Settings['mountPointSelector']
  }
  shared: Record<string, unknown> & { properties: Record<string, unknown> }
}

export const defaultConfig: CompleteConfig = {
  applications: {},
  importmap: {} as GlobalImportMap,
  layout: { content: { tag: 'slot' } },
  settings: {
    '4xx': {
      401: {
        entry: page401Url,
        integrationMode: 'parcel',
      },
      404: {
        entry: page404Url,
        integrationMode: 'parcel',
      },
    },
    '5xx': {
      500: {
        entry: page500Url,
        integrationMode: 'parcel',
      },
    },
    composerUri: composerUrl,
    defaultUrl: './',
  },
  shared: { properties: {} },
  version: 2,
}

const patchApplicationsOntoDocument = (document: Document, applications: Record<string, Application>) =>
  Object
    .entries(applications)
    .reduce<Record<string, Application>>((apps, [key, nextApp]) => {
      if ('route' in nextApp) {
        apps[key] = {
          ...nextApp,
          route: computeAbsoluteRoute(document, nextApp.route),
        }
      }

      if ('config' in nextApp && typeof nextApp.config === 'string') {
        apps[key] = {
          ...nextApp,
          config: computeAbsoluteRoute(document, nextApp.config),
        }
      }

      return apps
    }, applications)

export function mergeConfig(document: Document, input: Config): CompleteConfig {
  const def = defaultConfig
  const defaultUrl = computeAbsoluteRoute(
    document, input.settings?.defaultUrl ?? def.settings.defaultUrl
  )
  const applications = patchApplicationsOntoDocument(
    document, input.applications ?? def.applications
  )

  return {
    applications,
    importmap: input.importmap ?? def.importmap,
    layout: {
      ...input.layout,
      content: input.layout?.content ?? def.layout.content,
    },
    settings: {
      '4xx': input.settings?.['4xx'] ?? def.settings['4xx'],
      '5xx': input.settings?.['5xx'] ?? def.settings['5xx'],
      composerUri: input.settings?.composerUri ?? def.settings.composerUri,
      defaultUrl,
      mountPoint: input.settings?.mountPoint ?? def.settings.mountPoint,
      mountPointSelector: input.settings?.mountPointSelector ?? def.settings.mountPointSelector,
    },
    shared: {
      ...input.shared,
      properties: {
        ...(input.shared?.properties ?? def.shared.properties),
      },
    },
    version: 2,
  }
}
