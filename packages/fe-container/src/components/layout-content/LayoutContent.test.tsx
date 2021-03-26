import React from 'react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {LayoutContent} from './LayoutContent'
import RenderWithReactIntl from '../../__tests__/utils'
import {MenuOpenedProvider} from '../../contexts/MenuOpened.context'
import {ConfigurationProvider} from '../../contexts/Configuration.context'

describe('LayoutContent tests', () => {
  it('overlay closes menu on click', () => {
    const setMenuOpened = jest.fn(close => {
    })

    RenderWithReactIntl(
      <ConfigurationProvider value={{
        theming: {
          header: {
            pageTitle: 'Mia Care',
            favicon: 'https://www.mia-platform.eu/static/img/favicon/apple-icon-60x60.png'
          },
          variables: {},
          logo: 'https://media-exp1.licdn.com/dms/image/C4D0BAQEf8hJ29mN6Gg/company-logo_200_200/0/1615282397253?e=2159024400&v=beta&t=tQixwAMJ5po8IkukxMyFfeCs-t-zZjyPgDfdy12opvI'
        },
        plugins: [{
          id: 'plugin-test-2',
          label: 'Second test plugin',
          icon: 'home',
          order: 2,
          integrationMode: 'href',
          externalLink: {
            url: 'https://google.it',
            sameWindow: true
          }
        }, {
          id: 'plugin-test-1',
          label: 'First test plugin',
          icon: 'clipboard',
          order: 1,
          integrationMode: 'href',
          externalLink: {
            url: 'https://google.it',
            sameWindow: false
          }
        }, {
          id: 'plugin-test-3',
          label: 'IFrame',
          icon: 'clipboard',
          order: 1,
          integrationMode: 'iframe',
          pluginRoute: '/iframeTest',
          pluginUrl: 'https://www.google.com/webhp?igu=1'
        }, {
          id: 'plugin-test-4',
          label: 'Qiankun',
          icon: 'clipboard',
          order: 1,
          integrationMode: 'qiankun',
          pluginRoute: '/qiankunTest',
          pluginUrl: 'https://www.google.com/webhp?igu=1'
        }]
      }}
      >
        <MenuOpenedProvider value={{isMenuOpened: true, setMenuOpened}}>
          <LayoutContent/>
        </MenuOpenedProvider>
      </ConfigurationProvider>
    )
    const overlay = screen.getByTestId('layout-content-overlay')
    userEvent.click(overlay)
    expect(setMenuOpened.mock.calls[0][0]).not.toBeTruthy()
  })
})
