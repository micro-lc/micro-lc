import React from 'react'
import {TopBar} from '../components/topbar/TopBar'
import {mount, shallow} from 'enzyme'

describe('TopBar tests', function () {
  it('TopBar is working', () => {
    const component = shallow(<TopBar/>)
    expect(component.find('#topbar-title').text()).toEqual("Hello, I'm the TopBar!")
  })

  it('TopBar is toggling', () => {
    let lastToggle = false
    const component = mount(
      <TopBar
        onBurgerClick={(isToggled) => {
          lastToggle = !lastToggle
          expect(isToggled).toEqual(lastToggle)
        }}
      />)
    component.mount()
    component.find('#topbar-side-menu-toggle').simulate('click')
    component.find('#topbar-side-menu-toggle').simulate('click')
  })
})
