import axios, {AxiosRequestConfig} from 'axios'
import {Observable} from 'rxjs'
import {fromPromise} from 'rxjs/internal-compatibility'
import {map} from 'rxjs/operators'

const microlcAxiosConfig: AxiosRequestConfig = {
  baseURL: '/',
  responseType: 'json'
}

const axiosInstance = axios.create(microlcAxiosConfig)

export const extractDataFromGet: <T>(url: string) => Observable<Partial<T>> = (url) => {
  return fromPromise(axiosInstance.get(url))
    .pipe(
      map(response => response.data)
    )
}

export default axiosInstance
