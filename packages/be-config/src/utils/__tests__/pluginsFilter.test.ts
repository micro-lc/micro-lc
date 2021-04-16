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
import {Plugin} from '@mia-platform/core'

import {pluginsFilter} from '../pluginsFilter'
import validMicrolcConfig from '../../__tests__/configurationMocks/validMicrolcConfig.json'

describe('Plugins filter tests', () => {
  it('Return all the plugins without expression', () => {
    const plugins = validMicrolcConfig.plugins as Plugin[]
    const pluginsFiltered = pluginsFilter(plugins, [])
    expect(pluginsFiltered.length).toBe(plugins.length)
    expect(pluginsFiltered).toMatchObject(plugins)
  })

  it('Return only the plugins with valid expression', () => {
    const allowedPlugin: Plugin = {
      id: '1',
      integrationMode: 'iframe',
      label: 'Plugin 1',
      aclExpression: 'groups.admin && groups.ceo',
    }
    const plugins: Plugin[] = [allowedPlugin, {
      id: '2',
      integrationMode: 'iframe',
      label: 'Plugin 2',
      aclExpression: '!groups.developer',
    }]
    const pluginsFiltered = pluginsFilter(plugins, ['ceo', 'admin', 'developer'])
    expect(pluginsFiltered.length).toBe(1)
    expect(pluginsFiltered[0]).toBe(allowedPlugin)
  })

  it('Return a mix of plugins with expression and without expression', () => {
    const allowedPlugins: Plugin[] = [{
      id: '3',
      integrationMode: 'iframe',
      label: 'Plugin 3',
    }, {
      id: '2',
      integrationMode: 'iframe',
      label: 'Plugin 2',
      aclExpression: '!groups.developer',
    }]
    const plugins: Plugin[] = [...allowedPlugins, {
      id: '1',
      integrationMode: 'iframe',
      label: 'Plugin 1',
      aclExpression: 'groups.admin && groups.ceo',
    }]
    const pluginsFiltered = pluginsFilter(plugins, ['po', 'reviewer'])
    expect(pluginsFiltered.length).toBe(2)
    expect(pluginsFiltered).toMatchObject(allowedPlugins)
  })

  it('Everything is fine with empty plugins list', () => {
    const pluginsFiltered = pluginsFilter([], ['po', 'reviewer'])
    expect(pluginsFiltered).toMatchObject([])
  })

  it('Everything is fine with empty plugins and groups list', () => {
    const pluginsFiltered = pluginsFilter([], [])
    expect(pluginsFiltered).toMatchObject([])
  })
})
