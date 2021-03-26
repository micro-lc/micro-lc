import React from 'react'
import {screen} from '@testing-library/react'
import {Plugin} from '@mia-platform/core'

import {SideMenu} from './SideMenu'
import RenderWithReactIntl from '../../__tests__/utils'
import userEvent from '@testing-library/user-event'
import {registerPlugin} from '../../plugins/PluginsLoaderFacade'

describe('SideMenu tests', () => {
  it('side menu show entries', () => {
    const entriesHref = {integrationMode: 'href', externalLink: {sameWindow: false, url: ''}}
    RenderWithReactIntl(<SideMenu
      plugins={[
        {label: 'entry_1', id: '1', ...entriesHref}, {label: 'entry_2', id: '2', ...entriesHref}
      ]}
                        />)
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
    RenderWithReactIntl(<SideMenu
      plugins={[
        {label: 'entry_1', id: '1', integrationMode: 'iframe', icon: 'test-icon'}
      ]}
                        />)
    expect(document.getElementsByClassName('test-icon')).toHaveLength(1)
  })

  it('no icon, just placeholder class', () => {
    window.open = jest.fn()
    RenderWithReactIntl(<SideMenu
      plugins={[
        {label: 'entry_1', id: '1', integrationMode: 'iframe'}
      ]}
                        />)
    expect(document.getElementsByClassName('sideMenu_icon')).toHaveLength(1)
  })

  it('show external link icon', () => {
    window.open = jest.fn()
    RenderWithReactIntl(<SideMenu
      plugins={[
        {label: 'entry_1', id: '1', integrationMode: 'href'},
        {label: 'entry_2', id: '2', integrationMode: 'iframe'}
      ]}
                        />)
    expect(document.getElementsByClassName('sideMenu_icon')).toHaveLength(3)
    expect(document.getElementsByClassName('external')).toHaveLength(1)
  })

  it('Avoid href menu selected', () => {
    RenderWithReactIntl(<SideMenu
      plugins={[
        {label: 'entry_1', id: '1', integrationMode: 'href'},
        {label: 'entry_2', id: '2', integrationMode: 'iframe'}
      ]}
                        />)
    expect(document.getElementsByClassName('ant-menu-item-selected')).toHaveLength(0)
    userEvent.click(screen.getByText('entry_1'))
    expect(document.getElementsByClassName('ant-menu-item-selected')).toHaveLength(0)
    userEvent.click(screen.getByText('entry_2'))
    expect(document.getElementsByClassName('ant-menu-item-selected')).toHaveLength(1)
  })
})
