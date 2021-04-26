import React from 'react'
import {screen} from '@testing-library/react'

import {DarkModeSwitch} from '@components/dark-mode-switch/DarkModeSwitch'
import {switchTheme} from '@utils/theme/ThemeManager'
import RenderWithReactIntl from '../../__tests__/utils'
import userEvent from '@testing-library/user-event'

jest.mock('@utils/theme/ThemeManager', () => ({
  switchTheme: jest.fn()
}))

describe('DarkModeSwitch tests', () => {
  it('Has left and right label', () => {
    RenderWithReactIntl(<DarkModeSwitch/>)
    expect(screen.findByDisplayValue('Light')).toBeTruthy()
    expect(screen.findByDisplayValue('Dark')).toBeTruthy()
  })

  it('Toggle calls the switchTheme', async () => {
    RenderWithReactIntl(<DarkModeSwitch/>)
    await userEvent.click(screen.getByTestId('dark-theme-toggle'))
    expect(switchTheme).toHaveBeenCalled()
  })
})
