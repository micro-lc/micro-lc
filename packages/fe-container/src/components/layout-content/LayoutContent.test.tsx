import React from 'react'
import {cleanup, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import nock from 'nock'

import {LayoutContent} from './LayoutContent'
import RenderWithReactIntl from '../../__tests__/utils'

nock.disableNetConnect()

describe('LayoutContent tests', () => {
  afterEach(() => {
    nock.cleanAll()
    cleanup()
  })

  it('overlay closes menu on click', () => {
    const mockLayoutClick = jest.fn(close => {
    })

    RenderWithReactIntl(<LayoutContent burgerState={[true, mockLayoutClick]}/>)
    const overlay = screen.queryByTestId('layout-content-overlay')

    userEvent.click(overlay)
    expect(mockLayoutClick.mock.calls[0][0]).not.toBeTruthy()
  })

  it('Configuration application', async () => {
    nock('http://localhost')
      .persist()
      .get('/api/v1/microlc/configuration')
      .once()
      .reply(200, {
        theming: {
          header: {
            pageTitle: 'Mia Care',
            favicon: 'https://www.mia-platform.eu/static/img/favicon/apple-icon-60x60.png'
          },
          logo: 'https://media-exp1.licdn.com/dms/image/C4D0BAQEf8hJ29mN6Gg/company-logo_200_200/0/1615282397253?e=2159024400&v=beta&t=tQixwAMJ5po8IkukxMyFfeCs-t-zZjyPgDfdy12opvI'
        },
        plugins: [{
          id: 'plugin-test-2',
          label: 'Second test plugin',
          icon: 'home',
          order: 2
        }, {
          id: 'plugin-test-1',
          label: 'First test plugin',
          icon: 'clipboard',
          order: 1
        }]
      })

    RenderWithReactIntl(<LayoutContent burgerState={[true, () => {
    }]}
                        />)

    expect(await screen.findByText('First test plugin')).toBeTruthy()
    expect(await screen.findByText('Second test plugin')).toBeTruthy()

    expect(global.window.document.title).toEqual('Mia Care')
  })
})
