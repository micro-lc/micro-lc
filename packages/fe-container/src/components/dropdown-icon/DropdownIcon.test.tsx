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
import RenderWithReactIntl from '../../__tests__/utils'
import React from 'react'
import {DropdownIcon} from '@components/dropdown-icon/DropdownIcon'

describe('DropdownIcon tests', () => {
  it('Chevron down when is closed', () => {
    RenderWithReactIntl(<DropdownIcon dropdownOpened={false}/>)
    expect(document.getElementsByClassName('opened').length).toBe(0)
  })

  it('Chevron up when is opened', () => {
    RenderWithReactIntl(<DropdownIcon dropdownOpened={true}/>)
    expect(document.getElementsByClassName('opened').length).toBe(1)
  })
})
