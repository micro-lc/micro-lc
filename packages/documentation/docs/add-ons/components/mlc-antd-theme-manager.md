---
title: 🖼 mlc-antd-theme-manager
description: Adapter for Ant Design dynamic theme
sidebar_label: 🖼 mlc-antd-theme-manager
sidebar_position: 30
---

<!-- TODO: add a dynamic theme example -->

Logical web component that can be included in applications layout to inject an [Ant Design](https://ant.design/) 
compatible theme.

:::caution
It only works on components using [Ant Design Dynamic Theme](https://ant.design/docs/react/customize-theme-variable).
:::

```mdx-code-block
<></>
<example-frame
  base="../../frames/components/mlc-antd-theme-manager"
  height="550px"
  showSource={false}
  src="/"
  title="Overview"
></example-frame>
```

## How it works

The web component calculates the CSS variables needed by 
[Ant Design Dynamic Theme](https://ant.design/docs/react/customize-theme-variable) from a set of base colors 
(namely, primary, info, success, processing, error, and warning colors). These variables are then injected globally
through <micro-lc></micro-lc> API [setStyle method](../../api/micro-lc-api/extensions.md#csssetstyle). 

Variables can be scoped using one or more prefixes. For example, the following configuration

```yaml title=micro-lc.config.yaml
layout:
  content:
    tag: mlc-antd-theme-manager
    properties:
      varsPrefix:
        - prefix-1
        - prefix-2
      primaryColor: "#25B864"
```

inject in the Document the following set of variables

```css
:host {
  --prefix-1-primary-1: #e9f7ec;
  --prefix-1-primary-2: #c5ebd0;
  /* ... */
  --prefix-2-primary-1: #e9f7ec;
  --prefix-2-primary-2: #c5ebd0;
  /* ... */
}
```

## Usage

:::caution
This component is intended to be used inside <micro-lc></micro-lc>, since it makes use of <micro-lc></micro-lc> 
[API](../../api/micro-lc-api).

You **can** use it standalone, but you will have to manually provide a matching API with the property `microlcApi`.
:::

The component can be sourced from
[jsDelivr CDN](https://cdn.jsdelivr.net/npm/@micro-lc/layout@0.1.4/dist/mlc-antd-theme-manager.js).

To use the component in <micro-lc></micro-lc>, declare it as part of the application layout with its
[properties and attributes](#properties-and-attributes).

```yaml title=micro-lc.config.yaml
layout:
  sources: https://cdn.jsdelivr.net/npm/@micro-lc/layout@0.1.4/dist/mlc-antd-theme-manager.js
  content:
    - tag: mlc-antd-theme-manager
      properties:
        varsPrefix: my-prefix
        primaryColor: '#25B864'
```

## Showcase

### Multiple prefixes

```mdx-code-block
<></>
<example-frame
  base="../../frames/components/mlc-antd-theme-manager/multiple-prefixes"
  height="550px"
  sourceTabs={[
    { filePath: "/index.html" },
    { filePath: "/config.yaml", isDefault: true }
  ]}
  src="/"
  title="Multiple prefixes"
></example-frame>
```

## Properties & attributes

:::tip
All color properties can be Hex, 8-digit Hex, RGB, RGBA HSL, HSLA, HSV, HSVA, or CSS color name string.
:::

|     Property      |     Attribute      |                Type                 |                                                                                         Default                                                                                          | Description                                                                                                                  |
|:-----------------:|:------------------:|:-----------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|------------------------------------------------------------------------------------------------------------------------------|
|   `varsPrefix`    |         -          | <code>string &#124; string[]</code> |                                                                                        `micro-lc`                                                                                        | Prefix to apply to the generated set of variables. If more thant one is specified, a set for each prefix will be generated.  |
|  `primaryColor`   |  `primary-color`   |         <code>string</code>         |                                                                                        `#1890FF`                                                                                         | Ant Design primary color.                                                                                                    |
|    `infoColor`    |    `info-color`    |         <code>string</code>         |                                                                                        `#1890FF`                                                                                         | Ant Design info color.                                                                                                       |
|  `successColor`   |  `success-color`   |         <code>string</code>         |                                                                                        `#52C41A`                                                                                         | Ant Design success color.                                                                                                    |
| `processingColor` | `processing-color` |         <code>string</code>         |                                                                                        `#1890FF`                                                                                         | Ant Design processing color.                                                                                                 |
|   `errorColor`    |   `error-color`    |         <code>string</code>         |                                                                                        `#FF4D4F`                                                                                         | Ant Design error color.                                                                                                      |
|  `warningColor`   |  `warning-color`   |         <code>string</code>         |                                                                                        `#FAAD14`                                                                                         | Ant Design warning color.                                                                                                    |
|   `fontFamily`    |   `font-family`    |         <code>string</code>         | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',  Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` | Font family CSS property.                                                                                                    |

## CSS custom properties

The component **sets** the following CSS variables:

| Name                                              |
|:--------------------------------------------------|
| `--micro-lc-primary-1`                            |
| `--micro-lc-primary-2`                            |
| `--micro-lc-primary-3`                            |
| `--micro-lc-primary-4`                            |
| `--micro-lc-primary-5`                            |
| `--micro-lc-primary-6`                            |
| `--micro-lc-primary-7`                            |
| `--micro-lc-primary-8`                            |
| `--micro-lc-primary-9`                            |
| `--micro-lc-primary-10`                           |
| `--micro-lc-primary-color`                        |
| `--micro-lc-primary-color-active`                 |
| `--micro-lc-primary-color-active-deprecated-d-02` |
| `--micro-lc-primary-color-active-deprecated-f-30` |
| `--micro-lc-primary-color-deprecated-bg`          |
| `--micro-lc-primary-color-deprecated-border`      |
| `--micro-lc-primary-color-deprecated-f-12`        |
| `--micro-lc-primary-color-deprecated-l-20`        |
| `--micro-lc-primary-color-deprecated-l-35`        |
| `--micro-lc-primary-color-deprecated-t-20`        |
| `--micro-lc-primary-color-deprecated-t-50`        |
| `--micro-lc-primary-color-disabled`               |
| `--micro-lc-primary-color-hover`                  |
| `--micro-lc-primary-color-outline`                |
| `--micro-lc-success-color`                        |
| `--micro-lc-success-color-active`                 |
| `--micro-lc-success-color-deprecated-bg`          |
| `--micro-lc-success-color-deprecated-border`      |
| `--micro-lc-success-color-disabled`               |
| `--micro-lc-success-color-hover`                  |
| `--micro-lc-success-color-outline`                |
| `--micro-lc-info-color`                           |
| `--micro-lc-info-color-active`                    |
| `--micro-lc-info-color-deprecated-bg`             |
| `--micro-lc-info-color-deprecated-border`         |
| `--micro-lc-info-color-disabled`                  |
| `--micro-lc-info-color-hover`                     |
| `--micro-lc-info-color-outline`                   |
| `--micro-lc-warning-color`                        |
| `--micro-lc-warning-color-active`                 |
| `--micro-lc-warning-color-deprecated-bg`          |
| `--micro-lc-warning-color-deprecated-border`      |
| `--micro-lc-warning-color-disabled`               |
| `--micro-lc-warning-color-hover`                  |
| `--micro-lc-warning-color-outline`                |
| `--micro-lc-error-color`                          |
| `--micro-lc-error-color-active`                   |
| `--micro-lc-error-color-deprecated-bg`            |
| `--micro-lc-error-color-deprecated-border`        |
| `--micro-lc-error-color-disabled`                 |
| `--micro-lc-error-color-hover`                    |
| `--micro-lc-error-color-outline`                  |
| `--micro-lc-font-family`                          |
