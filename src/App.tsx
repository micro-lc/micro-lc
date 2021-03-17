import React from 'react'
import {useIntl} from 'react-intl'

export default function App () {
  const intl = useIntl()

  return <div>{intl.formatMessage({id: 'hello-word'})}</div>
}
