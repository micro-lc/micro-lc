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
import {routeStrategy} from '@utils/plugins/strategies/RouteStrategy'
import {history} from '@utils/plugins/PluginsLoaderFacade'
import {waitFor} from '@testing-library/react'
import {RESERVED_PATH} from '@constants'

jest.mock('history', () => ({
  createBrowserHistory: jest.fn((params) => ({
    push: jest.fn(),
    replace: jest.fn()
  }))
}))

describe('RouteStrategy tests', () => {
  it('Handle pluginRoute', async () => {
    routeStrategy({
      id: 'plugin-test-3',
      label: 'IFrame',
      icon: 'clipboard',
      order: 1,
      integrationMode: 'iframe',
      pluginRoute: '/iframeTest',
      pluginUrl: 'https://www.google.com/webhp?igu=1'
    }).handlePluginLoad()
    expect(history.push).toHaveBeenCalledWith(RESERVED_PATH.LOADING)
    await waitFor(() => expect(history.replace).toHaveBeenCalledWith('/iframeTest'))
  })

  it('Handle invalid plugin', async () => {
    routeStrategy({id: '', label: '', integrationMode: 'iframe'}).handlePluginLoad()
    expect(history.push).toHaveBeenCalledWith(RESERVED_PATH.LOADING)
    await waitFor(() => expect(history.replace).toHaveBeenCalledWith(''))
  })
})
