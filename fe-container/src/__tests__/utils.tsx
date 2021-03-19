import * as React from 'react'
import {render} from '@testing-library/react'
import {IntlProvider} from 'react-intl'

import strings from '../strings/locales/en.json'

const RenderWithReactIntl = (component: JSX.Element) => {
  return {
    ...render(<IntlProvider locale={'en'} messages={strings}>{component}</IntlProvider>)
  }
}

export default RenderWithReactIntl

it('Renders', () => {
  RenderWithReactIntl(<></>)
})
