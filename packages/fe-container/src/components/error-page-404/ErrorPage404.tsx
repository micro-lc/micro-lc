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
import {PlaceholdersPage} from '@mia-platform/microlc-ui-components'

import {ErrorPageContainer, ErrorProps} from '../../containers/error-page/ErrorPageContainer'

const errorProps: ErrorProps = {
  descriptionKeys: ['404_description', '404_description_1'],
  titleKey: '404_title'
}

const ErrorImage404 = PlaceholdersPage.Error404

export const ErrorPage404: React.FC = () => {
  return (
    <ErrorPageContainer {...errorProps}>
      <ErrorImage404/>
    </ErrorPageContainer>
  )
}
