---
sidebar_label: micro-lc
title: micro-lc
sidebar_position: 10
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
```

:::caution
This section is work in progress.
:::

## Web component

<micro-lc></micro-lc> in itself is a web component, registered with tag `micro-lc`. It can be
[sourced from CDN](https://www.jsdelivr.com/package/npm/@micro-lc/orchestrator), or installed as a
[npm package](https://www.npmjs.com/package/@micro-lc/orchestrator).

```mdx-code-block 
<Tabs>
<TabItem value="library-0" label="CDN" default>
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
<TabItem value="micro-lc" label="npm package">
```
```typescript title="App.tsx"
import React from 'react';

// highlight-next-line
import MicroLc from '@micro-lc/orchestrator'

function App() {
  // highlight-next-line
  return (<micro-lc></micro-lc>)
}

// highlight-next-line
customElements.define('micro-lc', MicroLc)

export default App;
```
```mdx-code-block
</TabItem>
</Tabs>
```

### Development and production mode

TODO

### Properties & attributes


|  Property   |      Attribute       |                          Type                           |   Default    | Description                                            |
|:-----------:|:--------------------:|:-------------------------------------------------------:|:------------:|--------------------------------------------------------|
|  `config`   |          -           | <code><a href="#configuration">Configuration</a></code> |     ???      | <micro-lc></micro-lc> configuration.                   |
| `configSrc` |     `config-src`     |                   <code>string</code>                   |      -       | URL from which configuration can be fetched.           |
|      -      | `disable-shadow-dom` |                  <code>boolean</code>                   |   `false`    | Whether <micro-lc></micro-lc> should be in Shadow DOM. |
|      -      |      `root-id`       |                   <code>string</code>                   | `__micro_lc` | ???                                                    |
|      -      |  `disable-styling`   |                  <code>boolean</code>                   |   `false`    | ???                                                    |

## Configuration

Everything concerning the structure of your application – from layout to content, from general settings to global 
imports – is contained in <micro-lc></micro-lc> configuration.

This configuration can be **directly supplied** to <micro-lc></micro-lc> web component with property `config`, or
sourced from

### Settings

### Shared

### Importmap

### Layout

### Applications
