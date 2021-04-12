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

export const AUTHENTICATION_ENV = {
  IS_AUTH_NECESSARY: 'MICROLC_AUTH_NECESSARY',
  USER_INFO_URL: 'MICROLC_USER_INFO_URL',
}
