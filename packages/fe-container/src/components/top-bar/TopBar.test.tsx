import React from 'react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {TopBar} from './TopBar'
import RenderWithReactIntl from '../../__tests__/utils'
import {MenuOpenedProvider} from '../../contexts/MenuOpened.context'
import {ConfigurationProvider} from '../../contexts/Configuration.context'

describe('TopBar tests', function () {
  it('TopBar is working', () => {
    RenderWithReactIntl(
      <MenuOpenedProvider value={{
        isMenuOpened: false,
        setMenuOpened: () => {
        }
      }}
      >
        <TopBar/>
      </MenuOpenedProvider>
    )
    expect(screen.queryByTestId('company-logo')).toBeTruthy()
  })

  it('Closed TopBar is opening', () => {
    const mockBurgerClick = jest.fn(isToggled => {
    })

    RenderWithReactIntl(
      <MenuOpenedProvider value={{isMenuOpened: false, setMenuOpened: mockBurgerClick}}>
        <TopBar/>
      </MenuOpenedProvider>)
    const toggle = screen.getByTestId('top-bar-side-menu-toggle')
    userEvent.click(toggle)
    expect(mockBurgerClick.mock.calls[0][0]).toBeTruthy()
  })

  it('Open TopBar is closing', () => {
    const mockBurgerClick = jest.fn(isToggled => {
    })

    RenderWithReactIntl(<MenuOpenedProvider value={{isMenuOpened: true, setMenuOpened: mockBurgerClick}}>
      <TopBar/>
    </MenuOpenedProvider>)
    const toggle = screen.getByTestId('top-bar-side-menu-toggle')
    userEvent.click(toggle)
    expect(mockBurgerClick.mock.calls[0][0]).not.toBeTruthy()
  })

  it('Generate menu using the configurations', async () => {
    RenderWithReactIntl(
      <ConfigurationProvider value={{
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
        <MenuOpenedProvider value={{
          isMenuOpened: true,
          setMenuOpened: () => {
          }
        }}
        >
          <TopBar/>
        </MenuOpenedProvider>
      </ConfigurationProvider>
    )

    expect(await screen.findByText('First test plugin')).toBeTruthy()
    expect(await screen.findByText('Second test plugin')).toBeTruthy()
    expect(await screen.findByText('IFrame')).toBeTruthy()
    expect(await screen.findByText('Qiankun')).toBeTruthy()
  })
})
