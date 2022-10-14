import Details from '@docusaurus/theme-classic/lib/theme/Details'
import BrowserWindow from '@site/src/components/BrowserWindow'
import { SourceCodeBlock } from '@site/src/components/SourceCodeBlock'
import type { SourceTabsProps } from '@site/src/components/SourceTabs'
import { SourceTabs } from '@site/src/components/SourceTabs'
import React, { useState } from 'react'

interface ExampleFrameProps {
  base?: string
  height?: string
  showSource: boolean
  sourceTabs?: SourceTabsProps['tabs']
  src: string
  title: string
}

export function ExampleFrame({
  base,
  height,
  showSource = true,
  sourceTabs,
  src,
  title,
}: ExampleFrameProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <BrowserWindow height={height}>
        {
          isLoading && (
            <div style={{
              background: '#ffffff',
              height: '40px',
              left: 'calc(50% - 20px)',
              position: 'absolute',
              top: 'calc(50% - 20px)',
              width: '40px',
            }}>
              <img alt='Loading...' src='/img/loading.svg'/>
            </div>
          )
        }

        <iframe
          onLoad={() => setIsLoading(false)}
          src={[base, src].join('')}
          style={{ height: '100%', width: '100%' }}
          title={title}
        ></iframe>
      </BrowserWindow>

      {
        showSource && (
          <Details {...{ summary: <summary>Source code</summary> }}>
            {
              sourceTabs
                ? (<SourceTabs base={base} tabs={sourceTabs}/>)
                : (<SourceCodeBlock base={base} filePath={src} />)
            }
          </Details>
        )
      }
    </>
  )
}
