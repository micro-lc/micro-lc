import {Configuration} from '@mia-platform/core'
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

import axiosInstance from '../http/axios';

export const retrieveConfiguration: () => Observable<Configuration> = () => {
  return fromPromise(axiosInstance.get<Configuration>('/api/v1/microlc/configuration'))
    .pipe(
      map(response => response.data),
      catchError(() => of({}))
    )
}
