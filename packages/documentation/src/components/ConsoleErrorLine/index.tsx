import type { ReactNode } from 'react'
import React from 'react'

import styles from './styles.module.css'

interface Props {
  children: ReactNode
}

export function ConsoleErrorLine({ children }: Props): JSX.Element {
  return (
    <p className={styles.error}>
      {children}
    </p>
  )
}
