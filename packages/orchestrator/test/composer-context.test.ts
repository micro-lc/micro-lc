import type { Content } from '@micro-lc/interfaces'
import { expect } from '@open-wc/testing'

import { createComposerContext } from '../src/composer'

describe('micro-lc config tests', () => {
  afterEach(() => {
    for (const child of document.body.children) {
      child.remove()
    }
  })

  it('should attach a layout onto body injecting extra properties', async () => {
    const content: Content = {
      content: [
        {
          attributes: {
            name: 'container',
          },
          properties: {
            eventBus: 'eventBus.[1]',
          },
          tag: 'slot',
        },
      ],
      tag: 'div',
    }

    const appender = await createComposerContext(
      content,
      {
        context: { eventBus: ['a', 'b'], microlcApi: null },
        extraProperties: ['eventBus', 'microlcApi'],
      }
    )
    appender(document.body)

    const slot = document.querySelector('slot')
    expect(slot).to.have.property('eventBus', 'b')
    expect(slot).to.have.property('microlcApi', null)
    expect(slot).to.have.attribute('name', 'container')

    const div = document.querySelector('div')
    expect(div?.firstElementChild).to.have.property('tagName', 'SLOT')
    expect(div).to.have.property('eventBus')
    expect(div).to.have.property('microlcApi', null)
  })
})
