import { SourceCodeBlock } from '@site/src/components/SourceCodeBlock'
import TabItem from '@theme-original/TabItem'
import Tabs from '@theme-original/Tabs'
import React, { useMemo } from 'react'

interface SourceTab {
  filePath: string
  isDefault?: boolean
  label?: string
}

export interface SourceTabsProps {
  base?: string
  tabs: SourceTab[]
}

export function SourceTabs({ base, tabs }: SourceTabsProps): JSX.Element {
  const tabItems = useMemo(() => tabs.map(({ isDefault, filePath, label }, idx) => {
    const calcLabel = label ?? filePath.substring(filePath.lastIndexOf('/') + 1)

    return (
      <TabItem default={isDefault} key={idx} label={calcLabel} value={idx}>
        <SourceCodeBlock base={base} filePath={filePath} />
      </TabItem>
    )
  }), [base, tabs])

  return (<Tabs>{tabItems}</Tabs>)
}
