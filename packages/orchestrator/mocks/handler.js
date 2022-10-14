// eslint-ignore-next-line
export const RoutingErrorMessage = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED'
}

export const errorMap = {
  401: 'UNAUTHORIZED',
  404: 'NOT_FOUND',
  500: 'INTERNAL_SERVER_ERROR',
}

export function postProcessTemplate(tplResult, opts) {
  if (opts.injectBase) {
    const head = tplResult.template.match(/<head>(.+)<\/head>/)
    if (head?.index) {
      const { index } = head
      const base = tplResult.template.match(/<base(.+)\/?>/)
      if (base === null) {
        const { pathname: route } = new URL(opts.routes.get(opts.name) ?? '', opts.baseURI)
        const newBase = `<base href="${route}" target="_blank" />`
        tplResult.template = `
          ${tplResult.template.slice(0, index)}
            <head>
              ${newBase}
          ${tplResult.template.slice(index + '<head>'.length)}
        `
      }
    }
  }
  return tplResult
}

export const microlcFetch = async (input, init, error) => {
  const url = input instanceof Request ? input.url : input
  const { pathname } = new URL(url)

  if (pathname === '/unauthorized.js') {
    return [
      new Response('Unauthorized', { status: 401 }),
      { ...error, status: 401 },
    ]
  }

  return window.fetch(input, init)
    .then((res) => {
      let reason = input
      if (input instanceof URL) {
        reason = input.href
      } else if (input instanceof Request) {
        reason = input.url
      }

      return res.status > 299
        ? [res, error]
        : [res, undefined]
    })
}

export const getPublicPath = () => window.document.baseURI
