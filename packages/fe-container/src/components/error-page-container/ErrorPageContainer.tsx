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
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'

import './ErrorPage.less'

const errorProps = {
  descriptionKey: PropTypes.string.isRequired,
  descriptionKeySpec: PropTypes.string.isRequired,
  svg: PropTypes.any.isRequired,
  titleKey: PropTypes.string.isRequired
}

type ErrorProps = PropTypes.InferProps<typeof errorProps>

export const ErrorPageContainer: React.FC<ErrorProps> = ({svg, titleKey, descriptionKey, descriptionKeySpec}) => {
  return (
    <div className = 'errorPage_container'>
      <div className='svgContainer'>
      {svg}
      </div>

      <p className = 'mainMessage'><FormattedMessage id={titleKey}/></p>
      <div className = 'descriptionMessage'>
        <FormattedMessage id={descriptionKey}/>
      </div>
      <div className = 'descriptionMessageSpec' id='descriptio'>
      <FormattedMessage id={descriptionKeySpec}/>
      </div>
    </div>
  )
}

ErrorPageContainer.propTypes = errorProps
