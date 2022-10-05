import { DEFAULT_LANGUAGE } from '../../web-components/mlc-layout/lib/translation-loader'
import type { LocalizedText } from '../../web-components/mlc-layout/types'

export const getLocalizedText = (localizedText: LocalizedText, lang = DEFAULT_LANGUAGE): string => {
  if (typeof localizedText === 'string') { return localizedText }

  if (localizedText[lang]) { return localizedText[lang] }

  if (localizedText[lang.substring(0, 2)]) { return localizedText[lang.substring(0, 2)] }

  return DEFAULT_LANGUAGE
}
