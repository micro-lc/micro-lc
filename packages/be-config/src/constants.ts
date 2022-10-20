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

interface EndpointConfiguration {
  METHOD: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD',
  PATH: string
}

export const AUTHENTICATION_ENDPOINT: EndpointConfiguration = {
  METHOD: 'GET',
  PATH: `/authentication`,
}

export const CONFIGURATION_ENDPOINT: EndpointConfiguration = {
  METHOD: 'GET',
  PATH: `/configuration`,
}

export const CONFIGURATION_NAME = 'configurationName'

export const CONFIGURATION_FILE_ENDPOINT: EndpointConfiguration = {
  METHOD: 'GET',
  PATH: `/configuration/:${CONFIGURATION_NAME}`,
}

export const GROUPS_CONFIGURATION = {
  function: {
    key: 'groups',
  },
}

export const PERMISSIONS_CONFIGURATION = {
  function: {
    key: 'permissions',
  },
}
