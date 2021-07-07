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
import {referencesReplacer} from '../utils/referencesReplacer'

const retrieveConfigurationFile = async(fastifyInstance: DecoratedFastify, configurationName: string) => {
  // @ts-ignore
  const configurationPath = `${fastifyInstance.config.PLUGINS_CONFIGURATIONS_PATH}/${configurationName}.json`
  return readConfigurationFile(configurationPath)
}

export const configurationFileApiHandlerBuilder: (fastifyInstance: DecoratedFastify) => Handler = (fastifyInstance) => {
  return async(request, reply) => {
    // @ts-ignore
    if (fastifyInstance.config.PLUGINS_CONFIGURATIONS_PATH) {
      // @ts-ignore
      const userGroups = request.headers[fastifyInstance.config.GROUPS_HEADER_KEY]?.split(GROUPS_CONFIGURATION.header.separator) || []
      const configurationContent = await retrieveConfigurationFile(fastifyInstance, request.params[CONFIGURATION_NAME])
      const configurationContentFiltered = aclExpressionEvaluator(configurationContent, userGroups)
      reply.send(referencesReplacer(configurationContentFiltered))
    } else {
      reply.status(404).send()
    }
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
} as const
