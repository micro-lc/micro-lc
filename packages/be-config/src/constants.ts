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
