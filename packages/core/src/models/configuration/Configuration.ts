import {FromSchema} from 'json-schema-to-ts'

import {pluginSchema} from './plugin/Plugin'
import {themingSchema} from './theming/Theming'

export const configurationSchema = {
  type: 'object',
  properties: {
    theming: themingSchema,
    plugins: {
      type: 'array',
      items: pluginSchema,
    },
  },
} as const

export type Configuration = FromSchema<typeof configurationSchema>
