// eslint-disable-next-line no-var
var baseTag = document.createElement('base')
// eslint-disable-next-line prefer-template
baseTag.setAttribute('href', window.location.origin + '/')
baseTag.setAttribute('target', '_blank')

document.head.appendChild(baseTag)
