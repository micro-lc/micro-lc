import React from 'react'

import {ErrorPageContainer} from '@components/error-page-container/ErrorPageContainer'

// import ErrorImage from './assets/illustration.svg'
import {ErrorImage404} from './assets/ErrorImage404'

export const ErrorPage404: React.FC = () => {
  return (
      <ErrorPageContainer
        descriptionKey='404_description'
        descriptionKeySpec='404_description_spec'
        svg={<ErrorImage404 color ='red' />} titleKey='404_page_not_found'
      />
  )
}
