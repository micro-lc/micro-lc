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
import nock from 'nock'

import RenderWithReactIntl from '../../__tests__/utils'
import {UserMenu} from '@components/user-menu/UserMenu'

nock.disableNetConnect()

describe('UserMenu tests', () => {
  it('Render without crash', () => {
    RenderWithReactIntl(<UserMenu/>)
    expect(screen.findByTestId('userMenu_container')).toBeTruthy()
  })

  it('Render with user info', () => {
    const user = {
      email: 'mocked.user@mia-platform.eu',
      name: 'Mocked User',
      nickname: 'mocked.user',
      phone: '+393333333333',
      avatar: 'https://i2.wp.com/cdn.auth0.com/avatars/md.png?ssl=1'
    }
    RenderWithReactIntl(<UserMenu {...user}/>)

    expect(screen.getByText('Mocked User')).toBeTruthy()
    expect(screen.queryByText('mocked.user')).toBeFalsy()
    // @ts-ignore
    const avatarSrc = document.getElementsByClassName('userMenu_avatar')[0].attributes.getNamedItem('src').value
    expect(avatarSrc).toBe('https://i2.wp.com/cdn.auth0.com/avatars/md.png?ssl=1')
  })

  it('Fallback avatar applied', () => {
    const user = {
      email: 'mocked.user@mia-platform.eu',
      name: 'Mocked User 2',
      nickname: 'mocked.user2',
      phone: '+393333333333'
    }
    RenderWithReactIntl(<UserMenu {...user}/>)

    expect(screen.getByText('Mocked User 2')).toBeTruthy()
    expect(screen.queryByText('mocked.user2')).toBeFalsy()
    // @ts-ignore
    const avatarSrc = document.getElementsByClassName('userMenu_avatar')[0].attributes.getNamedItem('src').value
    expect(avatarSrc).toBe('https://eu.ui-avatars.com/api/?name=Mocked User 2&size=24x24')
  })
})
