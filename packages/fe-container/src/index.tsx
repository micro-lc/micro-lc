import React from 'react'
import ReactDOM from 'react-dom'
import {IntlProvider} from 'react-intl'

import {MicrolcErrorBoundary} from '@components/microlc-error-boundary/MicrolcErrorBoundary'
import App from './App'

import messages from './strings'

import './index.less'

const navigatorLanguage = navigator.language.substring(0, 2)
const language = messages[navigatorLanguage] ? navigatorLanguage : 'en'

const rootComponent = (
  <IntlProvider locale={language} messages={messages[language]}>
    <MicrolcErrorBoundary>
      <App/>
    </MicrolcErrorBoundary>
  </IntlProvider>
)

ReactDOM.render(rootComponent, document.getElementById('root'))
