import clsx from 'clsx'
import React, { type ReactNode } from 'react'

import styles from './styles.module.css'

interface Props {
  children: ReactNode
  height?: string
  url?: string
}

export default function BrowserWindow({
  children,
  height = '700px',
  url = 'http://localhost:3000',
}: Props): JSX.Element {
  return (
    <div className={styles['browser-window']} style={{ height }}>

      <div className={styles['browser-window-header']}>

        <div className={styles.buttons}>
          <span className={styles.dot} style={{ background: '#f25f58' }} />
          <span className={styles.dot} style={{ background: '#fbbe3c' }} />
          <span className={styles.dot} style={{ background: '#58cb42' }} />
        </div>

        <div className={clsx(styles['browser-window-address-bar'], 'text--truncate')}>
          {url}
        </div>

        <div className={styles['browser-window-menu-icon']}>
          <div>
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </div>
        </div>
      </div>

      <div className={styles['browser-window-body']}>{children}</div>
    </div>
  )
}
