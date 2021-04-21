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

import {DOCUMENTATION_URL} from '@constants'
import './HelpIcon.less'

const clickHandler = () => {
  window.open(DOCUMENTATION_URL)
}

export const HelpIcon: React.FC = () => {
  return (
    <div className='help_button_container' data-testid='help_button_test' onClick={clickHandler}>
        <i className='topBar_documentationLink far fa-question-circle' />
    </div>
  )
}
