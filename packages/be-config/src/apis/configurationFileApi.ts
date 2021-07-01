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

import {DecoratedFastify, Handler} from '@mia-platform/custom-plugin-lib'

import {GROUPS_CONFIGURATION, CONFIGURATION_NAME} from '../constants'
import {aclExpressionEvaluator} from '../utils/aclExpressionEvaluator'
import {readConfigurationFile} from '../utils/configurationManager'

const checkConfigurationsPath = (fastifyInstance: DecoratedFastify) => {
  // @ts-ignore
  if (!fastifyInstance.config.CONFIGURATIONS_PATH) {
    throw new Error('You must set configurations path')
  }
}

const retrieveConfigurationFile = async(fastifyInstance: DecoratedFastify, configurationName: string) => {
  // @ts-ignore
  const configurationPath = `${fastifyInstance.config.CONFIGURATIONS_PATH}/${configurationName}.json`
  return readConfigurationFile(configurationPath)
}

export const configurationFileApiHandlerBuilder: (fastifyInstance: DecoratedFastify) => Handler = (fastifyInstance) => {
  return async(request, reply) => {
    checkConfigurationsPath(fastifyInstance)
    // @ts-ignore
    const userGroups = request.headers[fastifyInstance.config.GROUPS_HEADER_KEY]?.split(GROUPS_CONFIGURATION.header.separator) || []
    const configurationContent = await retrieveConfigurationFile(fastifyInstance, request.params[CONFIGURATION_NAME])
    const configurationContentFiltered = aclExpressionEvaluator(configurationContent, userGroups)
    reply.send(configurationContentFiltered)
  }
}

export const configurationFileApiSchema = {
  summary: 'Expose a configuration file',
  params: {
    type: 'object',
    properties: {
      [CONFIGURATION_NAME]: {
        type: 'string',
      },
    },
    required: [CONFIGURATION_NAME],
  },
  response: {
    200: {
      additionalProperties: false,
    },
  },
} as const
