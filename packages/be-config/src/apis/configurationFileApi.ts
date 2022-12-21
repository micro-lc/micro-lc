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
import {extname} from 'path'

import {DecoratedFastify, Handler} from '@mia-platform/custom-plugin-lib'

import {CONFIGURATION_NAME} from '../constants'
import {aclExpressionEvaluator} from '../utils/aclExpressionEvaluator'
import {readJsonConfigurationFile, readRawFile} from '../utils/configurationManager'
import {referencesReplacer} from '../utils/referencesReplacer'
import {getPermissions} from '../utils/getPermissions'

const retrieveJsonConfiguration = async(instanceConfig: any, configurationName: string, userGroups: string[], userPermissions: string[]) => {
  const configurationPath = `${instanceConfig.PLUGINS_CONFIGURATIONS_PATH}/${configurationName}`
  const configurationContent = await readJsonConfigurationFile(configurationPath)
  const configurationContentFiltered = aclExpressionEvaluator(configurationContent, userGroups, userPermissions)
  return referencesReplacer(configurationContentFiltered)
}

const retrieveRawConfiguration = async(instanceConfig: any, configurationName: string) => {
  const configurationPath = `${instanceConfig.PLUGINS_CONFIGURATIONS_PATH}/${configurationName}`
  return readRawFile(configurationPath)
}

export const configurationFileApiHandlerBuilder: (fastifyInstance: DecoratedFastify) => Handler<any> = (fastifyInstance) => {
  const instanceConfig: any = fastifyInstance.config
  const userPropertiesHeader = fastifyInstance.config.USER_PROPERTIES_HEADER_KEY
  return async(request, reply) => {
    if (instanceConfig.PLUGINS_CONFIGURATIONS_PATH) {
      // @ts-ignore
      const configurationName: string = request.params[CONFIGURATION_NAME]
      const retrieveFunction = configurationName.endsWith('.json') ? retrieveJsonConfiguration : retrieveRawConfiguration
      const fileContent = await retrieveFunction(instanceConfig, configurationName, request.getGroups(), getPermissions(request, userPropertiesHeader))

      let contentType: string
      const ext = extname(configurationName)

      switch (ext) {
      case '.js':
        contentType = 'application/javascript'
        break
      case '.html':
        contentType = 'text/html'
        break
      case '.json':
        contentType = 'application/json'
        break
      default:
        contentType = 'text/plain'
        break
      }

      reply.header('Content-Type', contentType)
      reply.send(fileContent)
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
