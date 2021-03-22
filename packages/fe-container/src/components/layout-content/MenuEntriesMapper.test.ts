import menuEntriesMapper from './MenuEntriesMapper'

describe('Test entries mapper', () => {
  it('Map empty plugins to empty array', () => {
    expect(menuEntriesMapper()).toEqual([])
  })

  it('Map ordered entries', () => {
    const mappedEntry = menuEntriesMapper([{
      id: 'test-2',
      order: 2,
      label: 'Test2',
      pluginRoute: 'http://...',
      integrationMode: 'href'
    }, {
      id: 'test-1',
      order: 1,
      label: 'Test1',
      pluginRoute: 'http://...',
      integrationMode: 'href'
    }])

    const expectedMappedEntries = [{
      id: 'test-1',
      name: 'Test1',
      pluginStrategy: 'href',
      hrefConfig: {
        sameWindow: false,
        url: ''
      }
    }, {
      id: 'test-2',
      name: 'Test2',
      pluginStrategy: 'href',
      hrefConfig: {
        sameWindow: false,
        url: ''
      }
    }]

    expect(mappedEntry).toStrictEqual(expectedMappedEntries)
  })

  it('Not sort plugins without order', () => {
    const mappedEntry = menuEntriesMapper([{
      id: 'test-2',
      label: 'Test2',
      pluginRoute: 'http://...',
      integrationMode: 'href'
    }, {
      id: 'test-1',
      label: 'Test1',
      pluginRoute: 'http://...',
      integrationMode: 'href'
    }])

    const expectedMappedEntries = [{
      id: 'test-2',
      name: 'Test2',
      pluginStrategy: 'href',
      hrefConfig: {
        sameWindow: false,
        url: ''
      }
    }, {
      id: 'test-1',
      name: 'Test1',
      pluginStrategy: 'href',
      hrefConfig: {
        sameWindow: false,
        url: ''
      }
    }]

    expect(mappedEntry).toStrictEqual(expectedMappedEntries)
  })
})
