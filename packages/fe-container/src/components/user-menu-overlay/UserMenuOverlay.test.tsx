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
import React from 'react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {UserMenuOverlay} from '@components/user-menu-overlay/UserMenuOverlay'
import {logOutUserBuilder} from '@services/microlc/user.service'

import RenderWithReactIntl from '../../__tests__/utils'

describe('UserMenuOverlay tests', () => {
  const logoutUrl = '/api/v1/microlc/user/logout'

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost'
      },
      writable: true
    })
  })

  it('Shows always log out entry', () => {
    RenderWithReactIntl(<UserMenuOverlay/>)
    expect(screen.getByText('Log Out')).toBeTruthy()
  })

  it('Correctly log out', () => {
    logOutUserBuilder(logoutUrl)
    RenderWithReactIntl(<UserMenuOverlay/>)
    userEvent.click(screen.getByText('Log Out'))
    expect(window.location.href).toBe(logoutUrl)
  })
})
