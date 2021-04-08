import React from 'react'
import {screen} from '@testing-library/react'

import RenderWithReactIntl from '../../__tests__/utils'
import {UserMenuOverlay} from '@components/user-menu-overlay/UserMenuOverlay'

describe('UserMenuOverlay tests', () => {
  it('Shows always log out entry', () => {
    RenderWithReactIntl(<UserMenuOverlay/>)
    expect(screen.findByText('Log Out')).toBeTruthy()
  })
})
