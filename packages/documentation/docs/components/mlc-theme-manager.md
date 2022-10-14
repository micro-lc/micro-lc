---
title: 🔧 mlc-antd-theme-manager
sidebar_label: 🔧 mlc-antd-theme-manager
sidebar_position: 30
---

Logical web-component that can be included in applications layout to inject an [Ant Design](https://ant.design/) compatible theme.

:::caution
It only works on components using [Ant Design Dynamic Theme](https://ant.design/docs/react/customize-theme-variable).
:::

```mdx-code-block
<></>
<example-frame
  base="../../frames/components/mlc-antd-theme-manager/overview"
  height="550px"
  showSource={false}
  src="/index.html"
  title="Overview"
></example-frame>
```

## How it works

:::tip
`mlc-antd-theme-manager` should be used in conjunction with `postcss-ant-dynamic-theme` PosCSS plugin to enable your
Ant Design projects to apply the theme created by the web-component.
:::

The web-component calculated the CSS variables needed by [Ant Design Dynamic Theme](https://ant.design/docs/react/customize-theme-variable)
from a set of base colors (namely, primary, info, success, processing, error, and warning colors). These variables are 
then injected globally through micro-lc `setStyle` API. 

Variables can be scoped using one or more prefixes. For example, the following component

```javascript
import {html} from 'lit-html'

const component = html`
  <mlc-antd-theme-manager
    .varsPrefix=${['prefix-1', 'prefix-2']}
    .primaryColor=${"#25B864"}
  >
  </mlc-antd-theme-manager>
`
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

## Usage

:::caution
This component is intended to be used inside micro-lc, since it makes extensive use of micro-lc API.

You can technically use it standalone, but you will have to manually provide a matching API with the property `microlcApi`.
:::

To use the component in micro-lc, declare it as part of the application layout with its [properties and attributes](#properties-and-attributes).

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
        // Other layout parts
      }
    ]
  }
}
```

## Showcase

### Default prefix

### Multiple prefixes

### Nodes styling

## Properties & attributes

:::tip
All color properties can be Hex, 8-digit Hex, RGB, RGBA HSL, HSLA, HSV, HSVA, or CSS color name string.
:::

|     Property      |     Attribute      |                  Type                   |                                                                                         Default                                                                                          | Description                                                                                                                  |
|:-----------------:|:------------------:|:---------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|------------------------------------------------------------------------------------------------------------------------------|
|   `varsPrefix`    |         -          |   <code>string &#124; string[]</code>   |                                                                                       `micro-lc`                                                                                         | Prefix to apply to the generated set of variables. If more thant one is specified, a set for each prefix will be generated.  |
|      `nodes`      |         -          | <code><a href="#nodes">Nodes</a></code> |                                                                                           `{}`                                                                                           | CSS class definitions rendered in a key-value map where key is the CSS selector and value is CSS styling rules.              |
|  `primaryColor`   |  `primary-color`   |          <code>string</code>            |                                                                                        `#1890FF`                                                                                         | Ant Design primary color.                                                                                                    |
|    `infoColor`    |    `info-color`    |           <code>string</code>           |                                                                                        `#1890FF`                                                                                         | Ant Design info color.                                                                                                       |
|  `successColor`   |  `success-color`   |           <code>string</code>           |                                                                                        `#52C41A`                                                                                         | Ant Design success color.                                                                                                    |
| `processingColor` | `processing-color` |           <code>string</code>           |                                                                                        `#1890FF`                                                                                         | Ant Design processing color.                                                                                                 |
|   `errorColor`    |   `error-color`    |           <code>string</code>           |                                                                                        `#FF4D4F`                                                                                         | Ant Design error color.                                                                                                      |
|  `warningColor`   |  `warning-color`   |           <code>string</code>           |                                                                                        `#FAAD14`                                                                                         | Ant Design warning color.                                                                                                    |
|   `fontFamily`    |   `font-family`    |           <code>string</code>           | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',  Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` | Font family CSS property.                                                                                                    |

<h3 id="nodes"><code>Nodes</code></h3>

```ts
interface Nodes {
  [selector: string]: {
    [cssProperty]: string | number
  }
}
```
