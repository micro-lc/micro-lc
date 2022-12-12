/**
  Copyright 2022 Mia srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
/* eslint-disable typescript-sort-keys/string-enum */
export enum ErrorCodes {
  // in browser
  DynamicImportError = '0',
  // json
  InvalidJSONError = '20',
  // composer
  DigestError = '40',
  LexerAnalysisEndedInNormalMode = '41',
  InterpolationContextError = '42',
  InterpolationJSONError = '43',
}

export type ErrorHandler = (...args: string[]) => string

const COMPOSER = `[micro-lc][composer]`

const errorMap: Record<ErrorCodes, ErrorHandler> = {
  0: (name: string, err: string) => `${COMPOSER}: Dynamic import error while importing ${name} - ${err}`,
  20: (file: string) => `${COMPOSER}: Provided JSON is invalid / Wrong 'Content-Type' was provided - ${file}`,
  40: (content: string, err: string) => `${COMPOSER}: Something went wrong while hashing content ${content} - ${err}`,
  41: (content: string, index: string) => `${COMPOSER}: Lexer could not parse content ${content} due to unexpected char "}" at position ${index}`,
  42: (input: string) => `${COMPOSER}: Invalid interpolation sequence of keys on input ${input}`,
  43: (err: string) => `${COMPOSER}: Invalid interpolation sequence while parsing a JSON input - ${err}`,
}

export default errorMap
