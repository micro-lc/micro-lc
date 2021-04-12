import {Authentication, authenticationSchema} from '@mia-platform/core'
import {DecoratedFastify, Handler} from '@mia-platform/custom-plugin-lib'

import {readValidateConfiguration} from './configurationManager'

const readAuthenticationConfiguration = async(fastifyInstance: DecoratedFastify) => {
  // @ts-ignore
  const configurationPath = fastifyInstance.config.AUTHENTICATION_CONFIGURATION_PATH
  const validateConfiguration = await readValidateConfiguration(configurationPath, authenticationSchema)
  return validateConfiguration as Authentication
}

export const authenticationApiHandlerBuilder: (fastifyInstance: DecoratedFastify) => Promise<Handler> = async(fastifyInstance) => {
  const configuration: Authentication = await readAuthenticationConfiguration(fastifyInstance)
  return (_, reply) => {
    reply.send(configuration)
  }
}

export const authenticationApiSchema = {
  response: {
    200: authenticationSchema,
  },
} as const
