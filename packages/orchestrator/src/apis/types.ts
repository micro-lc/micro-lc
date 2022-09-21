type HTTPClient = Record<string, unknown>

export type BaseExtension = Record<string, unknown> & {
  httpClient: HTTPClient
}
