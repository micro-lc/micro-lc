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

  it('LayoutContent renders even without plugins', () => {
    const setMenuOpened = jest.fn(close => {
    })

    RenderWithReactIntl(
      <ConfigurationProvider
        value={{
          theming: {
            header: {pageTitle: 'Mia Care', favicon: 'favicon_url'},
            variables: {},
            logo: {url: 'logo_url', alt: 'logo'}
          }
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
