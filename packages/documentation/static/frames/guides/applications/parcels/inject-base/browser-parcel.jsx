import React from 'react'
import {BrowserRouter as Router, Link, Route} from 'react-router-dom'
import {createRoot} from 'react-dom/client'

const rootComponent = ({pathname}) => (
  <Router basename={pathname ?? process.env.PUBLIC_URL}>
    <Route
      element={(<Link to='/about'><p>{'Go to About Page'}</p></Link>)}
      path='/'
    />
    <Route
      element={(<Link to='/'><p>{'Go Home'}</p></Link>)}
      path='/about'
    />
  </Router>
)

let root

function retrieveContainer (props) {
  const {container} = props
  return container ? container.querySelector('#root') : document.querySelector('#root')
}

function render (props) {
  root = root || createRoot(retrieveContainer(props))
  root.render(rootComponent(props))
}

export async function mount (props) {
  const {pathname} = new URL(document.baseURI, window.document.baseURI)
  render({props, pathname})
}

export async function unmount (_props) {
  root.unmount()
  root = undefined

  return null
}

export async function bootstrap (_props) {
  return null
}
