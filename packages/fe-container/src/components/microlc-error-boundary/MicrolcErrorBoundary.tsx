/*
 * Copyright 2021 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import PropTypes from 'prop-types'
import {ErrorPage401} from '@components/error-page-401/ErrorPage401'
import {ErrorPage500} from '@components/error-page-500/ErrorPage500'
import {ErrorPage404} from '@components/error-page-404/ErrorPage404'

const errorHandler = (error: Error) => {
  // @ts-ignore
  // eslint-disable-next-line no-console
  console.error('[microlc]:', 'an error occurred', error.errorStatusCode || error.message)
}

export const MicrolcErrorBoundary: React.FC = ({children}) => {
  return (
    <ErrorBoundary FallbackComponent={MicrolcFallback} onError={errorHandler}>
      {children}
    </ErrorBoundary>
  )
}

MicrolcErrorBoundary.propTypes = {
  children: PropTypes.any.isRequired
}

const MicrolcFallback: React.FC<FallbackProps> = ({error}) => {
  const fallbackComponentsMap: { [key: number]: JSX.Element } = {
    401: <ErrorPage401/>,
    404: <ErrorPage404/>,
    500: <ErrorPage500/>
  }

  return (
    // @ts-ignore
    fallbackComponentsMap[error.errorStatusCode] || <ErrorPage500/>
  )
}

MicrolcFallback.propTypes = {
  error: PropTypes.any.isRequired
}
