import {Authentication} from '@mia-platform/core'

import {USER_CONFIGURATION_SERVICE} from '@constants'
import {extractDataFromGet} from '@services/microlc/axios'

const AUTHENTICATION_URL = `${USER_CONFIGURATION_SERVICE.BASE_URL}${USER_CONFIGURATION_SERVICE.ENDPOINT}`

export const retrieveAuthentication = () => {
  return extractDataFromGet<Authentication>(AUTHENTICATION_URL)
}
