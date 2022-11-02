---
title: Style
description: Application styling and theming
sidebar_label: Style
sidebar_position: 50
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
```

When developing frontend applications, it is crucial to create a sense of **stylistic unity** and **cohesion** that gives
users a better, smoother experience. Achieving this goal can be tricky in the micro-frontend world, where all the moving
parts are not built together and often cannot rely on the same stylistic definitions.

<micro-lc></micro-lc> helps you make sure that all orchestrated pieces **feel alike** supporting various means of style
declaration and offering some out-of-the-box utilities.

## Styling applications

When styling <micro-lc></micro-lc> applications, one key factor to consider is whether **Shadow DOM** is 
[enabled or not](../../api/micro-lc-web-component.md#properties--attributes).

If Shadow DOM is enabled, the application [layout](./layout.md) is put inside of <micro-lc></micro-lc> shadow root, while
the [content](./applications) is not, meaning that their respective styles are **encapsulated** and cannot affect one 
another. Furthermore, "global" document styles (e.g., style tags in document head) do not influence layout – or any
other node in a shadow root, even if it is placed in content –.

On the other hand, if <micro-lc></micro-lc> Shadow DOM is disabled, both layout and content are placed in regular DOM
and are always affected by the same styling rules.

### Style declarations

#### `style` attribute

```mdx-code-block
<div style={{paddingLeft: '1em'}}>
```
The [`style` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/style) is available to all
HTML elements and enable fine-grained, encapsulating styling. It can be used when 
[composing](./applications/compose.md#component-representation) resources declaring it alongside other attributes.

```yaml title=micro-lc.config.yaml
layout:
  content: |
    # highlight-next-line
    <div style="color: red;">This will be red</div>

applications:
  home:
    integrationMode: compose
    route: ./
    config:
    content:
      - tag: div
        attributes:
          # highlight-next-line
          style: "color: orange;"
        content: This will be orange
```

Since it affects only the element to which it belongs and its children, the `style` attribute works the same with or
without Shadow DOM enabled.
```mdx-code-block
</div>
```

#### Style information elements

```mdx-code-block
<div style={{paddingLeft: '1em'}}>
```
The [`<style>` HTML element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) can be used to style a
document without recurring to external sources.

If a `<style>` tag is placed outside a shadow-root, it effects all the elements rendered in the regular DOM. If it
is places inside a shadow-root, it effects only the elements **in the same shadow-root**. `<style>` tags can be either
declared in the `index.html` or constructed when [composing](./applications/compose.md#component-representation) components.

```mdx-code-block 
<Tabs groupId="configuration">
<TabItem value="0" label="index.html" default>
```
```html
<!doctype html>
<html lang="en">
<head>
  <title>Style information elements</title>

  <!-- highlight-start -->
  <style>
    div {
      background: red;
    }
  </style>
  <!-- highlight-end -->
  
  <script async type="module" src="https://cdn.jsdelivr.net/npm/@micro-lc/orchestrator@latest/dist/micro-lc.production.js"></script>
</head>
<body>
  <micro-lc config-src="./config.yaml"></micro-lc>
</body>
</html>
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="micro-lc.config.yaml">
```
```yaml
layout:
  content:
    # highlight-start
    - tag: style
      content: "div: { color: orange; }"
    # highlight-end
    - tag: div
      content: This will be orange and WILL NOT have a red background

applications:
  home:
    integrationMode: compose
    route: ./
    config:
    content:
      # highlight-start
      - tag: style
        content: "div: { color: green; }"
      # highlight-end
      - tag: div
        content: This will be green and WILL have a red background
```
```mdx-code-block
</TabItem>
</Tabs>
```
```mdx-code-block
</div>
```

#### External stylesheets

```mdx-code-block
<div style={{paddingLeft: '1em'}}>
```
External stylesheets are referenced through
[`<link>` HTML elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link). They behave the same way as
[style information elements](#style-information-elements): they effect only elements in the same DOM and can be
declared in the `index.html` or constructed when [composing](./applications/compose.md#component-representation) 
components.

```mdx-code-block 
<Tabs groupId="configuration">
<TabItem value="0" label="index.html" default>
```
```html
<!doctype html>
<html lang="en">
<head>
  <title>Style information elements</title>

  <!-- highlight-next-line -->
  <link rel="stylesheet" href="./my-stylesheet-1.css">
  
  <script async type="module" src="https://cdn.jsdelivr.net/npm/@micro-lc/orchestrator@latest/dist/micro-lc.production.js"></script>
</head>
<body>
  <micro-lc config-src="./config.yaml"></micro-lc>
</body>
</html>
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="micro-lc.config.yaml">
```
```yaml
layout:
  content:
    # highlight-start
    - tag: link
      attributes:
        rel: stylesheet
        href: ./my-stylesheet-2.css
    # highlight-end
    - tag: div
      content: This will be effected by "my-stylesheet-2.css" and NOT by "my-stylesheet-1.css"

applications:
  home:
    integrationMode: compose
    route: ./
    config:
    content:
      # highlight-start
      - tag: link
        attributes:
          rel: stylesheet
          href: ./my-stylesheet-3.css
      # highlight-end
      - tag: div
        content: This will be effected by "my-stylesheet-3.css" AND by "my-stylesheet-1.css"
```
```mdx-code-block
</TabItem>
</Tabs>
```
```mdx-code-block
</div>
```

### Style injection

<micro-lc></micro-lc> API provides to a way to inject style at runtime with the 
[`setStyle` method](../../api/micro-lc-api/extensions.md#csssetstyle), implementing the following interface:

```typescript
type SetStyle = (styles: CSSConfig) => void

interface CSSConfig {
  global?: Record<string, string | number>
  nodes?: Record<string, Record<string, string | number>>
}
```

#### Global style

```mdx-code-block
<div style={{paddingLeft: '1em'}}>
```
Global style is injected in the uppermost selector, which is `:host` if <micro-lc></micro-lc> is in Shadow DOM mode and
`:root` (which in most cases is `head`) if it is not. This behaviour is useful to set global
[CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) that can be used to enforce
a consistent theme thought the whole application.

For example, after an application or a component has made this call:

```javascript
microlcApi.getExtensions().css.setStyle({
  global: { 
    '--my-application-color': 'red'
  } 
})
```

each node parented by <micro-lc></micro-lc> can use `var(--my-application-color)` to access the global variable in its
own CSS, whether it is in a shadow-root or not.
```mdx-code-block
</div>
```

#### Nodes styling

```mdx-code-block
<div style={{paddingLeft: '1em'}}>
```
With the `node` property of `setStyle` argument, specific CSS selectors can be constructed and injected in DOM. These
selectors are effected by Shadow DOM, meaning they apply only on elements in the same DOM (just like 
[style information elements](#style-information-elements)).

For example, after an application or a component has made this call:

```javascript
microlcApi.getExtensions().css.setStyle({
  nodes: { 
    p: {
      color: 'red'
    }
  } 
})
```

all `<p>` elements in the same DOM of the call will be red.
```mdx-code-block
</div>
```
