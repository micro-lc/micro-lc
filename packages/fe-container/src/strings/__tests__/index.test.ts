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
import strings from '../index'

describe('strings', () => {
  describe('en strings should be in it', () => {
    const enKeys = Object.keys(strings.en)
    for (let i = 0; i < enKeys.length; i++) {
      test(enKeys[i], () => {
        expect(strings.it[enKeys[i]]).not.toBe(undefined)
      })
    }
  })

  describe('it strings should be in en', () => {
    const itKeys = Object.keys(strings.it)
    for (let i = 0; i < itKeys.length; i++) {
      test(itKeys[i], () => {
        expect(strings.en[itKeys[i]]).not.toBe(undefined)
      })
    }
  })
})
