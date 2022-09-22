import type { CSSConfig, PluginConfiguration } from '@micro-lc/interfaces'

import type { ResolvedConfig } from '../composer'
import { createComposerContext, premount } from '../composer'
import { appendCSS, appendImportMapTag, appendMountPoint, assignContent, createImportMapTag } from '../dom'
import logger from '../logger'
import type { SchemaOptions } from '../utils/json'

import type { BaseExtension } from './extensions'
import type MicroLC from './micro-lc'


type PremountReturnType =
  (id: string, config: PluginConfiguration) => Promise<ResolvedConfig>

export interface ComposerApi {
  createComposerContext: typeof createComposerContext
  premount: PremountReturnType
}

export async function update<T extends BaseExtension>(this: MicroLC<T>): Promise<void> {
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
  this.importmap = assignContent(createImportMapTag
    .call<MicroLC<T>, [], HTMLScriptElement>(this), importmap
  )
  appendImportMapTag
    .call<MicroLC<T>, [], void>(this)

  // Load `es-module-shims`
  await import('es-module-shims').catch(logger.dynamicImportError('es-module-shims'))

  // layout
  const { content } = await premount
    .call<MicroLC<T>, [string, PluginConfiguration], Promise<ResolvedConfig>>(this, 'layout', layout)
  await createComposerContext(content, {
    context: { microlcApi: this.getApi() },
    extraProperties: ['microlcApi'],
  }).then((appender) => { appender(this.renderRoot) })

  // TODO: qiankun
  // setup composer before qiankun injects proxies
  let schema: SchemaOptions | undefined
  if (process.env.NODE_ENV === 'development') {
    schema = await import('../utils/schemas').then<SchemaOptions>((schemas) => ({
      id: schemas.pluginSchema.$id,
      parts: schemas,
    }))
  }
  const composerUrl = `./composer-plugin.${process.env.NODE_ENV}.js`

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
              style: `width: 100%;
                      height: 100%;
                      position: fixed;
                      border: none;`,
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
          composerApi: {
            createComposerContext: createComposerContext.bind(this),
            premount: premount
              .bind<PremountReturnType>(this),
          },
          config,
          microlcApi: this.getApi(),
          schema,
        },
      }])
    }

    this.qiankun.setDefaultMountApp(defaultUrl)
    this.qiankun.start()
  }
}
