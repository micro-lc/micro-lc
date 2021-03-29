import {from, of} from 'rxjs'
import {catchError, switchMap} from 'rxjs/operators'
import {User} from '@mia-platform/core'

import {GET_USER_SERVICE, LOGOUT_USER_SERVICE} from '@constants'
import axiosInstance, {extractDataFromGet} from '@services/microlc/axios'

const RETRIEVE_USER_URL = `${GET_USER_SERVICE.BASE_URL}${GET_USER_SERVICE.ENDPOINT}`

const LOGOUT_USER_URL = `${LOGOUT_USER_SERVICE.BASE_URL}${LOGOUT_USER_SERVICE.ENDPOINT}`

export const retrieveUser = () => {
  return extractDataFromGet<User>(RETRIEVE_USER_URL)
}

export const logOutUser = () => {
  return from(axiosInstance.post(LOGOUT_USER_URL)).pipe(
    switchMap(() => of(true)),
    catchError(() => of(false))
  )
}
