import { Redirect } from '@docusaurus/router'
import React from 'react'

export default function homePage(): JSX.Element {
  return <Redirect to='/docs' />
}
