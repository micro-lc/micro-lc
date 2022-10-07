import Details from '@docusaurus/theme-classic/lib/theme/Details'
import BrowserWindow from '@site/src/components/BrowserWindow'
import CodeBlock from '@theme-original/CodeBlock'
import React, { useEffect, useState } from 'react'

interface ExampleFrameProps {
  minHeight?: number
  src: string
  title: string
}

export function ExampleFrame({
  minHeight = 700,
  src,
  title,
}: ExampleFrameProps): JSX.Element {
  const [textSrc, setTextSrc] = useState('')

  useEffect(() => {
    fetch(src)
      .then(res => (res.ok ? res.text() : Promise.reject(new TypeError('error'))))
      .then(text => setTextSrc(text))
      .catch(console.error)
  }, [src])

  return (
    <div>
      <BrowserWindow minHeight={minHeight}>
        <iframe src={src} style={{ height: '100%', width: '100%' }} title={title}></iframe>
      </BrowserWindow>

      <Details {...{ summary: <summary>Source code</summary> }}>
        <CodeBlock language='html'>{textSrc}</CodeBlock>
      </Details>
    </div>
  )
}
