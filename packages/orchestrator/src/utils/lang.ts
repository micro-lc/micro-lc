export function craftLanguageHeader(lang: string | undefined, win = window): Record<'Accept-Language', string> {
  const language = lang ?? win.navigator.language
  const [main, secondary] = language.split('-') as [string, string | undefined]
  if (secondary !== undefined) {
    return {
      'Accept-Language': `${language}, ${main};q=0.5`,
    }
  }

  return {
    'Accept-Language': language,
  }
}
