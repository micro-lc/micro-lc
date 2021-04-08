import React from 'react'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'

const errorHandler = (error: Error) => {
  // eslint-disable-next-line no-console
  console.error('[microlc]:', 'an error occurred', error.message)
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
  return (
    <div role="alert">
      <FormattedMessage id='error'/>
      <pre>{error.message}</pre>
    </div>
  )
}

MicrolcFallback.propTypes = {
  error: PropTypes.any.isRequired
}
