import '@testing-library/jest-dom'

jest.mock('react-intl', () => {
  const strings = require('./strings/locales/en.json')
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({locale: 'en', messages: strings})

  return {
    ...reactIntl,
    useIntl: () => intl
  }
})
