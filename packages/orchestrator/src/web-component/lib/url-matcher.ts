export function urlMatch(pathname: string, against: string) {
  const regex = against.replace(/\/:([a-zA-Z]+)/g, '/([^/?#]+)')
  const queryParamRegex = '\\?.*'
  const anchorRegex = '#.*'
  const subPathRegex = '/.*'
  const suffixRegex = regex.endsWith('/') ? '.*' : `$|${subPathRegex}|${queryParamRegex}|${anchorRegex}`
  return pathname.match(new RegExp(`^${regex}(?:${suffixRegex})`))
}

export function effectiveRouteLength(route: string): number {
  return route.replace(/\/:([a-zA-Z]+)/g, '/').length
}

export const computeAbsoluteRoute = (document: Document, route: string): string => {
  const { baseURI, location: { href } } = document
  return new URL(route, new URL(baseURI, href)).pathname
}
