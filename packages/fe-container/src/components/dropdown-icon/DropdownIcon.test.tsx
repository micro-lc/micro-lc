import RenderWithReactIntl from '../../__tests__/utils'
import React from 'react'
import {DropdownIcon} from '@components/dropdown-icon/DropdownIcon'

describe('DropdownIcon tests', () => {
  it('Chevron down when is closed', () => {
    RenderWithReactIntl(<DropdownIcon dropdownOpened={false}/>)
    expect(document.getElementsByClassName('opened').length).toBe(0)
  })

  it('Chevron up when is opened', () => {
    RenderWithReactIntl(<DropdownIcon dropdownOpened={true}/>)
    expect(document.getElementsByClassName('opened').length).toBe(1)
  })
})
