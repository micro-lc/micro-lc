import {Skeleton} from 'antd'
import React from 'react'

export const LoadingStructure: React.FC = () => {
  return (
    <Skeleton active={true} data-testid="loading-structure"/>
  )
}
