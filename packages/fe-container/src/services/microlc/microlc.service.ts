import {forkJoin, Observable} from 'rxjs'
import {Configuration, User} from '@mia-platform/core'

import {retrieveConfiguration} from '@services/microlc/configuration.service'
import {retrieveUser} from '@services/microlc/user.service'

type AppData = {
  user: Partial<User>,
  configuration: Configuration
}

export const retrieveAppData: () => Observable<AppData> = () => {
  return forkJoin({
    user: retrieveUser(),
    configuration: retrieveConfiguration()
  })
}
