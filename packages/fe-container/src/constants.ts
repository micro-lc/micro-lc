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
const MICROLC_BASE_URL = '/api/v1/microlc'

export const USER_CONFIGURATION_SERVICE = {
  BASE_URL: MICROLC_BASE_URL,
  ENDPOINT: '/authentication'
}

export const CONFIGURATION_SERVICE = {
  BASE_URL: MICROLC_BASE_URL,
  ENDPOINT: '/configuration'
}

export const INTEGRATION_METHODS = {
  HREF: 'href',
  IFRAME: 'iframe',
  QIANKUN: 'qiankun'
}

export const DOCUMENTATION_URL = 'https://docs.mia-platform.eu/docs/business_suite/microlc/overview'

export const COLORS = {
  primaryColor: '--microlc-primary-color',
  menuEntrySelectedBackgroundColor: '--microlc-primary-color-tint-89'
}

export const MICROLC_QIANKUN_CONTAINER = 'microlc-qiankun-contaier'

export const ERROR_PATH = {
  INTERNAL_ERROR: '/microlc_internal_error',
  PAGE_NOT_FOUND: '*',
  UNAUTHORIZED: '/microlc_unauthorized'
}
