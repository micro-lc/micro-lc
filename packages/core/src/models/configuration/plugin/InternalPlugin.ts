import {FromSchema} from 'json-schema-to-ts'

import {externalLinkSchema} from './ExternalLink'

export const internalPluginSchema = {
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
    order: {
      type: 'integer',
      description: 'Plugin registration order',
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
  required: ['id'],
  additionalProperties: false,
} as const

export type InternalPlugin = FromSchema<typeof internalPluginSchema>
