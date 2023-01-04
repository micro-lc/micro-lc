/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run `yarn make-types` to regenerate this file.
 */

export type Content = ArrayContent | (Component | VoidComponent) | (number | string)
/**
 * HTML5 tag name
 */
export type HTMLTag =
  | "a"
  | "abbr"
  | "acronym"
  | "address"
  | "applet"
  | "article"
  | "aside"
  | "audio"
  | "basefont"
  | "bdo"
  | "bgsound"
  | "blink"
  | "blockquote"
  | "body"
  | "button"
  | "canvas"
  | "caption"
  | "center"
  | "colgroup"
  | "command"
  | "comment"
  | "datalist"
  | "dd"
  | "del"
  | "details"
  | "dir"
  | "div"
  | "dl"
  | "dt"
  | "fieldset"
  | "figure"
  | "b"
  | "big"
  | "i"
  | "small"
  | "tt"
  | "font"
  | "footer"
  | "form"
  | "frame"
  | "frameset"
  | "head"
  | "header"
  | "hgroup"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "html"
  | "isindex"
  | "iframe"
  | "ilayer"
  | "ins"
  | "label"
  | "layer"
  | "legend"
  | "li"
  | "main"
  | "map"
  | "mark"
  | "marquee"
  | "menu"
  | "meter"
  | "multicol"
  | "nav"
  | "nobr"
  | "noembed"
  | "noframes"
  | "noscript"
  | "object"
  | "ol"
  | "optgroup"
  | "option"
  | "output"
  | "p"
  | "cite"
  | "code"
  | "dfn"
  | "em"
  | "kbd"
  | "samp"
  | "strong"
  | "var"
  | "plaintext"
  | "pre"
  | "progress"
  | "q"
  | "ruby"
  | "script"
  | "section"
  | "select"
  | "spacer"
  | "span"
  | "s"
  | "slot"
  | "strike"
  | "style"
  | "sub"
  | "sup"
  | "table"
  | "tbody"
  | "td"
  | "textarea"
  | "tfoot"
  | "th"
  | "thead"
  | "time"
  | "title"
  | "tr"
  | "u"
  | "ul"
  | "video"
  | "xmp"
/**
 * HTML node children
 */
export type Content1 = ArrayContent | (Component | VoidComponent) | (number | string)
/**
 * HTML5 self-closing tag name
 */
export type HTMLVoidTag =
  | "area"
  | "base"
  | "br"
  | "col"
  | "embed"
  | "hr"
  | "img"
  | "input"
  | "keygen"
  | "link"
  | "meta"
  | "param"
  | "source"
  | "track"
  | "wbr"
/**
 * An HTML array node
 */
export type ArrayContent = ((Component | VoidComponent) | (number | string))[]
/**
 * Entry of the plugin
 */
export type ParcelApplicationEntry =
  | string
  | (
      | {
          scripts: string | [string, ...string[]]
          styles?: string | string[]
          html?: string
        }
      | {
          scripts?: string | string[]
          styles?: string | string[]
          html: string
        }
    )
export type Application = IFrameApplication2 | ComposableApplication2 | ParcelApplication2

/**
 * Version 2 of micro-lc configuration
 */
export interface Config {
  version: 2
  settings?: Settings
  shared?: {
    properties?: {
      [k: string]: unknown
    }
    [k: string]: unknown
  }
  importmap?: GlobalImportMap
  /**
   * List of mounted applications
   */
  applications?: {
    [k: string]: Application
  }
  layout?: PluginConfiguration1
  [k: string]: unknown
}
/**
 * Global micro-lc settings
 */
export interface Settings {
  "4xx"?: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^4\d{2}$".
     */
    [k: string]: IFrameApplication | ComposableApplication | ParcelApplication
  }
  "5xx"?: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^5\d{2}$".
     */
    [k: string]: IFrameApplication1 | ComposableApplication1 | ParcelApplication1
  }
  /**
   * The URI where the composer plugin can be found, if needed
   */
  composerUri?: string
  mountPoint?: Content
  /**
   * Query selector to plugins mounting DOM element
   */
  mountPointSelector?: string
  /**
   * Landing URL
   */
  defaultUrl?: string
}
export interface IFrameApplication {
  /**
   * Type of the application: nested browsing context
   */
  integrationMode: "iframe"
  /**
   * iFrame src attribute value
   */
  src: string
  /**
   * iFrame html content
   */
  srcdoc?: string
  /**
   * Path on which the iFrame will be rendered
   */
  route?: string
  /**
   * Valid attributes of iframe HTML element
   */
  attributes?: {
    [k: string]: string
  }
}
export interface ComposableApplication {
  /**
   * Type of the application: composition of HTML tags
   */
  integrationMode: "compose"
  config: PluginConfiguration | string
  /**
   * Path on which the plugin will be rendered
   */
  route?: string
}
/**
 * Composer configuration. It can be an url or an in-line configuration
 */
export interface PluginConfiguration {
  /**
   * Global sources
   */
  sources?:
    | string
    | string[]
    | {
        /**
         * A single source uri or a list of source uris
         */
        uris: string | string[]
        importmap?: ImportMap
      }
  content: Content
  [k: string]: unknown
}
/**
 * Specific import map for the component
 */
export interface ImportMap {
  imports?: Imports
  scopes?: Scopes
}
/**
 * Allows control over what URLs get fetched by JavaScript import statements and import() expressions.
 */
export interface Imports {
  [k: string]: string
}
/**
 * It is often the case that you want to use the same import specifier to refer to multiple versions of a single library, depending on who is importing them. This encapsulates the versions of each dependency in use, and avoids dependency hell. We support this use case in import maps by allowing you to change the meaning of a specifier within a given scope.
 */
export interface Scopes {
  [k: string]: {
    [k: string]: string
  }
}
/**
 * An HTML node
 */
export interface Component {
  /**
   * HTML node tag name
   */
  tag: string | HTMLTag
  /**
   * HTML5 attribute applied using setAttribute API
   */
  attributes?: {
    [k: string]: string
  }
  /**
   * HTML5 boolean attribute applied using setAttribute API
   */
  booleanAttributes?: string | string[]
  /**
   * DOM element property applied as object property after creating an element
   */
  properties?: {
    [k: string]: unknown
  }
  content?: Content1
}
/**
 * An HTML void node
 */
export interface VoidComponent {
  /**
   * HTML node tag name
   */
  tag: HTMLVoidTag
  /**
   * HTML5 attribute applied using setAttribute API
   */
  attributes?: {
    [k: string]: string
  }
  /**
   * HTML5 boolean attribute applied using setAttribute API
   */
  booleanAttributes?: string | string[]
  /**
   * DOM element property applied as object property after creating an element
   */
  properties?: {
    [k: string]: unknown
  }
}
export interface ParcelApplication {
  /**
   * Type of the application: micro front-end loaded using parcels
   */
  integrationMode: "parcel"
  entry: ParcelApplicationEntry
  /**
   * parcel activeRule
   */
  route?: string
  /**
   * Data passed to the plugin
   */
  properties?: {
    [k: string]: unknown
  }
  /**
   * Whether to inject a base tag according to the application given route. Can be used when an hash router is not available
   */
  injectBase?: boolean
}
export interface IFrameApplication1 {
  /**
   * Type of the application: nested browsing context
   */
  integrationMode: "iframe"
  /**
   * iFrame src attribute value
   */
  src: string
  /**
   * iFrame html content
   */
  srcdoc?: string
  /**
   * Path on which the iFrame will be rendered
   */
  route?: string
  /**
   * Valid attributes of iframe HTML element
   */
  attributes?: {
    [k: string]: string
  }
}
export interface ComposableApplication1 {
  /**
   * Type of the application: composition of HTML tags
   */
  integrationMode: "compose"
  config: PluginConfiguration | string
  /**
   * Path on which the plugin will be rendered
   */
  route?: string
}
export interface ParcelApplication1 {
  /**
   * Type of the application: micro front-end loaded using parcels
   */
  integrationMode: "parcel"
  entry: ParcelApplicationEntry
  /**
   * parcel activeRule
   */
  route?: string
  /**
   * Data passed to the plugin
   */
  properties?: {
    [k: string]: unknown
  }
  /**
   * Whether to inject a base tag according to the application given route. Can be used when an hash router is not available
   */
  injectBase?: boolean
}
/**
 * Global import map
 */
export interface GlobalImportMap {
  imports?: Imports
  scopes?: Scopes
}
export interface IFrameApplication2 {
  /**
   * Type of the application: nested browsing context
   */
  integrationMode: "iframe"
  /**
   * iFrame src attribute value
   */
  src?: string
  /**
   * iFrame html content
   */
  srcdoc?: string
  /**
   * Path on which the iFrame will be rendered
   */
  route: string
  /**
   * Valid attributes of iframe HTML element
   */
  attributes?: {
    [k: string]: string
  }
}
export interface ComposableApplication2 {
  /**
   * Type of the application: composition of HTML tags
   */
  integrationMode: "compose"
  config: PluginConfiguration | string
  /**
   * Path on which the plugin will be rendered
   */
  route: string
}
export interface ParcelApplication2 {
  /**
   * Type of the application: micro front-end loaded using parcels
   */
  integrationMode: "parcel"
  entry: ParcelApplicationEntry
  /**
   * parcel activeRule
   */
  route: string
  /**
   * Data passed to the plugin
   */
  properties?: {
    [k: string]: unknown
  }
  /**
   * Whether to inject a base tag according to the application given route. Can be used when an hash router is not available
   */
  injectBase?: boolean
}
/**
 * Orchestrator main page layout DOM configuration
 */
export interface PluginConfiguration1 {
  /**
   * Global sources
   */
  sources?:
    | string
    | string[]
    | {
        /**
         * A single source uri or a list of source uris
         */
        uris: string | string[]
        importmap?: ImportMap
      }
  content: Content
  [k: string]: unknown
}
