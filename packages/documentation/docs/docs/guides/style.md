---
title: Style
description: Application styling and theming
sidebar_label: Style
sidebar_position: 50
---

:::caution
This section is work in progress.
:::

When developing frontend applications, it is crucial to create a sense of **stylistic unity** and **cohesion** that gives
users a better, smoother experience. Achieving this goal can be tricky in the micro-frontend world, where all the moving
parts are not  built together and often cannot rely on the same stylistic definitions.

<micro-lc></micro-lc> helps you make sure that all orchestrated pieces **feel alike** supporting various means of style
declaration and offering some out-of-the-box utilities.

## Styling applications

When styling <micro-lc></micro-lc> applications, one key factor to consider is whether **Shadow DOM** is enabled.

If that's the case, [layout](./layout.md) is put inside of <micro-lc></micro-lc> shadow root, while
[content](./applications) is not, meaning that their respective styles are **encapsulated** and cannot affect one 
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
document without recurring to external sources. +
```mdx-code-block
</div>
```

#### External stylesheets

### Style injection

---

## Global styling

Despite <micro-lc></micro-lc> being a micro-frontend orchestrato, it provides means to make all orchestrated pieces feel
alike. Namely, <micro-lc></micro-lc> API provides method to inject global
[CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) in a given CSS selector.

This technique could be useful to unify global CSS features like primary color, danger color, font family, border radius,
and so on.

According with <micro-lc></micro-lc> shadow DOM configuration, CSS global variables are injected in `:host` if 
<micro-lc></micro-lc> is in shadow DOM mode. Otherwise, variable will be appended to `:root` (which in most cases is `head`). 

:::tip
To avoid using shadow DOM, a <micro-lc></micro-lc> property `disableShadowDom` (and mirrored attribute `disable-shadow-dom`)
should be set to `true` (or empty string for the attribute).
:::

Any element parented by <micro-lc></micro-lc> is injected with an API containing the method

```typescript
function setStyle(styles: CSSConfig): void {
  /* Here is where you set your style */
}
```
