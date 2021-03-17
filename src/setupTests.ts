import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

Enzyme.configure({adapter: new Adapter()})

jest.mock('react-intl', () => {
  const strings = require('./strings/locales/en.json')
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({locale: 'en', messages: strings})

  return {
    ...reactIntl,
    useIntl: () => intl
  }
})
