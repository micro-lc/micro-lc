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
import {Plugin} from '@mia-platform/core'

import RenderWithReactIntl from '../../__tests__/utils'
import {ConfigurationProvider} from '@contexts/Configuration.context'
import {BurgerIcon} from '@components/burger-icon/BurgerIcon'

describe('Burger icon tests', () => {
  const plugin: Plugin = {
    id: 'plugin-test-3',
    label: 'Qiankun entry',
    icon: 'clipboard',
    order: 3,
    integrationMode: 'qiankun',
    pluginRoute: '/qiankunTest',
    pluginUrl: 'http://localhost:8764'
  }

  const configurationsBuilder = (menuLocation: 'sideBar' | 'topBar' | undefined, plugins: Plugin[] | undefined) => ({
    theming: {
      header: {},
      logo: {
        url_light: '',
        alt: ''
      },
      menuLocation,
      variables: {}
    },
    plugins
  })

  it('Burger icon doesn\'t shows without plugins', () => {
    const configuration = configurationsBuilder(undefined, undefined)
    RenderWithReactIntl(
      <ConfigurationProvider value={configuration}>
        <BurgerIcon/>
      </ConfigurationProvider>
    )
    expect(screen.queryByTestId('top-bar-side-menu-toggle')).not.toBeTruthy()
  })

  it('Burger icon doesn\'t shows with only 1 plugin', () => {
    const configuration = configurationsBuilder(undefined, [plugin])
    RenderWithReactIntl(
      <ConfigurationProvider value={configuration}>
        <BurgerIcon/>
      </ConfigurationProvider>
    )
    expect(screen.queryByTestId('top-bar-side-menu-toggle')).not.toBeTruthy()
  })

  it('Burger icon shows with more than 1', () => {
    const configuration = configurationsBuilder(undefined, [plugin, plugin])
    RenderWithReactIntl(
      <ConfigurationProvider value={configuration}>
        <BurgerIcon/>
      </ConfigurationProvider>
    )
    expect(screen.getByTestId('top-bar-side-menu-toggle')).toBeTruthy()
  })

  it('Burger icon doesn\'t shows for menuLocation topBar even with more than 1 plugins', () => {
    const configuration = configurationsBuilder('topBar', [plugin, plugin])
    RenderWithReactIntl(
      <ConfigurationProvider value={configuration}>
        <BurgerIcon/>
      </ConfigurationProvider>
    )
    expect(screen.queryByTestId('top-bar-side-menu-toggle')).not.toBeTruthy()
  })
})
