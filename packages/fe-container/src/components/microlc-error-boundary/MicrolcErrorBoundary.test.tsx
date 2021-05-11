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

const ThrowableWithErrorComponent: React.FC<{errorStatusCode: number}> = ({errorStatusCode}) => {
  // eslint-disable-next-line no-throw-literal
  throw {errorStatusCode}
}

describe('MicrolcErrorBoundary tests', () => {
  it('Show correctly children', () => {
    RenderWithReactIntl(
      <MicrolcErrorBoundary>
        <p>{'Everything is ok'}</p>
      </MicrolcErrorBoundary>
    )
    expect(screen.getByText('Everything is ok')).toBeTruthy()
    expect(screen.queryByText('Oops! Something went wrong.')).toBeFalsy()
  })

  it('Handle correctly errors without errorStatusCode as 500', () => {
    RenderWithReactIntl(
      <MicrolcErrorBoundary>
        <p>{'Everything is ok'}</p>
        <ThrowableComponent/>
      </MicrolcErrorBoundary>
    )
    expect(screen.queryByText('Everything is ok')).toBeFalsy()
    expect(screen.getByText('Oops! Something went wrong.')).toBeTruthy()
    expect(screen.getByText('Our team has been informed and is working to fix the problem.')).toBeTruthy()
  })

  it('Handle correctly errors with unknown errorStatusCode as 500', () => {
    RenderWithReactIntl(
      <MicrolcErrorBoundary>
        <p>{'Everything is ok'}</p>
        <ThrowableWithErrorComponent errorStatusCode={403}/>
      </MicrolcErrorBoundary>
    )
    expect(screen.queryByText('Everything is ok')).toBeFalsy()
    expect(screen.getByText('Oops! Something went wrong.')).toBeTruthy()
    expect(screen.getByText('Our team has been informed and is working to fix the problem.')).toBeTruthy()
  })

  it('Handle correctly errors with errorStatusCode as 404', () => {
    RenderWithReactIntl(
      <MicrolcErrorBoundary>
        <p>{'Everything is ok'}</p>
        <ThrowableWithErrorComponent errorStatusCode={404}/>
      </MicrolcErrorBoundary>
    )
    expect(screen.queryByText('Everything is ok')).toBeFalsy()
    expect(screen.getByText('Oh No! Something is missing.')).toBeTruthy()
    expect(screen.getByText('PAGE NOT FOUND')).toBeTruthy()
  })

  it('Handle correctly errors with errorStatusCode as 401', () => {
    RenderWithReactIntl(
      <MicrolcErrorBoundary>
        <p>{'Everything is ok'}</p>
        <ThrowableWithErrorComponent errorStatusCode={401}/>
      </MicrolcErrorBoundary>
    )
    expect(screen.queryByText('Everything is ok')).toBeFalsy()
    expect(screen.getByText('Unauthorized access')).toBeTruthy()
    expect(screen.getByText('It would seem that you don\'t have permission to access this page, but don\'t')).toBeTruthy()
  })
})
