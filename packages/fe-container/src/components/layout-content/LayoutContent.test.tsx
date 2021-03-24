import React from 'react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {LayoutContent} from './LayoutContent'
import RenderWithReactIntl from '../../__tests__/utils'
import {MenuOpenedProvider} from '../../contexts/MenuOpened.context'

describe('LayoutContent tests', () => {
  it('overlay closes menu on click', () => {
    const setMenuOpened = jest.fn(close => {
    })

    RenderWithReactIntl(
      <MenuOpenedProvider value={{isMenuOpened: true, setMenuOpened}}>
        <LayoutContent/>
      </MenuOpenedProvider>
    )
    const overlay = screen.getByTestId('layout-content-overlay')
    userEvent.click(overlay)
    expect(setMenuOpened.mock.calls[0][0]).not.toBeTruthy()
  })
})
