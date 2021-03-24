import React from 'react'
import {screen} from '@testing-library/react'
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
        theming: {
          header: {
            pageTitle: 'Mia Care',
            favicon: 'https://www.mia-platform.eu/static/img/favicon/apple-icon-60x60.png'
          },
          variables: {},
          logo: 'https://media-exp1.licdn.com/dms/image/C4D0BAQEf8hJ29mN6Gg/company-logo_200_200/0/1615282397253?e=2159024400&v=beta&t=tQixwAMJ5po8IkukxMyFfeCs-t-zZjyPgDfdy12opvI'
        },
        plugins: [{
          label: 'entry_1',
          id: '1',
          integrationMode: 'href',
          externalLink: {
            url: 'https://google.it',
            sameWindow: false
          }
        }]
      })
    const toggle = await screen.findByTestId('top-bar-side-menu-toggle')
    expect(global.window.document.title).toEqual('Mia Care')
    expect(await screen.queryByText('entry_1')).toBeNull()
    userEvent.click(toggle)
    const entry1 = await screen.findByText('entry_1')
    expect(entry1).toBeTruthy()
    userEvent.click(toggle)
    // @ts-ignore
    expect(entry1.parentElement.parentElement.classList).toContain('ant-dropdown-hidden')
    mockedResponse.done()
  })
})
