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

import customService, {DecoratedFastify} from '@mia-platform/custom-plugin-lib'

import {AUTHENTICATION_ENDPOINT, CONFIGURATION_ENDPOINT} from './constants'
import {authenticationApiHandlerBuilder, authenticationApiSchema} from './apis/authenticationApi'
import {configurationApiHandlerBuilder, configurationApiSchema} from './apis/configurationApi'
import {environmentVariablesSchema} from './schemas/environmentVariablesSchema'

module.exports = customService(environmentVariablesSchema)(async function index(service: DecoratedFastify) {
  const authenticationApiHandler = await authenticationApiHandlerBuilder(service)
  const configurationApiHandler = await configurationApiHandlerBuilder(service)
  service.addRawCustomPlugin(
    AUTHENTICATION_ENDPOINT.METHOD, AUTHENTICATION_ENDPOINT.PATH, authenticationApiHandler, authenticationApiSchema
  )
  service.addRawCustomPlugin(
    CONFIGURATION_ENDPOINT.METHOD, CONFIGURATION_ENDPOINT.PATH, configurationApiHandler, configurationApiSchema
  )
})
