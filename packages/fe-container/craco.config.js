const CracoLessPlugin = require('craco-less')
const CracoAlias = require('craco-alias')

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
              '@ant-prefix': 'micro-lc'
            }
          }
        }
      }
    },
    {
      plugin: CracoAlias,
      options: {
        baseUrl: './src',
        source: 'tsconfig',
        tsConfigPath: './tsconfig.extend.json'
      }
    }
  ]
}
