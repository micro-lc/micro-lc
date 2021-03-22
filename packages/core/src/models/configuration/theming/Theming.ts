import {FromSchema} from 'json-schema-to-ts'

import {headerSchema} from './Header'

export const themingSchema = {
  type: 'object',
  properties: {
    header: headerSchema,
    logo: {
      type: 'string',
      description: 'Url del logo',
    },
    variables: {
      type: 'object',
    },
  },
  required: ['logo', 'variables'],
  additionalProperties: false,
} as const

export type Theming = FromSchema<typeof themingSchema>
