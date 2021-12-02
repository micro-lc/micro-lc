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

const webComponentConfigSchema = {
  type: 'object',
  additionalProperties: true,
} as const

export const rightMenuItemSchema = {
  type: 'object',
  properties: {
    entry: {
      type: 'string',
      description: 'Entry point of the web component',
    },
    tag: {
      type: 'string',
      description: 'Tag that will be used to mount the web component inside the DOM',
    },
    attributes: webComponentConfigSchema,
    properties: webComponentConfigSchema,
  },
  required: ['tag', 'entry'],
  additionalProperties: false,
} as const

export type RightMenuItem = FromSchema<typeof rightMenuItemSchema>

export const rightMenuSchema = {
  type: 'array',
  items: rightMenuItemSchema,
} as const

export type RightMenu = FromSchema<typeof rightMenuSchema>
