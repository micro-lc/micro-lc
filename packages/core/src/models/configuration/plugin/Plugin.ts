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

import {externalLinkSchema} from './ExternalLink'

export const pluginSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'Unique identifier of the plugin',
    },
    aclExpression: {
      type: 'string',
      description: 'Expression to evaluate the users that can access the plugin',
    },
    label: {
      type: 'string',
      description: 'Label visualized in the side menu',
    },
    icon: {
      type: 'string',
      description: 'Icon visualized in the side menu',
    },
    order: {
      type: 'integer',
      description: 'Position of the plugin in the side menu',
    },
    category: {
      type: 'string',
      description: 'Sub-menu category in which insert the plugin',
    },
    content: {
      type: 'array',
      items: {$ref: '#'},
    },
    integrationMode: {
      type: 'string',
      enum: ['href', 'qiankun', 'iframe'],
      description: 'Way in which the plugin is integrated.',
    },
    pluginRoute: {
      type: 'string',
      description: 'Path on which the plugin will be rendered',
    },
    pluginUrl: {
      type: 'string',
      description: 'Entry of the plugin',
    },
    props: {
      type: 'object',
      description: 'Data passed to the plugin',
      additionalProperties: true,
    },
    externalLink: externalLinkSchema,
  },
  required: ['id', 'label', 'integrationMode'],
  additionalProperties: false,
} as const

export const pluginRecursiveSchema = {
  type: 'object',
  $recursiveAnchor: true,
  properties: {
    id: {
      type: 'string',
      description: 'Unique identifier of the plugin',
    },
    aclExpression: {
      type: 'string',
      description: 'Expression to evaluate the users that can access the plugin',
    },
    label: {
      type: 'string',
      description: 'Label visualized in the side menu',
    },
    icon: {
      type: 'string',
      description: 'Icon visualized in the side menu',
    },
    order: {
      type: 'integer',
      description: 'Position of the plugin in the side menu',
    },
    category: {
      type: 'string',
      description: 'Sub-menu category in which insert the plugin',
    },
    content: {
      type: 'array',
      items: {$recursiveRef: '#'},
    },
    integrationMode: {
      type: 'string',
      enum: ['href', 'qiankun', 'iframe'],
      description: 'Way in which the plugin is integrated.',
    },
    pluginRoute: {
      type: 'string',
      description: 'Path on which the plugin will be rendered',
    },
    pluginUrl: {
      type: 'string',
      description: 'Entry of the plugin',
    },
    props: {
      type: 'object',
      description: 'Data passed to the plugin',
      additionalProperties: true,
    },
    externalLink: externalLinkSchema,
  },
  required: ['id', 'label', 'integrationMode'],
  additionalProperties: false,
} as const

export type Plugin = FromSchema<typeof pluginSchema>
