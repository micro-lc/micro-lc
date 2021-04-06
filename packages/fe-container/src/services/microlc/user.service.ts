import {from, of} from 'rxjs'
import {catchError, switchMap} from 'rxjs/operators'
import {User} from '@mia-platform/core'

import {LOGOUT_USER_SERVICE} from '@constants'
import axiosInstance, {extractDataFromGet} from '@services/microlc/axios'

const LOGOUT_USER_URL = `${LOGOUT_USER_SERVICE.BASE_URL}${LOGOUT_USER_SERVICE.ENDPOINT}`

export const retrieveUser = (authenticationUrl: string | undefined) => {
  return authenticationUrl ? extractDataFromGet<User>(authenticationUrl) : of({})
}

export const logOutUser = () => {
  return from(axiosInstance.post(LOGOUT_USER_URL)).pipe(
    switchMap(() => of(true)),
    catchError(() => of(false))
  )
}
