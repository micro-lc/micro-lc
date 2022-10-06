---
title: 📦 mlc-antd-theme-manager
sidebar_label: 📦 mlc-antd-theme-manager
---

Web-component that can be included in applications layout to inject an [Ant Design](https://ant.design/) compatible theme.

:::caution
It only works on components using [Ant Design Dynamic Theme](https://ant.design/docs/react/customize-theme-variable).
:::

## Usage

:::tip
`mlc-antd-theme-manager` should be used in conjunction with `postcss-ant-dynamic-theme` PosCSS plugin to enable your
Ant Design projects to apply the theme created by the web-component.
:::

The web-component calculated the CSS variables needed by [Ant Design Dynamic Theme](https://ant.design/docs/react/customize-theme-variable)
from a set of base colors (namely, primary, info, success, processing, error, and warning colors). These variables are 
then injected globally through micro-lc `setStyle` API. 

Variables can be scoped using one or more prefixes. For example, the following component

```html
<mlc-antd-theme-manager></mlc-antd-theme-manager>
```

produces this set of variables

```json5
{
  "--prefix-1-primary-1": "#e9f7ec",
  "--prefix-1-primary-2": "#c5ebd0",
  // ...
  "--prefix-2-primary-1": "#e9f7ec",
  "--prefix-2-primary-2": "#c5ebd0",
  // ...
}
```

On top of the global configuration, you can use the `nodes` property to inject CSS nodes (i.e., specific selectors) in
your application.

### Example configuration

The web-component should be declared in the `layout` section of micro-lc configuration.

```json5 title="micro-lc.config.json"
{
  // ...
  "layout": {
    "sources": "TODO"
    "content": [
      {
        "tag": "mlc-antd-theme-manager",
        properties: {
          "varsPrefix": "my-prefix",
          "primaryColor": "#25B864"
          "nodes": {
            "p": {
              "margin-bottom": "2px"
            }
          }
        }
      },
      {
        // ...
      }
    ]
  }
}
```

## Properties & attributes

:::tip
All color properties can be Hex, 8-digit Hex, RGB, RGBA HSL, HSLA, HSV, HSVA, or CSS color name string.
:::

| Property | Attribute | Type | Default | Description |
| :---: | :---: | :---: | :---: |-----|
| `varsPrefix` | - | <code>string \| string[]</code> | `micro-lc` | Prefix to apply to the generated set of variables. If more thant one is specified, a set for each prefix will be generated. |
| `nodes` | - | <code><a href="#Nodes">Nodes</a></code> | `{}` | ??? |
| `primaryColor` | `primary-color` | <code>string</code> | `#1890FF` | Ant Design primary color. |
| `infoColor` | `info-color` | <code>string</code> | `#1890FF` | Ant Design info color. |
| `successColor` | `success-color` | <code>string</code> | `#52C41A` | Ant Design success color. |
| `processingColor` | `processing-color` | <code>string</code> | `#1890FF` | Ant Design processing color. |
| `errorColor` | `error-color` | <code>string</code> | `#FF4D4F` | Ant Design error color. |
| `warningColor` | `warning-color` | <code>string</code> | `#FAAD14` | Ant Design warning color. |
| `fontFamily` | `font-family` | <code>string</code> | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',  Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` | Font family CSS property. |

### Types {#types}

#### `Nodes` {#Nodes}

```ts
type Nodes = {
  [selector: key]: {
    [cssProperty]: string | number
  }
}
```
