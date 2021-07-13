import React from 'react'
import {Configuration} from '@mia-platform/core'
import {screen} from '@testing-library/react'

import RenderWithReactIntl, {MenuLocation} from '../../__tests__/utils'
import {Launcher} from './Launcher'
import {expect} from '@playwright/test'

describe('Launcher tests', () => {
  const launcherConfigBuilder = (menuLocation: MenuLocation): Configuration => ({
    theming: {
      header: {
        pageTitle: 'My Company',
        favicon: 'https://www.mia-platform.eu/static/img/favicon/apple-icon-60x60.png'
      },
      variables: {},
      logo: {
        url_light_image: 'logo_url',
        alt: 'logo'
      },
      menuLocation
    },
    plugins: [{
      label: 'Href entry',
      id: '1',
      integrationMode: 'href',
      externalLink: {
        url: 'https://google.it',
        sameWindow: false
      }
    }, {
      id: 'iframe-google',
      label: 'iframe entry',
      icon: 'clipboard',
      integrationMode: 'iframe',
      pluginRoute: '/iframeTest',
      pluginUrl: 'https://www.google.com/webhp?igu=1'
    }, {
      id: 'plugin-test-3',
      label: 'Qiankun entry',
      icon: 'clipboard',
      order: 3,
      integrationMode: 'qiankun',
      pluginRoute: '/qiankunTest',
      pluginUrl: 'http://localhost:8764'
    }]
  })

  it('render SideBarLayout as default', () => {
    RenderWithReactIntl(<Launcher configuration={launcherConfigBuilder(undefined)} isLoading={false} user={{}}/>)
    expect(screen.getByTestId('side-bar')).toBeTruthy()
  })

  it('render SideBarLayout', () => {
    RenderWithReactIntl(<Launcher configuration={launcherConfigBuilder('sideBar')} isLoading={false} user={{}}/>)
    expect(screen.getByTestId('side-bar')).toBeTruthy()
  })

  it('render NoSideBarLayout', () => {
    RenderWithReactIntl(<Launcher configuration={launcherConfigBuilder('topBar')} isLoading={false} user={{}}/>)
    expect(screen.getByTestId('no-side-bar')).toBeTruthy()
  })

  it('render FixedSideBarLayout', () => {
    RenderWithReactIntl(<Launcher configuration={launcherConfigBuilder('fixedSideBar')} isLoading={false} user={{}}/>)
    expect(screen.getByTestId('fixed-side-bar')).toBeTruthy()
  })
})
