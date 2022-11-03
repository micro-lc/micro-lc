---
sidebar_label: micro-lc web component
description: micro-lc web component and configuration
title: micro-lc web component
sidebar_position: 10
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
```

## Web component

<micro-lc></micro-lc> in itself is a web component, registered with tag `micro-lc`. It can be
[sourced from CDN](https://www.jsdelivr.com/package/npm/@micro-lc/orchestrator), or installed as a
[npm package](https://www.npmjs.com/package/@micro-lc/orchestrator).

```mdx-code-block 
<Tabs>
<TabItem value="0" label="CDN" default>
```
```html title="index.html"
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CDN example</title>

  <!-- highlight-next-line -->
  <script async type="module" src="https://cdn.jsdelivr.net/npm/@micro-lc/orchestrator@latest/dist/micro-lc.production.js"></script>
</head>
<body>
    <!-- highlight-next-line -->
    <micro-lc></micro-lc>
</body>
</html>
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="npm package">
```
```typescript title="App.tsx"
import React from 'react'

// highlight-next-line
import MicroLc from '@micro-lc/orchestrator'

function App() {
  // highlight-next-line
  return (<micro-lc></micro-lc>)
}

// highlight-next-line
customElements.define('micro-lc', MicroLc)

export default App
```
```mdx-code-block
</TabItem>
</Tabs>
```

### Development and production mode

<micro-lc></micro-lc> web component comes in two flavors: _development_ and _production_.

_Development_ variant is injected into the
[`CustomElementRegistry`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry) with a larger bundle
size (~700 KB) since it includes an instance of the [Ajv JSON schema validator](https://ajv.js.org/) to check if
configurations provided to the web components are valid. _Development_ variant also provides feedback on errors via
browser `console`.

To reduce the bundle size, _production_ variant lacks all previously mentioned features and shrinks down to ~180 KB.

### Properties & attributes

|  Property   |      Attribute       |                          Type                           |                                 Default                                 | Description                                                               |
|:-----------:|:--------------------:|:-------------------------------------------------------:|:-----------------------------------------------------------------------:|---------------------------------------------------------------------------|
|  `config`   |          -           | <code><a href="#configuration">Configuration</a></code> | <code><a href="#default-configuration">Default configuration</a></code> | <micro-lc></micro-lc> configuration.                                      |
| `configSrc` |     `config-src`     |                   <code>string</code>                   |                                    -                                    | URL from which configuration can be fetched.                              |
|      -      | `disable-shadow-dom` |                  <code>boolean</code>                   |                                 `false`                                 | Whether <micro-lc></micro-lc> should be in Shadow DOM.                    |
|      -      |      `root-id`       |                   <code>string</code>                   |                              `__micro_lc`                               | [Mount point](../docs/guides/layout.md#mount-point) `<div>` id.           |
|      -      |  `disable-styling`   |                  <code>boolean</code>                   |                                 `false`                                 | Disable [mount point](../docs/guides/layout.md#mount-point) preset styling. |

:::caution
Attributes `disable-shadow-dom`, `root-id`, and `disable-styling` are **not observed**, meaning their initial value is
the only one that matters and no changes are listened to.
:::

## Configuration

Everything concerning the structure of your application – from layout to content, from general settings to global 
imports – is contained in <micro-lc></micro-lc> configuration.

This configuration can be **directly supplied** to <micro-lc></micro-lc> web component through property `config`,
**programmatically set** with API method [`setcurrentconfig`](./micro-lc-api/application-state.md#setcurrentconfig), or
**sourced** through property `configSrc` (or mirrored attribute `config-src`) in JSON or YAML format.

:::tip
YAML is clearer and easier to read and write, but bring a computational and bundle size (~38 KB) overhead, since it
requires an extra step to be compiled back to JSON.

For this reason, we recommend YAML for development and JSON for production. A YAML to JSON converter is available in 
the <a href="../playground" target="_blank">Playground section</a>.
:::

Practically speaking, <micro-lc></micro-lc> configuration is an object with the following structure (each key is
explained in details below):

```typescript
interface Config {
  $schema?: string 
  version?: 2
  settings?: Settings
  shared?: Shared
  importmap?: Importmap
  layout?: Layout
  applications?: Applications
}
```

:::tip
Key `$schema` can be used to reference <micro-lc></micro-lc> configuration 
[JSON schema](https://cdn.jsdelivr.net/npm/@micro-lc/interfaces@latest/schemas/v2/config.schema.json) to greatly ease
the writing process by constantly validating the JSON or YAML content against it. 
:::

### Default configuration

If no configuration is provided <micro-lc></micro-lc> uses the following default configuration:

```yaml title=micro-lc.config.yaml
version: 2

settings:
  defaultUrl: ./

layout:
  content:
    tag: slot
```

### `settings`

* Type: `Object`

Global <micro-lc></micro-lc> settings.

#### `4xx`

* Type: `Object`
* Optional

Configuration for [custom error pages](../docs/guides/applications/error-pages.md#custom-error-pages) linked to **client
errors**.

Example:

```mdx-code-block 
<Tabs groupId="configuration">
<TabItem value="0" label="YAML" default>
```
```yaml title="micro-lc.config.yaml"
settings:
  4xx:
    401:
      integrationMode: parcel
      entry: https://my-static-server/custom-401-error-page.html
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="JSON">
```
```json title="micro-lc.config.json"
{
  "settings": {
    "4xx": {
      "401": {
        "integrationMode": "parcel",
        "entry": "https://my-static-server/custom-401-error-page.html"
      }
    }
  }
}
```
```mdx-code-block
</TabItem>
</Tabs>
```

#### `5xx`

* Type: `Object`
* Optional

Configuration for [custom error pages](../docs/guides/applications/error-pages.md#custom-error-pages) linked to **server
errors**.

Example:

```mdx-code-block 
<Tabs groupId="configuration">
<TabItem value="0" label="YAML" default>
```
```yaml title="micro-lc.config.yaml"
settings:
  5xx:
    502:
      integrationMode: parcel
      entry: https://my-static-server/custom-502-error-page.html
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="JSON">
```
```json title="micro-lc.config.json"
{
  "settings": {
    "5xx": {
      "502": {
        "integrationMode": "parcel",
        "entry": "https://my-static-server/custom-502-error-page.html"
      }
    }
  }
}
```
```mdx-code-block
</TabItem>
</Tabs>
```

#### `composerUri`

* Type: `string`
* Optional

URI from which composer can be sourced, if a different implementation from default <micro-lc></micro-lc> one is needed.

Example:

```mdx-code-block 
<Tabs groupId="configuration">
<TabItem value="0" label="YAML" default>
```
```yaml title="micro-lc.config.yaml"
settings:
  composerUri: https://my-static-server/my-custom-composer.js
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="JSON">
```
```json title="micro-lc.config.json"
{
  "settings": {
    "composerUri": "https://my-static-server/my-custom-composer.js"
  }
}
```
```mdx-code-block
</TabItem>
</Tabs>
```

#### `mountPoint`

* Type: `Object`
* Optional

Custom application [mount point](../docs/guides/layout.md#mount-point) configuration.

Example:

```mdx-code-block 
<Tabs groupId="configuration">
<TabItem value="0" label="YAML" default>
```
```yaml title="micro-lc.config.yaml"
settings:
  mountPoint:
    tag: div
    attributes:
      id: custom-mount-point
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="JSON">
```
```json title="micro-lc.config.json"
{
  "settings": {
    "mountPoint": {
      "tag": "div",
      "attributes": {
        "id": "custom-mount-point"
      }
    }
  }
}
```
```mdx-code-block
</TabItem>
</Tabs>
```

#### `mountPointSelector`

* Type: `string`
* Optional

Query selector to plugins mounting DOM element.

Example:

```mdx-code-block 
<Tabs groupId="configuration">
<TabItem value="0" label="YAML" default>
```
```yaml title="micro-lc.config.yaml"
settings:
  mountPointSelector: "#custom-mount-point"
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="JSON">
```
```json title="micro-lc.config.json"
{
  "settings": {
    "mountPointSelector": "#custom-mount-point"
  }
}
```
```mdx-code-block
</TabItem>
</Tabs>
```

#### `defaultUrl`

* Type: `string`
* Default: `./`

Landing URL. If it [does not correspond](../docs/guides/routing.md) to any configured application, **404 error page** 
will be rendered.

Example:

```mdx-code-block 
<Tabs groupId="configuration">
<TabItem value="0" label="YAML" default>
```
```yaml title="micro-lc.config.yaml"
settings:
  defaultUrl: ./home
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="JSON">
```
```json title="micro-lc.config.json"
{
  "settings": {
    "defaultUrl": "./home"
  }
}
```
```mdx-code-block
</TabItem>
</Tabs>
```

### `shared`

* Type:
  ```typescript
  interface Shared {
    properties?: Record<string, unknown>
  } 
  ```
  
Properties injected by <micro-lc></micro-lc> into all registered [parcels](../docs/guides/applications/parcels.md), 
[custom error pages](../docs/guides/applications/error-pages.md#custom-error-pages), and
[composed DOM elements](../docs/guides/applications/compose.md#interpolated-properties).

Parcel applications and custom error pages of type parcel can access shared properties in
[lifecycle methods](../docs/guides/applications/parcels.md#properties). Web components of composed applications, error
pages of type compose, and constructed layout will find shared properties as 
[interpolated properties](../docs/guides/applications/compose.md#interpolated-properties).

Example:

```mdx-code-block 
<Tabs groupId="configuration">
<TabItem value="0" label="YAML" default>
```
```yaml title="micro-lc.config.yaml"
shared:
  properties:
    client-key: some_client_key
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="JSON">
```
```json title="micro-lc.config.json"
{
  "shared": {
    "properties": {
      "client-key": "some_client_key"
  }
}
```
```mdx-code-block
</TabItem>
</Tabs>
```

### `importmap`

* Type: `Object`

Global [import map](../docs/guides/reuse-third-party-libraries.md).

Example:

```mdx-code-block 
<Tabs groupId="configuration">
<TabItem value="0" label="YAML" default>
```
```yaml title="micro-lc.config.yaml"
importmap:
  imports:
    react: https://esm.sh/react@next
    react-dom: https://esm.sh/react-dom@next
  scopes:
    https://esm.sh/react-dom@next:
      /client: https://esm.sh/react-dom@next/client
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="JSON">
```
```json title="micro-lc.config.json"
{
  "importmap": {
    "imports": {
      "react": "https://esm.sh/react@next",
      "react-dom": "https://esm.sh/react-dom@next"
    },
    "scopes": {
      "https://esm.sh/react-dom@next": {
        "/client": "https://esm.sh/react-dom@next/client"
      }
    }
  }
}
```
```mdx-code-block
</TabItem>
</Tabs>
```

### `layout`

* Type: `Object`
* Default:
  ```yaml
  layout:
    content:
      tag: slot
  ```

[Application layout](../docs/guides/layout.md) DOM configuration.

Example:

```mdx-code-block 
<Tabs groupId="configuration">
<TabItem value="0" label="YAML" default>
```
```yaml title="micro-lc.config.yaml"
layout:
  content:
    - tag: div
      attributes:
        class: layout-container
        content:
          - tag: div
            attributes:
              class: side-bar
          - tag: slot
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="JSON">
```
```json title="micro-lc.config.json"
{
  "layout": {
    "content": [
      {
        "tag": "div",
        "attributes": {
          "class": "layout-container",
          "content": [
            {
              "tag": "div",
              "attributes": {
                "class": "side-bar"
              }
            },
            {
              "tag": "slot"
            }
          ]
        }
      }
    ]
  }
}
```
```mdx-code-block
</TabItem>
</Tabs>
```

### `applications`

* Type: `Object`

Map of [mounted applications](../docs/guides/applications).

Example:

```mdx-code-block 
<Tabs groupId="configuration">
<TabItem value="0" label="YAML" default>
```
```yaml title="micro-lc.config.yaml"
applications:
  home:
    integrationMode: parcel
    entry: https://my-static-server/home-parcel.html
    route: ./home
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="JSON">
```
```json title="micro-lc.config.json"
{
  "applications": {
    "home": {
      "integrationMode": "parcel",
      "entry": "https://my-static-server/home-parcel.html",
      "route": "./home"
    }
  }
}
```
```mdx-code-block
</TabItem>
</Tabs>
```
