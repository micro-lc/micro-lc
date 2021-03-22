import React from 'react'
import {screen} from '@testing-library/react'

import {SideMenu} from './SideMenu'
import RenderWithReactIntl from '../../__tests__/utils'

describe('SideMenu tests', () => {
  it('side menu show entries', () => {
    RenderWithReactIntl(<SideMenu entries={[{name: 'entry_1', id: '1'}, {name: 'entry_2', id: '2'}]}/>)
    expect(screen.queryByText('entry_1')).toBeVisible()
    expect(screen.queryByText('entry_2')).toBeVisible()
    expect(screen.queryByText('entry_3')).toBeNull()
  })
})
