export function urlMatch(pathname: string, against: string) {
  const regex = against.replace(/\/:([a-zA-Z]+)/g, '/([^/?#]+)')
  return pathname.match(new RegExp(`^${regex}(.*)`))
}

export function effectiveRouteLength(route: string): number {
  return route.replace(/\/:([a-zA-Z]+)/g, '/').length
}
