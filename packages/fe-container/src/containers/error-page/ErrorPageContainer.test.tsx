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

import {ErrorPageContainer} from './ErrorPageContainer'
import RenderWithReactIntl from '../../__tests__/utils'
import {ReactComponent as Error404Logo} from '@components/error-page-404/assets/ErrorImage404.svg'

describe('ErrorPageContainer tests', () => {
  it('Test ErrorPage 404 renders', () => {
    RenderWithReactIntl(
      <ErrorPageContainer
descriptionKeys={['404_description', '404_description_1', '404_description_2']}
                          titleKey='404_title'
      >
        <Error404Logo/>
      </ErrorPageContainer>
    )
    expect(screen.getByText('PAGE NOT FOUND')).toBeTruthy()
  })
})
