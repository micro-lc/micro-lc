import {Configuration, configurationSchema} from '@mia-platform/core'
import {DecoratedFastify, Handler} from '@mia-platform/custom-plugin-lib'

import {readValidateConfiguration} from './configurationManager'

const readPluginConfiguration = async(fastifyInstance: DecoratedFastify) => {
  // @ts-ignore
  const configurationPath = fastifyInstance.config.MICROLC_CONFIGURATION_PATH
  const validateConfiguration = await readValidateConfiguration(configurationPath, configurationSchema)
  return validateConfiguration as Configuration
}

export const configurationApiHandlerBuilder: (fastifyInstance: DecoratedFastify) => Promise<Handler> = async(fastifyInstance) => {
  const configuration: Configuration = await readPluginConfiguration(fastifyInstance)
  return (_, reply) => {
    reply.send(configuration)
  }
}

export const configurationApiSchema = {
  response: {
    200: configurationSchema,
  },
} as const
