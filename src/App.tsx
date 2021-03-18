import React, {useState} from 'react'
import {Layout} from 'antd'

import {TopBar} from './components/topbar/TopBar'
import {LayoutContent} from './components/layout-content/LayoutContent'
import './App.less'

const App: React.FC = () => {
  const burgerState = useState(false)

  return (
    <Layout>
      <Layout.Header>
        <TopBar burgerState={burgerState}/>
      </Layout.Header>
      <Layout.Content>
        <LayoutContent burgerState={burgerState}/>
      </Layout.Content>
    </Layout>
  )
}

export default App
