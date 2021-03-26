import {FromSchema} from 'json-schema-to-ts'

import {headerSchema} from './Header'
import {logoSchema} from './Logo'

export const themingSchema = {
  type: 'object',
  properties: {
    header: headerSchema,
    logo: logoSchema,
    variables: {
      type: 'object',
    },
  },
  required: ['logo', 'variables'],
  additionalProperties: false,
} as const

export type Theming = FromSchema<typeof themingSchema>
