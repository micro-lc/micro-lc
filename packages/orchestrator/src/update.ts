import type { CSSConfig, GlobalImportMap, PluginConfiguration } from '@micro-lc/interfaces'

import type { PartialObject } from './apis'
import { createComposerContext } from './composer'
import { addGlobalImports, appendCSS, appendImportMapTag, appendMountPoint, createImportMapTag } from './dom'
import logger from './logger'
import type MicroLC from './micro-lc'
import * as json from './utils/json'

export async function update<T extends PartialObject>(this: MicroLC<T>): Promise<void> {
  const {
    applications,
    css,
    importmap,
    layout,
    settings: {
      defaultUrl,
      pluginMountPointSelector,
    },
  } = this.config

  // TODO: createSandbox()

  // Append mount point or set query selector to reach it
  this.mountPoint = appendMountPoint
    .call<MicroLC<T>, [typeof pluginMountPointSelector], string | HTMLElement>(
      this, pluginMountPointSelector
    )

  // Append css
  this.styleTags = appendCSS
    .call<MicroLC<T>, [CSSConfig], HTMLStyleElement[]>(this, css)

  // Append importmap
  this.importmap = this.importmap ?? createImportMapTag
    .call<MicroLC<T>, [], HTMLScriptElement>(this)
  addGlobalImports
    .call<MicroLC<T>, [GlobalImportMap], void>(this, importmap)
  appendImportMapTag
    .call<MicroLC<T>, [], void>(this)

  // Load `es-module-shims`
  await import('es-module-shims').catch(logger.dynamicImportError('es-module-shims'))

  // layout
  await createComposerContext(layout.content, {
    context: { microlcApi: this.getApi() },
    extraProperties: ['microlcApi'],
  }).then((appender) => { appender(this.renderRoot) })

  // TODO: qiankun
  // setup composer before qiankun injects proxies
  const composerUrl = `./composer.${process.env.NODE_ENV}.js`

  if (applications.length >= 0) {
    for (const app of applications) {
      const { route, id } = app

      let config: string | PluginConfiguration | undefined
      switch (app.integrationMode) {
      case 'compose':
        config = typeof app.config === 'string'
          ? app.config
          : { ...app.config }
        break
      case 'iframe':
        config = {
          content: {
            attributes: {
              ...app.attributes,
              src: app.src,
            },
            tag: 'iframe',
          },
        }
        break
      default:
        break
      }

      this.qiankun.registerMicroApps([{
        activeRule: route,
        container: this.mountPoint,
        entry: { scripts: [composerUrl] },
        name: id,
        props: {
          composerApi: { json },
          config,
          microlcApi: this.getApi(),
        },
      }])
    }

    this.qiankun.setDefaultMountApp(defaultUrl)
    this.qiankun.start()
  }
}
