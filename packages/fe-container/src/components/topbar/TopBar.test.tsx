import React from 'react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {TopBar} from './TopBar'
import RenderWithReactIntl from '../../__tests__/utils'

describe('TopBar tests', function () {
  it('TopBar is working', () => {
    RenderWithReactIntl(<TopBar burgerState={[]}/>)
    expect(screen.queryByTestId('topbar-title')).toHaveTextContent("Hello, I'm the TopBar!")
  })

  it('Closed TopBar is opening', () => {
    const mockBurgerClick = jest.fn(isToggled => {})

    RenderWithReactIntl(<TopBar burgerState={[false, mockBurgerClick]}/>)
    const toggle = screen.queryByTestId('topbar-side-menu-toggle')

    userEvent.click(toggle)
    expect(mockBurgerClick.mock.calls[0][0]).toBeTruthy()
  })

  it('Open TopBar is closing', () => {
    const mockBurgerClick = jest.fn(isToggled => {})

    RenderWithReactIntl(<TopBar burgerState={[true, mockBurgerClick]}/>)
    const toggle = screen.queryByTestId('topbar-side-menu-toggle')

    userEvent.click(toggle)
    expect(mockBurgerClick.mock.calls[0][0]).not.toBeTruthy()
  })
})
