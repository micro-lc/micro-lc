import {Configuration} from '@mia-platform/core'

import {CONFIGURATION_SERVICE} from '@constants'
import {extractDataFromGet} from '@services/microlc/axios'

const RETRIEVE_CONFIGURATION_URL = `${CONFIGURATION_SERVICE.BASE_URL}${CONFIGURATION_SERVICE.ENDPOINT}`

export const retrieveConfiguration = () => {
  return extractDataFromGet<Configuration>(RETRIEVE_CONFIGURATION_URL)
}
