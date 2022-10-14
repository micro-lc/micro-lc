import { MlcIconic } from './mlc-iconic'

export * from './mlc-iconic'

const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent)

if (!isSafari) { customElements.define('mlc-iconic', MlcIconic) }
