import {Observable, of} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {fromPromise} from 'rxjs/internal-compatibility'
import axios, {AxiosRequestConfig} from 'axios'
import {Configuration} from '@mia-platform/core'

import {CONFIGURATION_SERVICE} from '../../constants'

const microlcAxiosConfig: AxiosRequestConfig = {
  baseURL: '/',
  responseType: 'json'
}

const axiosInstance = axios.create(microlcAxiosConfig)

export const retrieveConfiguration: () => Observable<Configuration> = () => {
  const url = `${CONFIGURATION_SERVICE.BASE_URL}${CONFIGURATION_SERVICE.ENDPOINT}`

  return fromPromise(axiosInstance.get<Configuration>(url))
    .pipe(
      map(response => response.data),
      catchError(() => of({}))
    )
}
