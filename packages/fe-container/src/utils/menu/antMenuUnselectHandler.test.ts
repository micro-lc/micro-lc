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
import {onSelectHandler} from '@utils/menu/antMenuUnselectHandler'
import {SelectInfo} from 'rc-menu/lib/interface'
import {expect} from '@playwright/test'

describe('Ant menu unselect handler', () => {
  it('correctly handle empty array', () => {
    // @ts-ignore
    const selectInfo: SelectInfo = {
      selectedKeys: ['a', 'b', 'c']
    }
    onSelectHandler([])(selectInfo)
    expect(selectInfo.selectedKeys).toMatchObject(['a', 'b', 'c'])
  })

  it('correctly handle undefined selectedKeys', () => {
    // @ts-ignore
    const selectInfo: SelectInfo = {
      selectedKeys: undefined
    }
    onSelectHandler(['a'])(selectInfo)
    expect(selectInfo.selectedKeys).toBeUndefined()
  })

  it('correctly delete an element', () => {
    // @ts-ignore
    const selectInfo: SelectInfo = {
      selectedKeys: ['a', 'b', 'c']
    }
    onSelectHandler(['b'])(selectInfo)
    expect(selectInfo.selectedKeys).toMatchObject(['a', 'c'])
  })

  it('correctly delete more than one element', () => {
    // @ts-ignore
    let selectInfo: SelectInfo = {
      selectedKeys: ['a', 'b', 'c', 'd']
    }
    onSelectHandler(['b', 'c'])(selectInfo)
    expect(selectInfo.selectedKeys).toMatchObject(['a', 'd'])

    // @ts-ignore
    selectInfo = {
      selectedKeys: ['a', 'b', 'c', 'd']
    }
    onSelectHandler(['a', 'd'])(selectInfo)
    expect(selectInfo.selectedKeys).toMatchObject(['b', 'c'])
  })
})
