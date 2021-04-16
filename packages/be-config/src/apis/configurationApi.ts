/*
 * Copyright 2021 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Configuration, configurationSchema, Plugin} from '@mia-platform/core'
import {DecoratedFastify, Handler} from '@mia-platform/custom-plugin-lib'

import {readValidateConfiguration} from '../utils/configurationManager'
import {GROUPS_CONFIGURATION} from '../constants'
import {pluginsFilter} from '../utils/pluginsFilter'

const readPluginConfiguration = async(fastifyInstance: DecoratedFastify) => {
  // @ts-ignore
  const configurationPath = fastifyInstance.config.MICROLC_CONFIGURATION_PATH
  const validateConfiguration = await readValidateConfiguration(configurationPath, configurationSchema)
  return validateConfiguration as Configuration
}

const buildNewConfiguration = (oldConfiguration: Configuration, allowedPlugins: Plugin[]) => {
  return {
    ...oldConfiguration,
    plugins: allowedPlugins,
  }
}

export const configurationApiHandlerBuilder: (fastifyInstance: DecoratedFastify) => Promise<Handler> = async(fastifyInstance) => {
  const configuration: Configuration = await readPluginConfiguration(fastifyInstance)
  return (request, reply) => {
    // @ts-ignore
    const userGroups = request.headers[fastifyInstance.config.GROUPS_HEADER_KEY]?.split(GROUPS_CONFIGURATION.header.separator) || []
    const allowedPlugins = pluginsFilter(configuration.plugins || [], userGroups)
    const configurationForUser = buildNewConfiguration(configuration, allowedPlugins)
    reply.send(configurationForUser)
  }
}

export const configurationApiSchema = {
  response: {
    200: configurationSchema,
  },
} as const
