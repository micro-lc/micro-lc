import {FromSchema} from 'json-schema-to-ts'

export const userSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    nickname: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    avatar: {
      type: 'string',
    },
  },
} as const

export type User = FromSchema<typeof userSchema>
