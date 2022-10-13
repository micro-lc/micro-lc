import CodeBlock from '@theme-original/CodeBlock'
import TabItem from '@theme-original/TabItem'
import Tabs from '@theme-original/Tabs'
import React, { useEffect, useMemo, useState } from 'react'

interface SourceTab {
  filePath: string
  isDefault?: boolean
  label?: string
}

export interface SourceTabsProps {
  base?: string
  tabs: SourceTab[]
}

function SourceCode({ filePath }: Pick<SourceTab, 'filePath'>): JSX.Element {
  const [fileContent, setFileContent] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    fetch(filePath, { signal: abortController.signal })
      .then(res => (res.ok ? res.text() : Promise.reject(new TypeError('Cannot retrieve source code'))))
      .then(text => setFileContent(text))
      .catch(err => {
        if (err instanceof DOMException && err.name === 'AbortError') { return }
        console.error(err)
      })

    return () => { abortController.abort() }
  }, [filePath])

  const fileExtension = filePath.slice((filePath.lastIndexOf('.') - 1 >>> 0) + 2)

  return (<CodeBlock language={fileExtension}>{fileContent}</CodeBlock>)
}

export function SourceTabs({ base, tabs }: SourceTabsProps): JSX.Element {
  const tabItems = useMemo(() => tabs.map(({ isDefault, filePath, label }, idx) => {
    const calcFilePath = [base, filePath].join('')
    const calcLabel = label ?? filePath.substring(filePath.lastIndexOf('/') + 1)

    return (
      <TabItem default={isDefault} key={idx} label={calcLabel} value={idx}>
        <SourceCode filePath={calcFilePath} />
      </TabItem>
    )
  }), [base, tabs])

  return (<Tabs>{tabItems}</Tabs>)
}
