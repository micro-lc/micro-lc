import {defer, forkJoin, Observable, of} from 'rxjs'
import {Authentication, Configuration, User} from '@mia-platform/core'

import {retrieveConfiguration} from '@services/microlc/configuration.service'
import {retrieveUser} from '@services/microlc/user.service'
import {retrieveAuthentication} from '@services/microlc/authentication.service'
import {switchMap} from 'rxjs/operators'

type AppData = {
  user: Partial<User>,
  configuration: Configuration
}

const retrieveConditionalUser = (authenticationConfiguration: Partial<Authentication>) =>
  defer(() => authenticationConfiguration.isAuthNecessary ?
    retrieveUser(authenticationConfiguration.authUrl) :
    of({})
  )

export const retrieveAppData: () => Observable<AppData> = () => {
  return retrieveAuthentication().pipe(
    switchMap(authenticationConfiguration => forkJoin({
      user: retrieveConditionalUser(authenticationConfiguration),
      configuration: retrieveConfiguration()
    }))
  )
}
