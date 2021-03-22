import {FromSchema} from 'json-schema-to-ts'
import {externalLinkSchema} from './ExternalLink'

export const pluginSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'Unique identifier of the plugin',
    },
    allowedGroups: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'List of groups that can access the plugin',
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
    },
    externalLink: externalLinkSchema,
  },
  required: ['id', 'label', 'integrationMode'],
  additionalProperties: false,
} as const

export type Plugin = FromSchema<typeof pluginSchema>
