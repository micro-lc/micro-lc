/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run `yarn make-types` to regenerate this file.
 */

/**
 * How the layout will be structured
 */
export type Mode = "fixedSideBar" | "overlaySideBar" | "topBar"
export type MenuItem = HrefMenuItem | ApplicationMenuItem | CategoryMenuItem | GroupMenuItem
/**
 * Translatable text. It can be a string constant for all language or a map linking language rfc5646 language codes to localized strings
 */
export type LocalizedText =
  | string
  | {
      [k: string]: string
    }

/**
 * Standard micro-lc layout configuration
 */
export interface Config {
  $schema?: string
  mode?: Mode
  /**
   * Ordered list of items to display in the menu
   */
  menuItems?: MenuItem[]
  logo?: Logo
  helpMenu?: HelpMenu
  userMenu?: UserMenu
  /**
   * If true, the dark mode switch will be rendered on the top bar
   */
  enableDarkMode?: boolean
  head?: Head
}
export interface HrefMenuItem {
  /**
   * Unique identifier of the href
   */
  id: string
  /**
   * Type of the item: hyperlink to another page
   */
  type: "href"
  label?: LocalizedText
  icon?: Icon
  /**
   * Link's destination
   */
  href: string
  /**
   * Specifies where to open the linked document
   */
  target?: "_blank" | "_self" | "_parent" | "_top"
}
/**
 * Definition of a dynamically loaded icon
 */
export interface Icon {
  /**
   * Name of the icon according to the chosen library
   */
  selector: string
  /**
   * Library from witch the icon is pulled
   */
  library: "@ant-design/icons-svg" | "@fortawesome/free-regular-svg-icons" | "@fortawesome/free-solid-svg-icons"
}
export interface ApplicationMenuItem {
  /**
   * Unique identifier of the corresponding micro-lc application
   */
  id: string
  /**
   * Type of the item: micro-lc application
   */
  type: "application"
  label?: LocalizedText
  icon?: Icon
}
export interface CategoryMenuItem {
  /**
   * Unique identifier of the category
   */
  id: string
  /**
   * Type of the item: collapsable sub-menu
   */
  type: "category"
  label?: LocalizedText
  icon?: Icon
  children?: MenuItem[]
}
export interface GroupMenuItem {
  /**
   * Unique identifier of the group
   */
  id: string
  /**
   * Type of the item: non-collapsable group of items
   */
  type: "group"
  label?: LocalizedText
  children?: MenuItem[]
}
/**
 * Information needed to display the company logo
 */
export interface Logo {
  /**
   * URL of the logo image for light theme
   */
  urlLightImage?: string
  /**
   * URL of the logo image for dark theme
   */
  urlDarkImage?: string
  /**
   * URL of the site the users are redirected to when they click the logo
   */
  href?: string
  /**
   * Alternative text to display if the logo is not found
   */
  altText?: string
}
/**
 * Configuration of the help menu rendered on the top bar
 */
export interface HelpMenu {
  /**
   * Link to the help page
   */
  helpLink: string
}
/**
 * Configuration of the user menu rendered on the top bar
 */
export interface UserMenu {
  /**
   * URL called in GET to retrieve user data
   */
  userInfoUrl: string
  /**
   * Mapping between the properties returned from the user info URL call and the ones expected by the component
   */
  userPropertiesMapping?: {
    name?: string
    avatar?: string
    [k: string]: string
  }
  /**
   * Configuration needed to perform user logout
   */
  logout?: {
    /**
     * Method used to perform the call to the URL specified in the 'url' property
     */
    method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT"
    /**
     * URL called to logout the user. The method used is the one specified in the 'method' property
     */
    url?: string
    /**
     * URL to be redirected to after the logout
     */
    redirectUrl?: string
  }
}
/**
 * Configuration for the HTML document head
 */
export interface Head {
  /**
   * Url of the fav icon
   */
  favIconUrl?: string
  /**
   * Title of the tab
   */
  title?: string
}