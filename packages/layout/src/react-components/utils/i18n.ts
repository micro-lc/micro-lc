import type { LocalizedText } from '../../config'
import { DEFAULT_LANGUAGE } from '../../mlc-layout/lib/translation-loader'

export const getLocalizedText = (localizedText: LocalizedText, lang = DEFAULT_LANGUAGE): string => {
  if (typeof localizedText === 'string') { return localizedText }

  if (localizedText[lang]) { return localizedText[lang] }

  if (localizedText[lang.substring(0, 2)]) { return localizedText[lang.substring(0, 2)] }

  return DEFAULT_LANGUAGE
}
