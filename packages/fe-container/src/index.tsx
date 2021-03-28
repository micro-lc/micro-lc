import React from 'react'
import ReactDOM from 'react-dom'
import {IntlProvider} from 'react-intl'

import './index.less'
import App from './App'
import messages from './strings'

const navigatorLanguage = navigator.language.substring(0, 2)
const language = messages[navigatorLanguage] ? navigatorLanguage : 'en'

const rootComponent = (
  <IntlProvider locale={language} messages={messages[language]}>
    <App/>
  </IntlProvider>
)

ReactDOM.render(rootComponent, document.getElementById('root'))
