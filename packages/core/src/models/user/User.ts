import {FromSchema} from 'json-schema-to-ts'

export const userSchema = {
  type: 'object',
  properties: {
    avatar: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    groups: {
      type: 'array',
      items: {
        type: 'string',
      },
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
  },
  required: ['email', 'groups', 'name'],
} as const

export type User = FromSchema<typeof userSchema>
