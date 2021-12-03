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
import {ConfigurationProvider} from '@contexts/Configuration.context'
import {RightMenu} from '@mia-platform/core'
import {render} from '@testing-library/react'
import React from 'react'

import {TopRightSection} from './TopRightSection'
describe('RightMenu tests', () => {
  const configurationsBuilder = (rightMenu: RightMenu, shared: any = {}) => ({
    theming: {
      header: {},
      logo: {
        url_light_image: '',
        alt: ''
      },
      menuLocation: 'sideBar',
      variables: {}
    },
    shared,
    plugins: [{
      id: 'plugin-test-3',
      label: 'Qiankun entry',
      icon: 'clipboard',
      order: 3,
      integrationMode: 'qiankun',
      pluginRoute: '/qiankunTest',
      pluginUrl: 'http://localhost:8764'
    }],
    rightMenu
  })

  it('web-components are instantiated', () => {
    const configuration = configurationsBuilder([{
      entry: 'http://127.0.0.1:8080/wc-entry.esm.js',
      tag: 'wc-tag'
    }, {
      entry: 'http://127.0.0.1:8080/wc-entry-1.esm.js',
      tag: 'wc-tag-1'
    }])
    render(
      // @ts-ignore
      <ConfigurationProvider value={configuration}>
        <TopRightSection />
      </ConfigurationProvider>
    )

    expect(document.querySelector('wc-tag')).not.toBeNull()
    expect(document.querySelector('wc-tag-1')).not.toBeNull()
  })

  it('web-component attributes configured', () => {
    const configuration = configurationsBuilder([{
      entry: 'http://127.0.0.1:8080/wc-entry.esm.js',
      tag: 'wc-tag',
      attributes: {
        id: 'your-wc-tag'
      }
    }, {
      entry: 'http://127.0.0.1:8080/wc-entry-1.esm.js',
      tag: 'wc-tag-1',
      attributes: {
        id: 'your-wc-tag'
      }
    }])
    render(
      // @ts-ignore
      <ConfigurationProvider value={configuration}>
        <TopRightSection />
      </ConfigurationProvider>
    )

    expect(document.querySelector('wc-tag')).not.toBeNull()
    expect(document.getElementById('your-wc-tag')).not.toBeNull()
  })

  it('shared props are injected', () => {
    const configuration = configurationsBuilder([{
      entry: 'http://127.0.0.1:8080/wc-entry.esm.js',
      tag: 'wc-tag'
    }], {
      props: {
        id: 'your-wc-tag'
      }
    })
    render(
      // @ts-ignore
      <ConfigurationProvider value={configuration}>
        <TopRightSection />
      </ConfigurationProvider>
    )

    expect(document.querySelector('wc-tag')).not.toBeNull()
    expect(document.getElementById('your-wc-tag')).not.toBeNull()
  })
})
