import {FromSchema} from 'json-schema-to-ts'

export const logoSchema = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      description: 'Url del logo',
    },
    alt: {
      type: 'string',
      description: 'Alt del logo',
    },
  },
  required: ['url', 'alt'],
} as const

export type Logo = FromSchema<typeof logoSchema>
