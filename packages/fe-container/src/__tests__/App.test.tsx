import React from 'react'
import {screen, waitForElementToBeRemoved} from '@testing-library/react'
import nock from 'nock'
import userEvent from '@testing-library/user-event'

import App from '../App'
import RenderWithReactIntl from './utils'

nock.disableNetConnect()

describe('App test', () => {
  beforeEach(() => {
    RenderWithReactIntl(<App/>)
  })

  it('renders without crashing', async () => {
    expect(await screen.findByText("Hello, I'm the TopBar!")).toBeTruthy()
  })

  it('toggle is working', async () => {
    const mockedResponse = nock('http://localhost')
      .persist()
      .get('/api/v1/microlc/configuration')
      .reply(200, {
        plugins: [{
          label: 'entry_1',
          id: '1'
        }]
      })
    const toggle = await screen.findByTestId('topbar-side-menu-toggle')
    expect(await screen.queryByText('entry_1')).toBeNull()
    userEvent.click(toggle)
    expect(await screen.findByText('entry_1')).toBeTruthy()
    userEvent.click(toggle)
    await waitForElementToBeRemoved(() => screen.queryByText('entry_1'))
    mockedResponse.done()
  })
})
