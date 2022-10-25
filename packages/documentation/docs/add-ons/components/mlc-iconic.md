---
title: 🖼 mlc-iconic
description: Dynamically loaded icons from different libraries
sidebar_label: 🖼 mlc-iconic
sidebar_position: 40
---

Web component to render icons dynamically loaded from different libraries.

```mdx-code-block
<></>
<example-frame
  base="/frames/components/mlc-iconic/overview"
  height="200px"
  showSource={false}
  src={"/"}
  title="Overview"
></example-frame>
```

Given a supported icons library and the name of one of its icons, the web component dynamically loads and renders 
the icon svg. This behavior enables the use of different icon libraries without the need of bundling them.

## Usage

The web component can be used standalone

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>mlc-iconic</title>

  <script async type="module" src="https://************/mlc-iconic.js"></script>
</head>
<body>
  <mlc-iconic library="@ant-design/icons-svg" selector="MessageOutlined"></mlc-iconic>
</body>
```

or as part of a [compose](../../docs/guides/applications/compose) application of <micro-lc></micro-lc>

```json5 title=micro-lc.config.json
{
  "settings": {
    "composerUri": "https://************/composer.production.js"
  },
  // ...
  "applications": {
    "application-id": {
      "integrationMode": "compose",
      "route": "application-route",
      "config": {
        "content": [
          {
            "tag": "mlc-ionic",
            "attributes": {
              "library": "@ant-design/icons-svg",
              "selector": "MessageOutlined"
            }
          }
        ]
      }
    }
  }
}
```

## Showcase

### Ant Design

By default, provided version of [Ant Design Icons](https://ant.design/components/icon/) is `4.2.1`.

```mdx-code-block
<></>
<example-frame
  base="/frames/components/mlc-iconic/ant-design"
  height="300px"
  sourceTabs={[
    { filePath: "/index.html" },
    { filePath: "/config.json", isDefault: true },
  ]}
  src="/"
  title="Ant Design"
></example-frame>
```

### Fontawesome regular

TODO

### Fontawesome solid

TODO

## Properties & attributes {#properties-and-attributes}

|  Property  | Attribute  |                                                          Type                                                          | Default | Description                                  |
|:----------:|:----------:|:----------------------------------------------------------------------------------------------------------------------:|:-------:|----------------------------------------------|
| `selector` | `selector` |                                                  <code>string</code>                                                   |    -    | Icon name according to the chosen `library`  |
| `library`  | `library`  | <code>@ant-design/icons-svg &#124; @fortawesome/free-regular-svg-icons &#124; @fortawesome/free-solid-svg-icons</code> |    -    | Library from which the icon has to be pulled |
|   `src`    |   `src`    |                                                  <code>string</code>                                                   |    -    | Source URI override                          |
