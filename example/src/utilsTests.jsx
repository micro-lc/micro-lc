/*
 * Copyright 2021 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import {IntlProvider} from 'react-intl'
import {MemoryRouter} from 'react-router-dom'
import {mount, shallow} from 'enzyme'

import strings from './strings'

const testStrings = {
  ...strings.en,
  'test.string': 'string test',
  'test.values.string': 'string with values {value}'
}
const intlProvider = new IntlProvider({locale: 'en', messages: testStrings}, {})
const {intl} = intlProvider.state

export function mountWrapperComponent (children) {
  return mount(
    <IntlProvider locale={'en'} messages={testStrings}>
      {children}
    </IntlProvider>
  )
}

export function mountWrapperContainer (store, initialEntries, children) {
  return mount(
    <IntlProvider locale={'en'} messages={testStrings}>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </IntlProvider>
  )
}

export function shallowWithIntl (node, context) {
  return shallow(React.cloneElement(node, {intl}), {context: {intl, ...context}})
}
