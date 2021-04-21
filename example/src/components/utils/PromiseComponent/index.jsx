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

import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class PromiseComponent extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    promiseFunction: PropTypes.func.isRequired
  }

  state = {}

  componentDidMount () {
    const {promiseFunction} = this.props
    promiseFunction()
      .then(response => {
        this.setState({data: response})
      })
      .catch(() => {
        this.setState({isError: true})
      })
  }

  render () {
    const {children} = this.props
    const {data, isError} = this.state
    if (data) return children(data)
    if (isError) return <div>{'Error'}</div>
    return <div>{'Loading...'}</div>
  }
}
