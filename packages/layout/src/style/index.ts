import { unsafeCSS } from 'lit'

import style from './index.less?inline'

export const CUSTOM_ANTD_CLASS_PREFIX = 'mlc'

export const cssResult = unsafeCSS(style)
export default style
