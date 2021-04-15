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

import {ErrorPage500} from '@components/error-page-500/ErrorPage500'

import RenderWithReactIntl from '../../__tests__/utils'
beforeEach(() => {
  RenderWithReactIntl(<ErrorPage500></ErrorPage500>)
})
describe('ErrorPage500 tests', () => {
  it('renders without crashing', async () => {
    expect(await screen.findByText('Oops! Something went wrong.')).toBeTruthy()
    expect(await screen.findByText('Our team has been informed and is working to fix the problem.')).toBeTruthy()
    expect(await screen.findByText("It won't take long ... try again later.")).toBeTruthy()
  })
})
