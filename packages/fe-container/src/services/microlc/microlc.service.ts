/*
 * Copyright 2021 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {defer, forkJoin, Observable, of} from 'rxjs'
import {Authentication, Configuration, User} from '@mia-platform/core'

import {retrieveConfiguration} from '@services/microlc/configuration.service'
import {logOutUserBuilder, retrieveUser} from '@services/microlc/user.service'
import {retrieveAuthentication} from '@services/microlc/authentication.service'
import {switchMap, tap} from 'rxjs/operators'

type AppData = {
  user: Partial<User>,
  configuration: Configuration
}

const retrieveConditionalUser = (authenticationConfiguration: Partial<Authentication>) =>
  defer(() => authenticationConfiguration.isAuthNecessary ?
    retrieveUser(authenticationConfiguration.userInfoUrl) :
    of({})
  )

export const retrieveAppData: () => Observable<AppData> = () => {
  return retrieveAuthentication().pipe(
    tap(authenticationConfiguration => logOutUserBuilder(authenticationConfiguration.userLogoutUrl)),
    switchMap(authenticationConfiguration => forkJoin({
      user: retrieveConditionalUser(authenticationConfiguration),
      configuration: retrieveConfiguration()
    }))
  )
}
