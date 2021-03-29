const MICROLC_BASE_URL = '/api/v1/microlc'

export const CONFIGURATION_SERVICE = {
  BASE_URL: MICROLC_BASE_URL,
  ENDPOINT: '/configuration'
}

export const GET_USER_SERVICE = {
  BASE_URL: MICROLC_BASE_URL,
  ENDPOINT: '/user'
}

export const LOGOUT_USER_SERVICE = {
  BASE_URL: MICROLC_BASE_URL,
  ENDPOINT: '/user/logout'
}

export const INTEGRATION_METHODS = {
  HREF: 'href',
  IFRAME: 'iframe',
  QIANKUN: 'qiankun'
}
