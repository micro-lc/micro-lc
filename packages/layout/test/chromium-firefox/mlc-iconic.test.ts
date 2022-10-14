import { expect, fixture, fixtureCleanup, waitUntil, html } from '@open-wc/testing'

import '../../src/web-components/mlc-iconic'

describe('iconic web-component tests', () => {
  afterEach(() => { fixtureCleanup() })

  it('should render an antd icon', async () => {
    const container = await fixture(html`
        <mlc-iconic
          selector="MessageOutlined"
          library="@ant-design/icons-svg"
        ></mlc-iconic>
    `)

    await waitUntil(() => container.querySelector('svg[viewBox]') !== null)

    // expect(container.querySelector('svg')).to.have.attribute('viewBox')
    // expect(container.querySelector('path')).to.have.attribute('d')
  })

  it.skip('should fail fetching an icon and keep the fallback', async () => {
    const container = await fixture(html`
      <mlc-iconic
        selector="MessageOutlined_"
        library="@ant-design/icons-svg"
      ></mlc-iconic>
    `)

    expect(container.querySelector('svg')).to.have.property('textContent', '')
  })

  it.skip('should show a fontawesome solid icon', async () => {
    const container = await fixture(html`
      <mlc-iconic
        selector="faTrash"
        library="@fortawesome/free-solid-svg-icons"
        src="/dist/fas/"
      ></mlc-iconic>
    `)

    await waitUntil(() => container.querySelector('svg[viewBox]') !== null)

    expect(container.querySelector('svg')).to.have.attribute('viewBox')
    expect(container.querySelector('path')).to.have.attribute('d')
  })

  it.skip('should show a fontawesome regular icon', async () => {
    const container = await fixture(html`
      <mlc-iconic
        selector="faAddressBook"
        library="@fortawesome/free-regular-svg-icons"
        src="/dist/far/"
      ></mlc-iconic>
    `)

    await waitUntil(() => container.querySelector('svg[viewBox]') !== null)

    expect(container.querySelector('svg')).to.have.attribute('viewBox')
    expect(container.querySelector('path')).to.have.attribute('d')
  })
})
