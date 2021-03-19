import React from 'react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {LayoutContent} from './LayoutContent'
import RenderWithReactIntl from '../../__tests__/utils'

describe('LayoutContent tests', () => {
  it('overlay closes menu on click', () => {
    const mockLayoutClick = jest.fn(close => {})

    RenderWithReactIntl(<LayoutContent burgerState={[true, mockLayoutClick]}/>)
    const overlay = screen.queryByTestId('layout-content-overlay')

    userEvent.click(overlay)
    expect(mockLayoutClick.mock.calls[0][0]).not.toBeTruthy()
  })
})
