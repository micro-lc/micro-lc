export function craftLanguageHeader(language = window.navigator.language): Record<'Accept-Language', string> {
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
