import React from 'react'
import {SideMenu} from '../../components/side-menu/SideMenu'
import {mount} from 'enzyme'

describe('SideMenu tests', () => {
  it('side menu show entries', () => {
    const component = mount(<SideMenu entries={[{name: 'entry_1'}, {name: 'entry_2'}]}/>)
    component.mount()
    expect(component.text()).toContain('entry_1')
    expect(component.text()).toContain('entry_2')
    component.unmount()
  })
})
