interface Translation {
  [key: string]: string
}

interface TranslationMap {
  [key: string]: Translation
}

const en: Translation = require('./locales/en.json')
const it: Translation = require('./locales/it.json')

const strings: TranslationMap = {en, it}

export default strings
