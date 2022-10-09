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
