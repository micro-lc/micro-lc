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
import {screen} from '@testing-library/react'

import React from 'react'

import RenderWithReactIntl from '../../__tests__/utils'
import {MicrolcErrorBoundary} from '@components/microlc-error-boundary/MicrolcErrorBoundary'

const ThrowableComponent: React.FC = () => {
  throw new Error('Error that must be catched in boundary!')
}

describe('MicrolcErrorBoundary tests', () => {
  it('Show correctly children', () => {
    RenderWithReactIntl(
      <MicrolcErrorBoundary>
        <p>{'Everything is ok'}</p>
      </MicrolcErrorBoundary>
    )
    expect(screen.getByText('Everything is ok')).toBeTruthy()
    expect(screen.queryByText('Something went wrong:')).not.toBeTruthy()
  })

  it('Handle correctly errors', () => {
    RenderWithReactIntl(
      <MicrolcErrorBoundary>
        <p>{'Everything is ok'}</p>
        <ThrowableComponent/>
      </MicrolcErrorBoundary>
    )
    expect(screen.queryByText('Everything is ok')).not.toBeTruthy()
    expect(screen.getByText('Something went wrong:')).toBeTruthy()
    expect(screen.getByText('Error that must be catched in boundary!')).toBeTruthy()
  })
})
