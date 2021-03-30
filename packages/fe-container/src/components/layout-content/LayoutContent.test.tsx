import React from 'react'
import {screen} from '@testing-library/react'

import {LayoutContent} from './LayoutContent'
import RenderWithReactIntl from '../../__tests__/utils'
import {MenuOpenedProvider} from '@contexts/MenuOpened.context'
import {ConfigurationProvider} from '@contexts/Configuration.context'

describe('LayoutContent tests', () => {
  it('LayoutContent renders', () => {
    const setMenuOpened = jest.fn(close => {
    })

    RenderWithReactIntl(
      <ConfigurationProvider
        value={{
          theming: {
            header: {pageTitle: 'Mia Care', favicon: 'favicon_url'},
            variables: {},
            logo: {url: 'logo_url', alt: 'logo'}
          },
          plugins: [
            {
              id: 'plugin-test-2',
              label: 'Second test plugin',
              icon: 'home',
              order: 2,
              integrationMode: 'href',
              externalLink: {
                url: 'https://google.it',
                sameWindow: true
              }
            },
            {
              id: 'plugin-test-1',
              label: 'First test plugin',
              icon: 'clipboard',
              order: 1,
              integrationMode: 'href',
              externalLink: {
                url: 'https://google.it',
                sameWindow: false
              }
            },
            {
              id: 'plugin-test-3',
              label: 'IFrame',
              icon: 'clipboard',
              order: 1,
              integrationMode: 'iframe',
              pluginRoute: '/iframeTest',
              pluginUrl: 'https://www.google.com/webhp?igu=1'
            },
            {
              id: 'plugin-test-4',
              label: 'Qiankun',
              icon: 'clipboard',
              order: 1,
              integrationMode: 'qiankun',
              pluginRoute: '/qiankunTest',
              pluginUrl: 'https://www.google.com/webhp?igu=1'
            }
          ]
        }}
      >
        <MenuOpenedProvider value={{isMenuOpened: true, setMenuOpened}}>
          <LayoutContent/>
        </MenuOpenedProvider>
      </ConfigurationProvider>
    )
    expect(screen.getByTestId('layout-content')).toBeTruthy()
  })
})
