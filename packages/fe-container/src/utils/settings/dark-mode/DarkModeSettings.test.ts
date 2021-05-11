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
import {retrieveDarkModeSettings, toggleDarkModeSettings} from '@utils/settings/dark-mode/DarkModeSettings'
import {STORAGE_KEY} from '@constants'

describe('Analytics Settings Manager tests', () => {
  afterEach(() => window.localStorage.clear())

  it('Dark mode not enabled', () => {
    expect(retrieveDarkModeSettings()).toBeFalsy()
  })

  it('Dark mode toggled', () => {
    expect(retrieveDarkModeSettings()).toBeFalsy()
    toggleDarkModeSettings()
    expect(retrieveDarkModeSettings()).toBeTruthy()
    toggleDarkModeSettings()
    expect(retrieveDarkModeSettings()).toBeFalsy()
  })

  it('Dark mode enabled', () => {
    window.localStorage.setItem(STORAGE_KEY.CURRENT_THEME, 'true')
    expect(retrieveDarkModeSettings()).toBeTruthy()
  })

  it('Dark mode disabled', () => {
    window.localStorage.setItem(STORAGE_KEY.CURRENT_THEME, 'false')
    expect(retrieveDarkModeSettings()).toBeFalsy()
  })
})
