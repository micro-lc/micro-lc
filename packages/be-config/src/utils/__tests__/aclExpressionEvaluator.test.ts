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

import {aclExpressionEvaluator} from '../aclExpressionEvaluator'
import validMicrolcConfig from '../../__tests__/configurationMocks/validMicrolcConfig.json'

describe('Plugins filter tests', () => {
  it('Return all the plugins without expression', () => {
    const plugins = validMicrolcConfig.plugins as Plugin[]
    const pluginsFiltered = aclExpressionEvaluator(plugins, [])
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
    const pluginsFiltered = aclExpressionEvaluator(plugins, ['ceo', 'admin', 'developer'])
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
    const pluginsFiltered = aclExpressionEvaluator(plugins, ['po', 'reviewer'])
    expect(pluginsFiltered.length).toBe(2)
    expect(pluginsFiltered).toMatchObject(allowedPlugins)
  })

  it('Everything is fine with empty plugins list', () => {
    const pluginsFiltered = aclExpressionEvaluator([], ['po', 'reviewer'])
    expect(pluginsFiltered).toMatchObject([])
  })

  it('Everything is fine with empty plugins and groups list', () => {
    const pluginsFiltered = aclExpressionEvaluator([], [])
    expect(pluginsFiltered).toMatchObject([])
  })

  it('general object and no groups', () => {
    const allConfiguration = {
      test: {
        nested: {
          object: {},
        },
      },
    }
    const pluginsFiltered = aclExpressionEvaluator(allConfiguration, [])
    expect(pluginsFiltered).toMatchObject(allConfiguration)
  })

  it('general acl object and no groups', () => {
    const allConfiguration = {
      test: {
        nested: {
          aclExpression: 'groups.admin && groups.ceo',
          object: {},
        },
      },
    }
    const pluginsFiltered = aclExpressionEvaluator(allConfiguration, [])
    expect(pluginsFiltered).toMatchObject({test: {}})
  })

  it('general acl object and groups', () => {
    const allConfiguration = {
      test: {
        nested: {
          aclExpression: 'groups.admin && groups.ceo',
          object: {},
        },
      },
    }
    const pluginsFiltered = aclExpressionEvaluator(allConfiguration, ['ceo', 'admin'])
    expect(pluginsFiltered).toMatchObject(allConfiguration)
  })

  it('general acl object and invalid groups', () => {
    const allConfiguration = {
      test: {
        nested: {
          aclExpression: 'groups.admin && groups.ceo',
          object: {},
        },
      },
    }
    const pluginsFiltered = aclExpressionEvaluator(allConfiguration, ['po', 'admin'])
    expect(pluginsFiltered).toMatchObject({test: {}})
  })

  it('not object value', () => {
    const pluginsFiltered = aclExpressionEvaluator(true, ['po', 'admin'])
    expect(pluginsFiltered).toBe(true)
  })

  it('remove at least 2 entry', () => {
    const toFilter = {
      plugins: [
        {
          aclExpression: 'groups.superadmin || groups.admin || groups.secretary',
        },
        {
          aclExpression: 'groups.superadmin || groups.admin || groups.doctor',
        },
        {
          aclExpression: 'groups.superadmin || groups.admin',
        },
      ],
    }
    const filtered = aclExpressionEvaluator(toFilter, ['doctor'])
    expect(filtered.plugins.length).toBe(1)
  })
})
