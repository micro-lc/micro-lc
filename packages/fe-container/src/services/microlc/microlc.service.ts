import {Configuration} from '@mia-platform/core'
import {Observable, of} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {fromPromise} from 'rxjs/internal-compatibility'
import axios, {AxiosRequestConfig} from 'axios'

import {configuration} from '../../constants.json'

const microlcAxiosConfig: AxiosRequestConfig = {
  baseURL: '/',
  responseType: 'json'
}

const axiosInstance = axios.create(microlcAxiosConfig)

export const retrieveConfiguration: () => Observable<Configuration> = () => {
  return fromPromise(axiosInstance.get<Configuration>(`${configuration.baseUrl}${configuration.endpoint}`))
    .pipe(
      map(response => response.data),
      catchError(() => of({}))
    )
}
