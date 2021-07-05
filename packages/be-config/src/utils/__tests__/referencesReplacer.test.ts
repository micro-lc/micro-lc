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
import {referencesReplacer} from '../referencesReplacer'

describe('References replacer tests', () => {
  it('return not replaceable object', () => {
    const notReplaceableObject = {
      test: true,
    }
    expect(referencesReplacer(notReplaceableObject)).toMatchObject(notReplaceableObject)
  })

  it('correctly replace object', () => {
    const initialConfiguration = {
      $ref: {
        test: {
          replaced: true,
        },
      },
      content: {
        shouldKeep: true,
        $ref: 'test',
      },
    }
    const expectedResult = {
      shouldKeep: true,
      replaced: true,
    }
    expect(referencesReplacer(initialConfiguration)).toMatchObject(expectedResult)
  })

  it('correctly replace nested object', () => {
    const initialConfiguration = {
      $ref: {
        test: {
          replaced: true,
        },
      },
      content: {
        shouldKeep: true,
        $ref: 'test',
        otherObject: {
          $ref: 'test',
        },
      },
    }
    const expectedResult = {
      shouldKeep: true,
      replaced: true,
      otherObject: {
        replaced: true,
      },
    }
    expect(referencesReplacer(initialConfiguration)).toMatchObject(expectedResult)
  })

  it('correctly replace object array', () => {
    const initialConfiguration = {
      $ref: {
        test: {
          replaced: true,
        },
      },
      content: {
        shouldKeep: true,
        objectArray: [{
          test: true,
          $ref: 'test',
        }, {
          test: false,
          $ref: 'test',
        }],
        otherObject: {
          $ref: 'test',
        },
      },
    }
    const expectedResult = {
      shouldKeep: true,
      objectArray: [{
        test: true,
        replaced: true,
      }, {
        test: false,
        replaced: true,
      }],
      otherObject: {
        replaced: true,
      },
    }
    expect(referencesReplacer(initialConfiguration)).toMatchObject(expectedResult)
  })

  it('correctly remove not existent $ref', () => {
    const initialConfiguration = {
      $ref: {
        test: {
          replaced: true,
        },
      },
      content: {
        shouldKeep: true,
        $ref: 'invalid',
      },
    }
    const expectedResult = {
      shouldKeep: true,
    }
    expect(referencesReplacer(initialConfiguration)).toMatchObject(expectedResult)
  })
})
