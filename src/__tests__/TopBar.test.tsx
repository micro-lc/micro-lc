import React from 'react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {TopBar} from '../components/topbar/TopBar'
import RenderWithReactIntl from './utils'

describe('TopBar tests', function () {
  it('TopBar is working', () => {
    RenderWithReactIntl(<TopBar/>)
    expect(screen.queryByTestId('topbar-title')).toHaveTextContent("Hello, I'm the TopBar!")
  })

  it('TopBar is toggling', () => {
    const mockBurgerClick = jest.fn((isToggled) => {
    })
    RenderWithReactIntl(
      <TopBar
        onBurgerClick={mockBurgerClick}
      />)
    const toggle = screen.queryByTestId('topbar-side-menu-toggle')
    userEvent.click(toggle)
    userEvent.click(toggle)
    expect(mockBurgerClick.mock.calls[0][0]).toBeTruthy()
    expect(mockBurgerClick.mock.calls[1][0]).not.toBeTruthy()
  })
})
