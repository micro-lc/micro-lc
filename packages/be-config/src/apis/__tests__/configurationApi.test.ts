import path from 'path'
import fastify from 'fastify'
import http from 'http'
import {DecoratedFastify} from '@mia-platform/custom-plugin-lib'

import {configurationApiHandlerBuilder} from '../configurationApi'

describe('Configuration api tests', () => {
  // @ts-ignore
  const fastifyInstance: DecoratedFastify = {
    config: {
      MICROLC_CONFIGURATION_PATH: path.join(__dirname, '../../__tests__/configurationMocks/validMicrolcConfig.json'),
    },
  }

  const replySendMock = jest.fn()

  // @ts-ignore
  const replyMock: fastify.FastifyReply<http.ServerResponse> = {
    send: replySendMock,
  }

  it('Correctly create handler', async() => {
    const handler = await configurationApiHandlerBuilder(fastifyInstance)
    // @ts-ignore
    handler(undefined, replyMock)
    expect(replySendMock).toHaveBeenCalledWith({
      'theming': {
        'header': {
          'pageTitle': 'Mia Care',
          'favicon': 'https://www.mia-platform.eu/static/img/favicon/apple-icon-60x60.png',
        },
        'logo': {
          'alt': 'Mia Care',
          'url': 'https://media-exp1.licdn.com/dms/image/C4D0BAQEf8hJ29mN6Gg/company-logo_200_200/0/1615282397253?e=2159024400&v=beta&t=tQixwAMJ5po8IkukxMyFfeCs-t-zZjyPgDfdy12opvI',
        },
        'variables': {
          'primaryColor': 'red',
        },
      },
      'plugins': [
        {
          'id': 'plugin-test-2',
          'label': 'Href same window',
          'icon': 'far fa-window-maximize',
          'order': 2,
          'integrationMode': 'href',
          'externalLink': {
            'url': 'https://google.it',
            'sameWindow': true,
          },
        },
      ],
    }
    )
  })
})
