import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {TopBar} from '../components/topbar/TopBar'

describe('TopBar tests', function () {
  it('TopBar is working', () => {
    render(<TopBar/>)
    expect(screen.queryByTestId('topbar-title')).toHaveTextContent("Hello, I'm the TopBar!")
  })

  it('TopBar is toggling', () => {
    let lastToggle = false
    render(
      <TopBar
        onBurgerClick={(isToggled) => {
          lastToggle = !lastToggle
          expect(isToggled).toEqual(lastToggle)
        }}
      />)
    const toggle = screen.queryByTestId('topbar-side-menu-toggle')
    userEvent.click(toggle)
    userEvent.click(toggle)
  })
})
