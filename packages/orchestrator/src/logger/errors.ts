/* eslint-disable typescript-sort-keys/string-enum */
export enum ErrorCodes {
  // in browser
  DynamicImportError = '0',
  FetchError = '1',
  ImportMapError = '2',
  // json
  InvalidJSONError = '20',
  JSONSchemaError = '22',
  JSONValidationError = '21',
  // web-component
  LifecycleSubscriptionError = '30',
  // composer
  DigestError = '40',
  LexerAnalysisEndedInNormalMode = '41',
  // lifecycle
  UpdateError = '50',
  RoutingError = '51'
}

export type ErrorHandler = (...args: string[]) => string

const MICRO_LC = '[micro-lc]'

const errorMap: Record<ErrorCodes, ErrorHandler> = {
  0: (name: string, err: string) => `${MICRO_LC}: Dynamic import error while importing ${name} - ${err}`,
  1: (err: string) => `${MICRO_LC}: Fetch/URL error - ${err}`,
  2: (err: string) => `${MICRO_LC}: Something went wrong while updating import maps - ${err}`,
  20: (file: string) => `${MICRO_LC}: Provided JSON is invalid / Wrong 'Content-Type' was provided - ${file}`,
  21: (file: string, err: string) => `${MICRO_LC}: JSON Validation failed for ${file} - ${err}`,
  22: (file: string, err: string) => `${MICRO_LC}: JSON Schema for ${file} is not valid - ${err}`,
  30: (err: string) => `${MICRO_LC}: Something went wrong while updating a subscription - ${err}`,
  40: (content: string, err: string) => `${MICRO_LC}: Something went wrong while hashing content ${content} - ${err}`,
  41: (content: string, index: string) => `${MICRO_LC}: Lexer could not parse content ${content} due to unexpected char "}" at position ${index}`,
  50: (app: string, err: string) => `${MICRO_LC}: The update for application ${app} failed - ${err}`,
  51: (err: string) => `${MICRO_LC}: Something went wrong while routing - ${err}`,
}

export default errorMap
