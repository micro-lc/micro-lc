import React from 'react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {TopBar} from './TopBar'
import RenderWithReactIntl from '../../__tests__/utils'
import {MenuOpenedProvider} from '../../contexts/MenuOpened.context'

describe('TopBar tests', function () {
  it('TopBar is working', () => {
    RenderWithReactIntl(
      <MenuOpenedProvider value={{
        isMenuOpened: false,
        setMenuOpened: () => {
        }
      }}
      >
        <TopBar/>
      </MenuOpenedProvider>
    )
    expect(screen.queryByTestId('topbar-title')).toHaveTextContent("Hello, I'm the TopBar!")
  })

  it('Closed TopBar is opening', () => {
    const mockBurgerClick = jest.fn(isToggled => {
    })

    RenderWithReactIntl(
      <MenuOpenedProvider value={{isMenuOpened: false, setMenuOpened: mockBurgerClick}}>
        <TopBar/>
      </MenuOpenedProvider>)
    const toggle = screen.queryByTestId('topbar-side-menu-toggle')

    userEvent.click(toggle)
    expect(mockBurgerClick.mock.calls[0][0]).toBeTruthy()
  })

  it('Open TopBar is closing', () => {
    const mockBurgerClick = jest.fn(isToggled => {
    })

    RenderWithReactIntl(<MenuOpenedProvider value={{isMenuOpened: true, setMenuOpened: mockBurgerClick}}>
      <TopBar/>
    </MenuOpenedProvider>)
    const toggle = screen.queryByTestId('topbar-side-menu-toggle')

    userEvent.click(toggle)
    expect(mockBurgerClick.mock.calls[0][0]).not.toBeTruthy()
  })
})
