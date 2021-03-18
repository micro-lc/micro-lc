import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

describe('App test', () => {
  beforeEach(() => {
    render(<App/>)
  })

  it('renders without crashing', () => {
    expect(screen.queryByText("Hello, I'm the TopBar!")).toBeTruthy()
  })

  it('toggle is working', async () => {
    const toggle = screen.queryByTestId('topbar-side-menu-toggle')
    expect(await screen.queryByText('entry_1')).toBeNull()
    userEvent.click(toggle)
    expect(await screen.findByText('entry_1')).toBeVisible()
    userEvent.click(toggle)
    expect(await screen.queryByText('entry_1')).toBeNull()
  })
})
