/*
 * Copyright 2021 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Plugin} from '@mia-platform/core'

import {AntSideMenu} from './AntSideMenu'
import RenderWithReactIntl from '../../__tests__/utils'
import {registerPlugin} from '@utils/plugins/PluginsLoaderFacade'
import {isFixedSidebarCollapsed} from '@utils/settings/side-bar/SideBarSettings'

describe('AntSideMenu test', () => {
  afterEach(() => window.localStorage.clear())

  it('side menu show entries', () => {
    const entriesHref = {integrationMode: 'href', externalLink: {sameWindow: false, url: ''}}
    const configuration = {
      plugins: [{label: 'entry_1', id: '1', ...entriesHref}, {label: 'entry_2', id: '2', ...entriesHref}]
    }
    RenderWithReactIntl(
      // @ts-ignore
      <AntSideMenu configuration={configuration}/>
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
      externalLink: {sameWindow: false, url: 'https://google.it'}
    }
    const configuration = {
      plugins: [plugin]
    }
    registerPlugin(plugin)
    RenderWithReactIntl(<AntSideMenu configuration={configuration}/>)
    userEvent.click(await screen.findByText('entry_1'))
    expect(window.open).toBeCalledWith('https://google.it')
  })

  it('display the icon', () => {
    window.open = jest.fn()
    const configuration = {
      plugins: [{label: 'entry_1', id: '1', integrationMode: 'iframe', icon: 'test-icon'}]
    }
    // @ts-ignore
    RenderWithReactIntl(<AntSideMenu configuration={configuration}/>)
    expect(document.getElementsByClassName('test-icon')).toHaveLength(1)
  })

  it('no icon, just placeholder class', () => {
    window.open = jest.fn()
    const configuration = {
      plugins: [{label: 'entry_1', id: '1', integrationMode: 'iframe'}]
    }
    // @ts-ignore
    RenderWithReactIntl(<AntSideMenu configuration={configuration}/>)
    expect(document.getElementsByClassName('sideMenu_icon')).toHaveLength(2)
  })

  it('show external link icon', () => {
    const configuration = {
      plugins: [
        {label: 'entry_1', id: '1', integrationMode: 'href'},
        {label: 'entry_2', id: '2', integrationMode: 'iframe'}
      ]
    }
    // @ts-ignore
    RenderWithReactIntl(<AntSideMenu configuration={configuration}/>)
    expect(document.getElementsByClassName('sideMenu_icon')).toHaveLength(3)
    expect(document.getElementsByClassName('sideMenu_externalLink')).toHaveLength(1)
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
    // @ts-ignore
    RenderWithReactIntl(<AntSideMenu configuration={{plugins}}/>)

    expect(screen.getByText('First test plugin')).toBeTruthy()
    expect(screen.getByText('Second test plugin')).toBeTruthy()
    expect(screen.getByText('IFrame')).toBeTruthy()
    expect(screen.getByText('Qiankun')).toBeTruthy()
  })

  it('toggle collapse correctly hide and show labels', () => {
    RenderWithReactIntl(<AntSideMenu configuration={{}}/>)
    expect(isFixedSidebarCollapsed()).toBeFalsy()
    expect(screen.getByText('Collapse')).toBeTruthy()

    userEvent.click(screen.getByText('Collapse'))
    expect(isFixedSidebarCollapsed()).toBeTruthy()
    expect(document.getElementsByClassName('ant-menu-inline-collapsed').length).toBe(1)

    userEvent.click(screen.getByText('Collapse'))
    expect(isFixedSidebarCollapsed()).toBeFalsy()
    expect(document.getElementsByClassName('ant-menu-inline-collapsed').length).toBe(0)
  })

  it('render sub menu', () => {
    const plugins = [
      {
        id: 'plugin-test-2',
        label: 'Container entry',
        icon: 'home',
        order: 2,
        content: [{
          id: 'plugin-test-1',
          label: 'Content entry',
          icon: 'clipboard',
          order: 1,
          integrationMode: 'href',
          externalLink: {
            url: 'https://google.it',
            sameWindow: false
          }
        }]
      }
    ]
    // @ts-ignore
    RenderWithReactIntl(<AntSideMenu configuration={{plugins}}/>)

    expect(screen.getByText('Container entry')).toBeTruthy()
    expect(screen.queryByText('Content entry')).toBeFalsy()

    userEvent.click(screen.getByText('Container entry'))

    expect(screen.getByText('Container entry')).toBeTruthy()
    expect(screen.queryByText('Content entry')).toBeTruthy()
  })

  it('render sub menu with categories', () => {
    const plugins = [
      {
        id: 'plugin-test-2',
        label: 'Container entry',
        icon: 'home',
        order: 2,
        content: [{
          id: 'plugin-test-1',
          label: 'Content entry',
          icon: 'clipboard',
          order: 1,
          integrationMode: 'href',
          externalLink: {
            url: 'https://google.it',
            sameWindow: false
          }
        }, {
          id: 'plugin-test-1',
          label: 'Content entry in category',
          icon: 'clipboard',
          order: 1,
          category: 'Cat 1',
          integrationMode: 'href',
          externalLink: {
            url: 'https://google.it',
            sameWindow: false
          }
        }]
      }
    ]
    // @ts-ignore
    RenderWithReactIntl(<AntSideMenu configuration={{plugins}}/>)

    expect(screen.getByText('Container entry')).toBeTruthy()
    expect(screen.queryByText('Content entry')).toBeFalsy()
    expect(screen.queryByText('Content entry in category')).toBeFalsy()
    expect(screen.queryByText('Cat 1')).toBeFalsy()

    userEvent.click(screen.getByText('Container entry'))

    expect(screen.getByText('Container entry')).toBeTruthy()
    expect(screen.queryByText('Content entry')).toBeTruthy()
    expect(screen.queryByText('Content entry in category')).toBeTruthy()
    expect(screen.queryByText('Cat 1')).toBeTruthy()
  })
})
