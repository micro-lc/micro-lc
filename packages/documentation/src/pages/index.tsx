import { Redirect } from '@docusaurus/router'
import useBaseUrl from '@docusaurus/useBaseUrl'
import React from 'react'

export default function HomePage(): JSX.Element {
  const redirectUrl = useBaseUrl('/docs')

  return <Redirect to={redirectUrl} />
}
