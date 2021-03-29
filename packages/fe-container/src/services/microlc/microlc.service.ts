import {Observable, of} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {fromPromise} from 'rxjs/internal-compatibility'
import axios, {AxiosRequestConfig} from 'axios'
import {Configuration, User} from '@mia-platform/core'

import {CONFIGURATION_SERVICE, GET_USER_SERVICE} from '@constants'

const microlcAxiosConfig: AxiosRequestConfig = {
  baseURL: '/',
  responseType: 'json'
}

const axiosInstance = axios.create(microlcAxiosConfig)

const RETRIEVE_CONFIGURATION_URL = `${CONFIGURATION_SERVICE.BASE_URL}${CONFIGURATION_SERVICE.ENDPOINT}`

export const retrieveConfiguration = () => {
  return extractDataFromUrl<Configuration>(RETRIEVE_CONFIGURATION_URL)
}

const RETRIEVE_USER_URL = `${GET_USER_SERVICE.BASE_URL}${GET_USER_SERVICE.ENDPOINT}`

export const retrieveUser = () => {
  return extractDataFromUrl<User>(RETRIEVE_USER_URL)
}

const extractDataFromUrl: <T>(url: string) => Observable<Partial<T>> = (url) => {
  return fromPromise(axiosInstance.get(url))
    .pipe(
      map(response => response.data),
      catchError(() => of({}))
    )
}
