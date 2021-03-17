import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import {IntlProvider} from 'react-intl'

import './index.css'
import App from './App'
import messages from './strings'

const navigatorLanguage = navigator.language.substring(0, 2)
const language = messages[navigatorLanguage] ? navigatorLanguage : 'en'

const rootComponent = (
  <IntlProvider locale={language} messages={messages[language]}>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </IntlProvider>
)

ReactDOM.render(rootComponent, document.getElementById('root'))
