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
import userEvent from '@testing-library/user-event'

import {TopBar} from './TopBar'
import RenderWithReactIntl from '../../__tests__/utils'
import {MenuOpenedProvider} from '@contexts/MenuOpened.context'

describe('TopBar tests', function () {
  it('TopBar is working', () => {
    RenderWithReactIntl(
      <MenuOpenedProvider value={{
        isMenuOpened: false,
        setMenuOpened: () => {
        }
      }}
      >
        <TopBar/>
      </MenuOpenedProvider>
    )
    expect(screen.queryByTestId('company-logo')).toBeTruthy()
  })

  it('Closed TopBar is opening', () => {
    const mockBurgerClick = jest.fn(isToggled => {
    })

    RenderWithReactIntl(
      <MenuOpenedProvider value={{isMenuOpened: false, setMenuOpened: mockBurgerClick}}>
        <TopBar/>
      </MenuOpenedProvider>
    )
    const toggle = screen.getByTestId('top-bar-side-menu-toggle')
    userEvent.click(toggle)
    expect(mockBurgerClick.mock.calls[0][0]).toBeTruthy()
  })

  it('Open TopBar is closing', () => {
    const mockBurgerClick = jest.fn(isToggled => {
    })

    RenderWithReactIntl(
      <MenuOpenedProvider value={{isMenuOpened: true, setMenuOpened: mockBurgerClick}}>
        <TopBar/>
      </MenuOpenedProvider>
    )
    const toggle = screen.getByTestId('top-bar-side-menu-toggle')
    userEvent.click(toggle)
    expect(mockBurgerClick.mock.calls[0][0]).not.toBeTruthy()
  })
})
