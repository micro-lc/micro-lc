import React from 'react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {DarkModeSwitch} from '@components/dark-mode-switch/DarkModeSwitch'
import {switchTheme} from '@utils/theme/ThemeManager'
import {retrieveDarkModeSettings} from '@utils/settings/dark-mode/DarkModeSettings'

import RenderWithReactIntl from '../../__tests__/utils'

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
    expect(retrieveDarkModeSettings()).toBeFalsy()
    RenderWithReactIntl(<DarkModeSwitch/>)
    await userEvent.click(screen.getByTestId('dark-theme-toggle'))
    expect(switchTheme).toHaveBeenCalled()
    expect(retrieveDarkModeSettings()).toBeTruthy()
  })
})
