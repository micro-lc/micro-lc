import {FromSchema} from 'json-schema-to-ts'

export const logoSchema = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      description: 'Logo url',
    },
    alt: {
      type: 'string',
      description: 'Logo alt',
    },
  },
  required: ['url', 'alt'],
} as const

export type Logo = FromSchema<typeof logoSchema>
