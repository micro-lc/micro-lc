/* eslint-disable typescript-sort-keys/string-enum */
export enum ErrorCodes {
  // in browser
  DynamicImportError = '0',
  FetchError = '1',
  // json
  InvalidJSONError = '20',
  JSONSchemaError = '22',
  JSONValidationError = '21',
  // web-component
  LifecycleSubscriptionError = '30',
  // composer
  DigestError = '40',
  LexerAnalysisEndedInNormalMode = '41',
  InterpolationContextError = '42',
  InterpolationJSONError = '43',
  // lifecycle
  UpdateError = '50',
  RoutingError = '51'
}

export type ErrorHandler = (...args: string[]) => string

const MICRO_LC = '[micro-lc]'
const COMPOSER = `${MICRO_LC}[composer]`

const errorMap: Record<ErrorCodes, ErrorHandler> = {
  0: (name: string, err: string) => `${MICRO_LC}: Dynamic import error while importing ${name} - ${err}`,
  1: (err: string) => `${MICRO_LC}: Fetch/URL error - ${err}`,
  20: (file: string) => `${MICRO_LC}: Provided JSON is invalid / Wrong 'Content-Type' was provided - ${file}`,
  21: (file: string, err: string) => `${MICRO_LC}: JSON Validation failed for ${file} - ${err}`,
  22: (file: string, err: string) => `${MICRO_LC}: JSON Schema for ${file} is not valid - ${err}`,
  30: (err: string) => `${MICRO_LC}: Something went wrong while updating a subscription - ${err}`,
  40: (content: string, err: string) => `${MICRO_LC}: Something went wrong while hashing content ${content} - ${err}`,
  41: (content: string, index: string) => `${MICRO_LC}: Lexer could not parse content ${content} due to unexpected char "}" at position ${index}`,
  42: (input: string) => `${COMPOSER}: Invalid interpolation sequence of keys on input ${input}`,
  43: (err: string) => `${COMPOSER}: Invalid interpolation sequence while parsing a JSON input - ${err}`,
  50: (app: string, err: string) => `${MICRO_LC}: The update for application ${app} failed - ${err}`,
  51: (err: string) => `${MICRO_LC}: Something went wrong while routing - ${err}`,
}

export default errorMap
