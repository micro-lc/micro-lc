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
import {Configuration} from '@mia-platform/core'

import {isSideBarToShow, isFixedSideBarToShow, isFixedSidebarCollapsed, toggleFixedSidebarState} from '@utils/settings/side-bar/SideBarSettings'
import {STORAGE_KEY} from '@constants'

describe('Side Bar Settings Manager tests', () => {
  const configurationsBuilder = (menuLocation: 'sideBar' | 'topBar' | 'fixedSideBar' | undefined): Configuration => ({
    theming: {
      logo: {url_light_image: '', alt: ''},
      menuLocation,
      variables: {}
    }
  })

  describe('isSideBarToShow', () => {
    it('returns true if theming configuration is not provided', () => {
      expect(isSideBarToShow({})).toBeTruthy()
    })

    it('returns true if menuLocation is undefined', () => {
      const configuration = configurationsBuilder(undefined)
      expect(isSideBarToShow(configuration)).toBeTruthy()
    })

    it('returns true if menuLocation is sideBar', () => {
      const configuration = configurationsBuilder('sideBar')
      expect(isSideBarToShow(configuration)).toBeTruthy()
    })

    it('returns false if menuLocation is fixedSideBar', () => {
      const configuration = configurationsBuilder('fixedSideBar')
      expect(isSideBarToShow(configuration)).toBeFalsy()
    })

    it('returns false if menuLocation is topBar', () => {
      const configuration = configurationsBuilder('topBar')
      expect(isSideBarToShow(configuration)).toBeFalsy()
    })
  })

  describe('isFixedSideBarToShow', () => {
    it('returns false if theming configuration is not provided', () => {
      expect(isFixedSideBarToShow({})).toBeFalsy()
    })

    it('returns true if menuLocation is fixedSideBar', () => {
      const configuration = configurationsBuilder('fixedSideBar')
      expect(isFixedSideBarToShow(configuration)).toBeTruthy()
    })

    it('returns false if menuLocation is undefined', () => {
      const configuration = configurationsBuilder(undefined)
      expect(isFixedSideBarToShow(configuration)).toBeFalsy()
    })

    it('returns false if menuLocation is sideBar', () => {
      const configuration = configurationsBuilder('sideBar')
      expect(isFixedSideBarToShow(configuration)).toBeFalsy()
    })

    it('returns false if menuLocation is topBar', () => {
      const configuration = configurationsBuilder('topBar')
      expect(isFixedSideBarToShow(configuration)).toBeFalsy()
    })
  })

  describe('Fixed sidebar state', () => {
    afterEach(() => window.localStorage.clear())

    it('expanded by default', () => {
      expect(isFixedSidebarCollapsed()).toBeFalsy()
    })

    it('collapsed state toggled', () => {
      expect(isFixedSidebarCollapsed()).toBeFalsy()
      toggleFixedSidebarState()
      expect(isFixedSidebarCollapsed()).toBeTruthy()
      toggleFixedSidebarState()
      expect(isFixedSidebarCollapsed()).toBeFalsy()
    })

    it('collapsed', () => {
      window.localStorage.setItem(STORAGE_KEY.FIXED_SIDEBAR_STATE, 'collapsed')
      expect(isFixedSidebarCollapsed()).toBeTruthy()
    })

    it('expanded', () => {
      window.localStorage.setItem(STORAGE_KEY.FIXED_SIDEBAR_STATE, 'expanded')
      expect(isFixedSidebarCollapsed()).toBeFalsy()
    })
  })
})
