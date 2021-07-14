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
import {registerPlugin} from '@utils/plugins/PluginsLoaderFacade'
import {useCurrentPlugin} from '@hooks/useCurrentPlugin/useCurrentPlugin'
import {renderHook} from '@testing-library/react-hooks'

describe('useCurrentPlugin tests', () => {
  it('retrieve correct plugin', async () => {
    const currentPlugin: Plugin = {
      id: 'plugin-1',
      label: 'Plugin 1',
      integrationMode: 'iframe',
      pluginRoute: '/qiankunTest',
      pluginUrl: 'https://www.google.com/webhp?igu=1'
    }
    const otherPlugin: Plugin = {
      id: 'plugin-2',
      label: 'Plugin 2',
      integrationMode: 'iframe',
      pluginRoute: '/qiankunTest1',
      pluginUrl: 'https://www.google.com/webhp?igu=1'
    }
    registerPlugin(currentPlugin)
    registerPlugin(otherPlugin)

    Object.defineProperty(window, 'location', {
      value: {
        pathname: `http://localhost:3000/${currentPlugin.pluginRoute}`
      },
      writable: true
    })

    const {result} = renderHook(() => useCurrentPlugin())

    expect(result.current).toBe(currentPlugin)
    expect(result.current).not.toBe(otherPlugin)
  })
})
