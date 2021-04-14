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
import {hrefStrategy} from '@utils/plugins/strategies/HrefStrategy'

describe('Href strategy tests', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
        writable: true
      }
    })
    window.location.href = ''
  })

  it('Same window change location', () => {
    const sameWindowLink = {
      url: 'https://google.it',
      sameWindow: true
    }
    hrefStrategy(sameWindowLink).handlePluginLoad()
    expect(window.location.href).toBe('https://google.it')
  })

  it('Open new window with the url', () => {
    const otherWindowLink = {
      url: 'https://google.it',
      sameWindow: false
    }
    window.open = jest.fn()
    hrefStrategy(otherWindowLink).handlePluginLoad()
    expect(window.open).toHaveBeenCalledWith('https://google.it')
  })

  it('Invalid configuration: nothing happen', () => {
    window.open = jest.fn()
    hrefStrategy().handlePluginLoad()
    expect(window.open).not.toHaveBeenCalled()
    expect(window.location.href).toBe('')
  })
})
