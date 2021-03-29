import React from 'react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import nock from 'nock'

import RenderWithReactIntl from '../../__tests__/utils'
import {UserMenu} from '@components/user-menu/UserMenu'
import {UserContextProvider} from '@contexts/User.context'
import {LOGOUT_USER_SERVICE} from '@constants'

nock.disableNetConnect()

describe('UserMenu tests', () => {
  const logoutUrl = `${LOGOUT_USER_SERVICE.BASE_URL}${LOGOUT_USER_SERVICE.ENDPOINT}`

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

  it('Correctly log out', (done) => {
    nock('http://localhost')
      .persist()
      .post(logoutUrl)
      .reply(200)
    // eslint-disable-next-line
    window = Object.create(window)
    Object.defineProperty(window, 'location', {
      value: {
        reload: jest.fn()
      }
    })
    RenderWithReactIntl(<UserMenu/>)
    userEvent.click(screen.getByTestId('userMenu_container'))
    userEvent.click(screen.getByText('Logout'))
    setTimeout(() => {
      expect(window.location.reload).toHaveBeenCalled()
      done()
    }, 3000)
  })
})
