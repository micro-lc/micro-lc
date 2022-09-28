import type { Plugin, PluginCreator } from 'postcss'

export interface AntDynamicThemePluginOptions {
  antVariableThemeSelector?: string
  defaultFontFamily?: string
  incomingPrefix?: string
  outgoingPrefix: string
}

const plugin = (opts: AntDynamicThemePluginOptions): Plugin => {
  const {
    antVariableThemeSelector = ':root',
    outgoingPrefix: prefix,
    incomingPrefix = 'ant',
  } = opts

  return {
    Rule(rule) {
      if (rule.selectors.includes(antVariableThemeSelector) && rule.selectors.includes('body')) {
        rule.remove()
      }

      if (rule.selector === antVariableThemeSelector) {
        rule.each((node) => {
          // insert global variable for font-family
          if (node.type === 'decl') {
            switch (node.prop) {
            case 'font-family': {
              const { prop } = node
              const defaultFontFamily = opts.defaultFontFamily
                ?? `-apple-system, BlinkMacSystemFont,
                'Segoe UI', Roboto, 'Helvetica Neue', Arial,
                'Noto Sans', sans-serif, 'Apple Color Emoji',
                'Segoe UI Emoji', 'Segoe UI Symbol',
                'Noto Color Emoji'`
              node.replaceWith({ prop, value: `var(--${prefix}-font-family, ${defaultFontFamily})` })
              break
            }
            case `--${incomingPrefix}-primary-color`:
            case `--${incomingPrefix}-primary-color-hover`:
            case `--${incomingPrefix}-primary-color-active`:
            case `--${incomingPrefix}-primary-color-outline`:
            case `--${incomingPrefix}-primary-1`:
            case `--${incomingPrefix}-primary-2`:
            case `--${incomingPrefix}-primary-3`:
            case `--${incomingPrefix}-primary-4`:
            case `--${incomingPrefix}-primary-5`:
            case `--${incomingPrefix}-primary-6`:
            case `--${incomingPrefix}-primary-7`:
            case `--${incomingPrefix}-primary-color-deprecated-pure`:
            case `--${incomingPrefix}-primary-color-deprecated-l-35`:
            case `--${incomingPrefix}-primary-color-deprecated-l-20`:
            case `--${incomingPrefix}-primary-color-deprecated-t-20`:
            case `--${incomingPrefix}-primary-color-deprecated-t-50`:
            case `--${incomingPrefix}-primary-color-deprecated-f-12`:
            case `--${incomingPrefix}-primary-color-active-deprecated-f-30`:
            case `--${incomingPrefix}-primary-color-active-deprecated-d-02`:
            case `--${incomingPrefix}-success-color`:
            case `--${incomingPrefix}-success-color-hover`:
            case `--${incomingPrefix}-success-color-active`:
            case `--${incomingPrefix}-success-color-outline`:
            case `--${incomingPrefix}-success-color-deprecated-bg`:
            case `--${incomingPrefix}-success-color-deprecated-border`:
            case `--${incomingPrefix}-error-color`:
            case `--${incomingPrefix}-error-color-hover`:
            case `--${incomingPrefix}-error-color-active`:
            case `--${incomingPrefix}-error-color-outline`:
            case `--${incomingPrefix}-error-color-deprecated-bg`:
            case `--${incomingPrefix}-error-color-deprecated-border`:
            case `--${incomingPrefix}-warning-color`:
            case `--${incomingPrefix}-warning-color-hover`:
            case `--${incomingPrefix}-warning-color-active`:
            case `--${incomingPrefix}-warning-color-outline`:
            case `--${incomingPrefix}-warning-color-deprecated-bg`:
            case `--${incomingPrefix}-warning-color-deprecated-border`:
            case `--${incomingPrefix}-info-color`:
            case `--${incomingPrefix}-info-color-deprecated-bg`:
            case `--${incomingPrefix}-info-color-deprecated-border`: {
              const { prop, value } = node
              const name = prop.slice(`--${incomingPrefix}`.length)
              node.replaceWith({ prop, value: `var(--${prefix}${name}, ${value})` })
              break
            }
            default:
              break
            }
          }
        })
      }
    },
    postcssPlugin: 'ant-dynamic-theme',
  }
}
plugin.postcss = true

export default plugin as PluginCreator<AntDynamicThemePluginOptions>
