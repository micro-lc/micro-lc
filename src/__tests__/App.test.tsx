import React from 'react'
import {mount, ReactWrapper} from 'enzyme'

import App from '../App'

describe('App test', () => {
  let component: ReactWrapper

  beforeEach(() => {
    component = mount(<App/>)
    component.mount()
  })

  afterEach(() => {
    component.unmount()
  })

  it('renders without crashing', () => {
    expect(component.length).toEqual(1)
  })

  it('toggle is working', () => {
    const componentToggle = component.find('#topbar-side-menu-toggle').first()
    expect(component.text()).not.toContain('entry_1')
    componentToggle.simulate('click')
    expect(component.text()).toContain('entry_1')
    componentToggle.simulate('click')
    expect(component.text()).not.toContain('entry_1')
  })
})
