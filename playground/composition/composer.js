import * as composer from '@micro-lc/composer'
console.log(composer)

const {render, premount} = composer

const config = {
  sources: [
    '/packages/orchestrator/dist/micro-lc.development.js',
  ],
  content: {
    tag: 'micro-lc',
    properties: {
      config: {
        settings: {
          defaultUrl: './'
        },
        applications: {
          main: {
            route: './',
            integrationMode: 'compose',
            config: {
              content: "Hello 👋"
            }
          }
        }
      }
    }
  }
}

const root = document.getElementById('root')


;(async function () {
  await premount(config)
  return render(config, root)
})()
