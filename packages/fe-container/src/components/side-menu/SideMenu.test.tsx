import React from 'react'
import {screen} from '@testing-library/react'

import {SideMenu} from './SideMenu'
import RenderWithReactIntl from '../../__tests__/utils'
import userEvent from '@testing-library/user-event'

describe('SideMenu tests', () => {
  it('side menu show entries', () => {
    const entriesHref = {pluginStrategy: 'href', hrefConfig: {sameWindow: false, url: ''}}
    RenderWithReactIntl(<SideMenu
      entries={[
        {name: 'entry_1', id: '1', ...entriesHref}, {name: 'entry_2', id: '2', ...entriesHref}
      ]}
                        />)
    expect(screen.queryByText('entry_1')).toBeVisible()
    expect(screen.queryByText('entry_2')).toBeVisible()
    expect(screen.queryByText('entry_3')).toBeNull()
  })

  it('side menu click correctly works', () => {
    window.open = jest.fn()
    RenderWithReactIntl(<SideMenu
      entries={[
        {name: 'entry_1', id: '1', pluginStrategy: 'href', hrefConfig: {sameWindow: false, url: 'http://google.it'}}
      ]}
                        />)
    userEvent.click(screen.queryByText('entry_1'))
    expect(window.open).toBeCalledWith('http://google.it')
  })
})
