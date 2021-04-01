import {FromSchema} from 'json-schema-to-ts'

export const variableSchema = {
  type: 'object',
  properties: {
    primaryColor: {
      type: 'string',
      description: 'Main theme color',
    },
  },
} as const

export type Variable = FromSchema<typeof variableSchema>
