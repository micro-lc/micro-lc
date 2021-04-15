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

const API_VERSION = 'v1'

interface EndpointConfiguration {
  METHOD: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD',
  PATH: string
}

export const AUTHENTICATION_ENDPOINT: EndpointConfiguration = {
  METHOD: 'GET',
  PATH: `/api/${API_VERSION}/microlc/authentication`,
}

export const CONFIGURATION_ENDPOINT: EndpointConfiguration = {
  METHOD: 'GET',
  PATH: `/api/${API_VERSION}/microlc/configuration`,
}

export const GROUPS_CONFIGURATION = {
  header: {
    key: 'GROUPS_HEADER_KEY',
    separator: ',',
  },
  function: {
    key: 'groups',
  },
}
