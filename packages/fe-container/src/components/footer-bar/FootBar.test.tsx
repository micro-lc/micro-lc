// /*
//  * Copyright 2021 Mia srl
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

import React from 'react'

import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {FooterBar} from './FooterBar'
import RenderWithReactIntl from '../../__tests__/utils'
import {ConfigurationProvider} from '@contexts/Configuration.context'

describe('FooterBar tests', function () {
  const analytics = {
    privacyLink: 'https://www.mia-platform.eu/img/Privacy_Policy_Website_EN.pdf',
    disclaimer: 'Questo sito utilizza cookie proprietari e di terze parti per assicurarti la migliore esperienza di navigazione. Per ulteriori informazioni, leggi la ',
    gtmId: 'GTM-000000'
  }

  it('FooterBar is working', () => {
    RenderWithReactIntl(
      <ConfigurationProvider value={{
        analytics
      }}
      >
        <FooterBar/>
      </ConfigurationProvider>)
    expect(screen.queryByTestId('footer')).toBeTruthy()
    window.localStorage.clear()
  })

  it('FooterBar is closing when cookies rejected', function () {
    RenderWithReactIntl(
      <ConfigurationProvider value={{
        analytics
      }}
      >
        <FooterBar/>
      </ConfigurationProvider>)
    const toggle = screen.getByText('Decline')
    userEvent.click(toggle)
    expect(screen.queryByTestId('footer')).not.toBeTruthy()
    window.localStorage.clear()
  })

  it('FooterBar is closing when cookies accepted', function () {
    RenderWithReactIntl(
      <ConfigurationProvider value={{
        analytics
      }}
      >
        <FooterBar/>
      </ConfigurationProvider>)
    const toggle = screen.getByText('Accept')
    userEvent.click(toggle)
    expect(screen.queryByTestId('footer')).not.toBeTruthy()
    window.localStorage.clear()
  })

  it('FooterBar is not showing when cookies already accepted', function () {
    window.localStorage.setItem('gtmAccepted', JSON.stringify({
      hasAccepted: true
    }))
    RenderWithReactIntl(
      <ConfigurationProvider value={{
        analytics
      }}
      >
        <FooterBar/>
      </ConfigurationProvider>)
    expect(screen.queryByTestId('footer')).not.toBeTruthy()
    window.localStorage.clear()
  })

  it('FooterBar is not showing when analytics not passed inside configuration', function () {
    RenderWithReactIntl(
      <FooterBar/>
    )
    expect(screen.queryByTestId('footer')).not.toBeTruthy()
  })
})
