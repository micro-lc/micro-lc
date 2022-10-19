import Details from '@docusaurus/theme-classic/lib/theme/Details'
import BrowserWindow from '@site/src/components/BrowserWindow'
import { SourceCodeBlock } from '@site/src/components/SourceCodeBlock'
import type { SourceTabsProps } from '@site/src/components/SourceTabs'
import { SourceTabs } from '@site/src/components/SourceTabs'
import React, { useEffect, useRef, useState } from 'react'

interface ExampleFrameProps {
  base?: string
  height?: string
  showSource: boolean
  sourceTabs?: SourceTabsProps['tabs']
  src: string
  title: string
}

type UrlChangeCb = (url: string) => void

const frameUrlChangeListener = (element: HTMLIFrameElement, callback: UrlChangeCb) => {
  let lastDispatched: string

  const dispatchChange = (href = element.contentWindow?.location.href) => {
    const newHref = href ?? ''

    if (newHref !== lastDispatched) {
      lastDispatched = newHref
      return callback(newHref)
    }
  }

  const unloadHandler = () => { setTimeout(dispatchChange) }

  const attachUnload = () => {
    element.contentWindow?.removeEventListener('unload', unloadHandler)
    element.contentWindow?.addEventListener('unload', unloadHandler)
  }

  element.addEventListener('load', () => {
    attachUnload()
    dispatchChange()
  })

  element.contentWindow?.addEventListener('popstate', function onPopState(event: PopStateEvent) {
    const targetWindow = (event.target as Window | null) ?? window
    console.log('popstate', targetWindow.location.href)

    dispatchChange(targetWindow.location.href)
  })

  attachUnload()
}

export function ExampleFrame({
  base,
  height,
  showSource = true,
  sourceTabs,
  src,
  title,
}: ExampleFrameProps): JSX.Element {
  const iFrameRef = useRef<HTMLIFrameElement | null>()
  const [isLoading, setIsLoading] = useState(true)
  const [currUrl, setCurrUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (iFrameRef.current) {
      frameUrlChangeListener(iFrameRef.current, url => setCurrUrl(url))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iFrameRef, iFrameRef.current])

  return (
    <>
      <BrowserWindow height={height} url={currUrl}>
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
          ref={innerRef => { iFrameRef.current = innerRef }}
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
