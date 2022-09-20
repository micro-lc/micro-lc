import { MicrolcApiInstance } from './api'
import { createComposerContext } from './composer'
import type { CompleteConfig } from './config'
import { addGlobalImports, appendCSS, appendImportMapTag, appendMountPoint, createImportMapTag } from './dom'
import logger from './logger'
import type MicroLC from './micro-lc'

export async function run(this: MicroLC, config: CompleteConfig): Promise<void> {
  const {
    applications,
    css,
    importmap,
    layout,
    settings: {
      // defaultUrl,
      pluginMountPointSelector,
    },
    shared,
  } = config

  // TODO: createSandbox()

  // Instantiate api
  this.api = new MicrolcApiInstance({}, { applications, shared })

  // Append mount point or set query selector to reach it
  this.mountPoint = appendMountPoint.call(this, pluginMountPointSelector)

  // Append css
  this.styleTags = appendCSS.call(this, css)

  // Append importmap
  this.importmap = createImportMapTag.call(this)
  addGlobalImports.call(this, importmap)
  appendImportMapTag.call(this)

  // Load `es-module-shims`
  await import('es-module-shims').catch(logger.dynamicImportError('es-module-shims'))

  // layout
  await createComposerContext(layout.content, {
    context: { microlcApi: this.api.getApi() },
    extraProperties: ['microlcApi'],
  }).then((appender) => { appender(this.renderRoot) })

  // TODO: qiankun starts here
  if (applications.length > 0) {
    // const promise = process.env.NODE_ENV === 'production'
    //   ? import('qiankun/dist/index.umd.min.js')
    //   : import('qiankun/dist/index.umd.js')

    // await promise.catch(console.error)

    // const composerUrl = new URL(`./composer.${process.env.NODE_ENV}.js`, window.location.origin).href

    // qiankun.registerMicroApps([
    //   {
    //     activeRule: '/',
    //     container: this.mountPoint,
    //     entry: { scripts: [composerUrl] },
    //     name: 'composable-app',
    //   },
    // ])

    // qiankun.setDefaultMountApp(defaultUrl)
    // qiankun.start()
  }
  // function isPlugin(app: Application): app is ComposableApplication | QiankunApplication {
  //   return app.integrationMode !== 'iframe'
  // }

  // const plugins = applications.filter(isPlugin)

  // // application
  // if (plugins.length !== 0) {
  //   const registrableApps = Array<RegistrableApp<ObjectType>>(plugins.length)
  //   registerMicroApps(
  //     plugins.reduce((apps, { integrationMode, id, route, ...rest }) => {
  //       if (!['compose', 'qiankun'].includes(integrationMode)) {
  //         return apps
  //       }

  //       const application: Partial<RegistrableApp<ObjectType>> = {
  //         activeRule: route,
  //         name: id,
  //       }

  //       switch (integrationMode) {
  //       case 'compose':
  //         application.entry = { scripts: ['/composer/'] }
  //         break
  //       case 'qiankun':
  //       default:
  //         application.entry = (rest as Partial<QiankunApplication>).entry as Entry
  //         break
  //       }

  //       apps.push(application as RegistrableApp<ObjectType>)
  //       return apps
  //     }, registrableApps)
  //   )

  //   setDefaultMountApp(defaultUrl)
  // }
}
