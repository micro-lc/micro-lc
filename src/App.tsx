import React, {useState} from 'react'
import {Layout} from 'antd'
import {Content, Header} from 'antd/lib/layout/layout'

import {TopBar} from './components/topbar/TopBar'
import {LayoutContent} from './components/layout-content/layout-content'
import './App.less'

const App: React.FC = () => {
  const burgerState = useState(false)

  return (
    <Layout>
      <Header style={{background: 'white'}}>
        <TopBar burgerState={burgerState}/>
      </Header>
      <Content>
        <LayoutContent burgerState={burgerState}/>
      </Content>
    </Layout>
  )
}

export default App
