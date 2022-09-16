export enum ErrorCodes {
  // in browser
  DynamicImportError = '0',
  FetchError = '1',
  // json
  InvalidJSONError = '20',
  JSONSchemaError = '22',
  JSONValidationError = '21',
  // web-component
  LifecycleSubscriptionError = '30'
}

export type ErrorHandler = (...args: string[]) => string

const MICRO_LC = '[micro-lc]'

const errorMap: Record<ErrorCodes, ErrorHandler> = {
  0: (err: string) => `${MICRO_LC}: Dynamic import error - ${err}`,
  1: (err: string) => `${MICRO_LC}: Fetch/URL error - ${err}`,
  20: (file: string) => `${MICRO_LC}: Provided JSON is invalid - ${file}`,
  21: (file: string, err: string) => `${MICRO_LC}: JSON Validation failed for ${file} - ${err}`,
  22: (file: string, err: string) => `${MICRO_LC}: JSON Schema for ${file} is not valid - ${err}`,
  30: (err: string) => `${MICRO_LC}: Something went wrong while updating a subscription - ${err}`,
}

export default errorMap
