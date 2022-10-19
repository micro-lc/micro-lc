---
title: Style
sidebar_label: Style
sidebar_position: 50
---

Ci sono due modi per iniettare stile:
1 global -> api di micro-lc
2 local -> scritto in fase di composizione

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
