import React from 'react'
import {shallow} from 'enzyme'

import App from '../App'

it('renders without crashing', () => {
  const element = shallow(<App />)
  expect(element.length).toEqual(1)
})
