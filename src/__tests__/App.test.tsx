import React from 'react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'
import RenderWithReactIntl from './utils'

describe('App test', () => {
  beforeEach(() => {
    RenderWithReactIntl(<App/>)
  })

  it('renders without crashing', () => {
    expect(screen.queryByText("Hello, I'm the TopBar!")).toBeTruthy()
  })

  it('toggle is working', async () => {
    const toggle = screen.queryByTestId('topbar-side-menu-toggle')
    expect(await screen.queryByText('entry_1')).toBeNull()
    userEvent.click(toggle)
    expect(await screen.findByText('entry_1')).toBeTruthy()
    userEvent.click(toggle)
    expect(await screen.queryByText('entry_1')).toBeNull()
  })
})
