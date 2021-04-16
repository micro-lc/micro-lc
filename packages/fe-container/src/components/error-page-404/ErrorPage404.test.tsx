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

import {ErrorPage404} from '@components/error-page-404/ErrorPage404'

import RenderWithReactIntl from '../../__tests__/utils'

beforeEach(() => {
  RenderWithReactIntl(<ErrorPage404></ErrorPage404>)
})
describe('ErrorPage404 tests', () => {
  it('renders without crashing', async () => {
    expect(await screen.findByText('Oh No! Something is missing.')).toBeTruthy()
    expect(await screen.findByText('PAGE NOT FOUND')).toBeTruthy()
    expect(await screen.findByText('The page you were looking for may have been removed, have changed its name, or be')).toBeTruthy()
  })
})
