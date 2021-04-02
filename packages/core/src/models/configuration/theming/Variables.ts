import {FromSchema} from 'json-schema-to-ts'

export const variablesSchema = {
  type: 'object',
  properties: {
    primaryColor: {
      type: 'string',
      description: 'Main theme color',
    },
  },
} as const

export type Variables = FromSchema<typeof variablesSchema>
