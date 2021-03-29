import React from 'react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import RenderWithReactIntl from '../../__tests__/utils'
import {UserMenu} from '@components/user-menu/UserMenu'
import {UserContextProvider} from '@contexts/User.context'

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
    RenderWithReactIntl(<UserContextProvider value={user}>
      <UserMenu/>
    </UserContextProvider>)

    expect(screen.getByText('Mocked User')).toBeTruthy()
    expect(screen.queryByText('mocked.user')).not.toBeTruthy()
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
    RenderWithReactIntl(<UserContextProvider value={user}>
      <UserMenu/>
    </UserContextProvider>)

    expect(screen.getByText('Mocked User 2')).toBeTruthy()
    expect(screen.queryByText('mocked.user2')).not.toBeTruthy()
    // @ts-ignore
    const avatarSrc = document.getElementsByClassName('userMenu_avatar')[0].attributes.getNamedItem('src').value
    expect(avatarSrc).toBe('https://eu.ui-avatars.com/api/?name=Mocked User 2&size=24x24')
  })

  it('Dropdown toggle on click', () => {
    RenderWithReactIntl(<UserMenu/>)
    expect(screen.queryByText('Logout')).not.toBeTruthy()
    userEvent.click(screen.getByTestId('userMenu_container'))
    expect(screen.queryByText('Logout')).toBeTruthy()
  })
})
