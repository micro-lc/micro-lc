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
