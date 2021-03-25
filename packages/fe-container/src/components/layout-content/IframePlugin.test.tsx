import React from 'react'
import {Plugin} from '@mia-platform/core'

import RenderWithReactIntl from '../../__tests__/utils'
import {IframePlugin} from './IframePlugin'

describe('Test iframe plugin', () => {
  it('Menu close on iframe click', () => {
    window.addEventListener = jest.fn((arg1, arg2) => {
    })
    const plugin: Plugin = {
      id: 'plugin-test-3',
      label: 'IFrame',
      icon: 'clipboard',
      order: 3,
      integrationMode: 'iframe',
      pluginRoute: '/iframeTest',
      pluginUrl: 'https://www.google.com/webhp?igu=1'
    }
    RenderWithReactIntl(<IframePlugin {...plugin}/>)
    const allWindowListenersType = window.addEventListener.mock.calls.map(call => call[0])
    expect(allWindowListenersType).toContain('blur')
  })
})
