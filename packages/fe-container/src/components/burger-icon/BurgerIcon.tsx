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
import React, {useContext} from 'react'

import {MenuOpenedContext} from '@contexts/MenuOpened.context'

import './BurgerIcon.less'

export const BurgerIcon: React.FC = () => {
  const {isMenuOpened, setMenuOpened} = useContext(MenuOpenedContext)

  const manageToggle = () => {
    setMenuOpened(!isMenuOpened)
  }

  return (
    <label className='burgerIcon_container' htmlFor='check' onClick={manageToggle}>
      <input checked={isMenuOpened} data-testid='top-bar-side-menu-toggle' readOnly={true} type='checkbox'/>
      <span/>
      <span/>
      <span/>
    </label>
  )
}
