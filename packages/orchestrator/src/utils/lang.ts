export function craftLanguageHeader(language = window.navigator.language, fallback: string | null | undefined): Record<'Accept-Language', string> {
  let acceptLanguage = language

  const [main, secondary] = language.split('-') as [string, string | undefined]
  if (secondary !== undefined) {
    acceptLanguage = `${acceptLanguage}, ${main};q=0.5`
  }

  if (fallback) {
    acceptLanguage = `${acceptLanguage}, ${fallback};q=0.1`
  }

  return {
    'Accept-Language': acceptLanguage,
  }
}
