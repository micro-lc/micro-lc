import {Authentication, authenticationSchema} from '@mia-platform/core'

import {AUTHENTICATION_ENV} from './constants'

export const authenticationApiHandler: () => Authentication = () => {
  return {
    isAuthNecessary: process.env[AUTHENTICATION_ENV.IS_AUTH_NECESSARY] === 'true',
    userInfoUrl: process.env[AUTHENTICATION_ENV.USER_INFO_URL],
  }
}

export const authenticationApiSchema = {
  response: {
    200: authenticationSchema,
  },
} as const
