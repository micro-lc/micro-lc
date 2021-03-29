import React from 'react'
import {screen} from '@testing-library/react'
import {Plugin} from '@mia-platform/core'
import userEvent from '@testing-library/user-event'

import {SideMenu} from './SideMenu'
import RenderWithReactIntl from '../../__tests__/utils'
import {isPluginLoaded, registerPlugin, history} from '../../plugins/PluginsLoaderFacade'

jest.mock('../../plugins/PluginsLoaderFacade', () => ({
  ...jest.requireActual('../../plugins/PluginsLoaderFacade'),
  isPluginLoaded: jest.fn(),
  history: {
    listen: jest.fn(() => {})
  }
}))

describe('SideMenu tests', () => {
  it('side menu show entries', () => {
    const entriesHref = {integrationMode: 'href', externalLink: {sameWindow: false, url: ''}}
    RenderWithReactIntl(
      <SideMenu plugins={[{label: 'entry_1', id: '1', ...entriesHref}, {label: 'entry_2', id: '2', ...entriesHref}]}/>
    )
    expect(screen.queryByText('entry_1')).toBeVisible()
    expect(screen.queryByText('entry_2')).toBeVisible()
    expect(screen.queryByText('entry_3')).toBeNull()
  })

  it('side menu click correctly works', async () => {
    window.open = jest.fn()
    const plugin: Plugin = {
      label: 'entry_1',
      id: '1',
      integrationMode: 'href',
      externalLink: {sameWindow: false, url: 'http://google.it'}
    }
    registerPlugin(plugin)
    RenderWithReactIntl(<SideMenu plugins={[plugin]}/>)
    userEvent.click(await screen.findByText('entry_1'))
    expect(window.open).toBeCalledWith('http://google.it')
  })

  it('display the icon', () => {
    window.open = jest.fn()
    RenderWithReactIntl(
      <SideMenu plugins={[{label: 'entry_1', id: '1', integrationMode: 'iframe', icon: 'test-icon'}]}/>
    )
    expect(document.getElementsByClassName('test-icon')).toHaveLength(1)
  })

  it('no icon, just placeholder class', () => {
    window.open = jest.fn()
    RenderWithReactIntl(<SideMenu plugins={[{label: 'entry_1', id: '1', integrationMode: 'iframe'}]}/>)
    expect(document.getElementsByClassName('sideMenu_icon')).toHaveLength(1)
  })

  it('show external link icon', () => {
    RenderWithReactIntl(
      <SideMenu
        plugins={[
          {label: 'entry_1', id: '1', integrationMode: 'href'},
          {label: 'entry_2', id: '2', integrationMode: 'iframe'}
        ]}
      />
    )
    expect(document.getElementsByClassName('sideMenu_icon')).toHaveLength(2)
    expect(document.getElementsByClassName('sideMenu_externalLink')).toHaveLength(1)
  })

  it('Avoid href menu selected', () => {
    RenderWithReactIntl(
      <SideMenu
        plugins={[
          {label: 'entry_1', id: '1', integrationMode: 'href'},
          {label: 'entry_2', id: '2', integrationMode: 'iframe'}
        ]}
      />
    )
    expect(isPluginLoaded).toHaveBeenCalledTimes(2)
    // @ts-ignore
    expect(isPluginLoaded.mock.calls[0][0]).toStrictEqual({label: 'entry_1', id: '1', integrationMode: 'href'})
    // @ts-ignore
    expect(isPluginLoaded.mock.calls[1][0]).toStrictEqual({label: 'entry_2', id: '2', integrationMode: 'iframe'})
    expect(history.listen).toHaveBeenCalledTimes(2)
  })

  it('Generate menu using the configurations', () => {
    const plugins = [
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
    RenderWithReactIntl(<SideMenu plugins={plugins}/>)

    expect(screen.getByText('First test plugin')).toBeTruthy()
    expect(screen.getByText('Second test plugin')).toBeTruthy()
    expect(screen.getByText('IFrame')).toBeTruthy()
    expect(screen.getByText('Qiankun')).toBeTruthy()
  })
})
