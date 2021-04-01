import {FromSchema} from 'json-schema-to-ts'

import {headerSchema} from './Header'
import {logoSchema} from './Logo'
import {variableSchema} from './Variable'

export const themingSchema = {
  type: 'object',
  properties: {
    header: headerSchema,
    logo: logoSchema,
    variables: variableSchema,
  },
  required: ['logo', 'variables'],
  additionalProperties: false,
} as const

export type Theming = FromSchema<typeof themingSchema>
