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
import {isDarkModeSet, toggleDarkModeSettings} from '@utils/settings/dark-mode/DarkModeSettings'
import {STORAGE_KEY} from '@constants'

describe('Dark Mode Settings Manger tests', () => {
  afterEach(() => window.localStorage.clear())

  it('Dark mode not enabled', () => {
    expect(isDarkModeSet()).toBeFalsy()
  })

  it('Dark mode toggled', () => {
    expect(isDarkModeSet()).toBeFalsy()
    toggleDarkModeSettings()
    expect(isDarkModeSet()).toBeTruthy()
    toggleDarkModeSettings()
    expect(isDarkModeSet()).toBeFalsy()
  })

  it('Dark mode enabled', () => {
    window.localStorage.setItem(STORAGE_KEY.CURRENT_THEME, 'dark')
    expect(isDarkModeSet()).toBeTruthy()
  })

  it('Dark mode disabled', () => {
    window.localStorage.setItem(STORAGE_KEY.CURRENT_THEME, 'light')
    expect(isDarkModeSet()).toBeFalsy()
  })
})
