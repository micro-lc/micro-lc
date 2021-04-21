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
import {mount} from 'enzyme'
import {FormattedMessage, IntlProvider} from 'react-intl'

import PromiseComponent from '..'

const italian = {learn: 'Impara React'}

const english = {learn: 'Learn React'}

describe('PromiseComponent', () => {
  it('renders children passing data if italian data is defined', (done) => {
    const promiseFunction = jest.fn().mockResolvedValueOnce(italian)
    const element = mount(
      <PromiseComponent promiseFunction={promiseFunction}>
        {data => (
          <IntlProvider locale={'en'} messages={data}>
            <FormattedMessage id='learn' />
          </IntlProvider>
        )}
      </PromiseComponent>
    )
    setImmediate(() => {
      element.mount()
      expect(element.find(FormattedMessage).text()).toEqual('Impara React')
      done()
    })
  })

  it('renders children passing data if english data is defined', (done) => {
    const promiseFunction = jest.fn().mockResolvedValueOnce(english)
    const element = mount(
      <PromiseComponent promiseFunction={promiseFunction}>
        {data => (
          <IntlProvider locale={'en'} messages={data}>
            <FormattedMessage id='learn' />
          </IntlProvider>
        )}
      </PromiseComponent>
    )
    setImmediate(() => {
      element.mount()
      expect(element.find(FormattedMessage).text()).toEqual('Learn React')
      done()
    })
  })

  it('renders div with error when usePromise returns data undefined and isError true', () => {
    const promiseFunction = jest.fn().mockRejectedValueOnce({isError: true})
    const children = jest.fn()
    const element = mount(
      <PromiseComponent promiseFunction={promiseFunction}>
        {data => children(data)}
      </PromiseComponent>
    )
    setImmediate(() => {
      expect(element.find('div').text()).toEqual('Error')
      expect(children).toHaveBeenCalledTimes(0)
    })
  })

  it('renders div with loading message when usePromise returns data undefined and isError false', () => {
    const promiseFunction = jest.fn().mockResolvedValue(undefined)
    const children = jest.fn()
    const element = mount(
      <PromiseComponent promiseFunction={promiseFunction}>
        {data => children(data)}
      </PromiseComponent>
    )
    setImmediate(() => {
      expect(element.find('div').text()).toEqual('Loading...')
      expect(children).toHaveBeenCalledTimes(0)
    })
  })
})
