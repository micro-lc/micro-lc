/**
  Copyright 2022 Mia srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import { DEFAULT_LANGUAGE } from '../../web-components/mlc-layout/lib/translation-loader'
import type { LocalizedText } from '../../web-components/mlc-layout/types'

export const getLocalizedText = (localizedText: LocalizedText, lang = DEFAULT_LANGUAGE): string => {
  if (typeof localizedText === 'string') { return localizedText }

  if (localizedText[lang]) { return localizedText[lang] }

  if (localizedText[lang.substring(0, 2)]) { return localizedText[lang.substring(0, 2)] }

  return DEFAULT_LANGUAGE
}