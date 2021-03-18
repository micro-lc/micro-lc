import React from 'react'
import {render, screen} from '@testing-library/react'

import {SideMenu} from '../components/side-menu/SideMenu'

describe('SideMenu tests', () => {
  it('side menu show entries', () => {
    render(<SideMenu entries={[{name: 'entry_1'}, {name: 'entry_2'}]}/>)
    expect(screen.queryByText('entry_1')).toBeVisible()
    expect(screen.queryByText('entry_2')).toBeVisible()
    expect(screen.queryByText('entry_3')).toBeNull()
  })
})
