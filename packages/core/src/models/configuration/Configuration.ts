/*
 * Copyright 2021 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {FromSchema} from 'json-schema-to-ts'

import {analyticsSchema} from './analytics/Analytics'
import {helpMenuSchema} from './helpMenu/HelpMenu'
import {internalPluginSchema} from './plugin/InternalPlugin'
import {pluginRecursiveSchema, pluginSchema} from './plugin/Plugin'
import {rightMenuSchema} from './rightMenu/RightMenu'
import {sharedSchema} from './shared/Shared'
import {themingSchema} from './theming/Theming'

export const configurationSchema = {
  type: 'object',
  properties: {
    theming: themingSchema,
    shared: sharedSchema,
    plugins: {
      type: 'array',
      items: pluginSchema,
    },
    internalPlugins: {
      type: 'array',
      items: internalPluginSchema,
    },
    analytics: analyticsSchema,
    helpMenu: helpMenuSchema,
    rightMenu: rightMenuSchema,
  },
} as const

export const configurationRecursiveSchema = {
  type: 'object',
  properties: {
    theming: themingSchema,
    shared: sharedSchema,
    plugins: {
      type: 'array',
      items: pluginRecursiveSchema,
    },
    internalPlugins: {
      type: 'array',
      items: internalPluginSchema,
    },
    analytics: analyticsSchema,
    helpMenu: helpMenuSchema,
    rightMenu: rightMenuSchema,
  },
} as const

export type Configuration = FromSchema<typeof configurationSchema>
