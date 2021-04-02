import {FromSchema} from 'json-schema-to-ts'

import {headerSchema} from './Header'
import {logoSchema} from './Logo'
import {variablesSchema} from './Variables'

export const themingSchema = {
  type: 'object',
  properties: {
    header: headerSchema,
    logo: logoSchema,
    variables: variablesSchema,
  },
  required: ['logo', 'variables'],
  additionalProperties: false,
} as const

export type Theming = FromSchema<typeof themingSchema>
