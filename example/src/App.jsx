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
import {FormattedMessage} from 'react-intl'

import logo from './logo.svg'
import './App.css'

function App () {

  let searchParams = new URLSearchParams(window.location.search);

  const goToPlugin = () => {
    const [pluginRoute, from] = window.location.pathname.endsWith('qiankun1') ? ['qiankun2', 'qiankun1'] : ['qiankun1', 'qiankun2']
    window.history.pushState({}, `/${pluginRoute}`, `/${pluginRoute}?from=${from}`)
    searchParams = new URLSearchParams(window.location.search);
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img alt='logo' className='App-logo' src={logo} />
        <p>
          <FormattedMessage id={'edit'} />
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          rel='noopener noreferrer'
          target='_blank'
        >
          <FormattedMessage id={'learn'} />
        </a>
        {searchParams.get('from') && <div>
          <FormattedMessage id='arrivedFrom' />
          <p>{searchParams.get('from')}</p>
        </div>}
        <button onClick={goToPlugin}>
          <FormattedMessage id='otherPlugin' />
        </button>
      </header>
    </div>
  )
}

export default App
