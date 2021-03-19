import axios, {AxiosRequestConfig} from 'axios'
import {Configuration} from '@mia-platform/core'
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {fromPromise} from "rxjs/internal-compatibility";

const microlcAxiosConfig: AxiosRequestConfig = {
  baseURL: '/',
  responseType: 'json'
}

const axiosInstance = axios.create(microlcAxiosConfig);

export const retrieveConfiguration: () => Observable<Configuration> = () => {
  return fromPromise(axiosInstance.get<Configuration>('/api/v1/microlc/configuration'))
    .pipe(
      map(response => response.data)
    )
}
