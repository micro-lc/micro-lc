---
title: Layout
sidebar_label: Layout
sidebar_position: 20
---

:::caution
This section is work in progress.
:::

> Come customizzare il layout:
>   * come funziona la chiave layout (riferimento a compose)
>   * layout di default
>   * possibilità di usare qualsiasi web component o HTML per fare il tuo layout
>   * il layout è flessibile (esempio playground, dynamic theme)

A well-though, user-friendly layout is one of the most important aspect of a frontend application.

Whether we talk about classic [top bar/sidebar navigation](../../add-ons/components/mlc-layout), peculiar 
layouts [crafted around a specific need](../../../playground), or even no layout at all, <micro-lc></micro-lc> provides
the flexibility to meet every requirement [dynamically composing](../concepts/composition.md) applications layout at
runtime on the basis of a user-supplied [configuration](../../api/configuration-schema.md).

:::caution
From now on, the assumption in place is <micro-lc></micro-lc> being in
[Shadow DOM](../concepts/separation-of-concernes.md). If it's not your case, consult the 
[dedicated section](#layout-without-shadow-dom) for more information. 
:::

## Build a layout

:::tip
Take a look at <micro-lc></micro-lc> [add-on components](../../add-ons/components) for ready-to-use layout solutions. 
:::

Layouts are build using the `layout` key of <micro-lc></micro-lc> configuration:

```typescript
interface Layout {
  sources?:
    | string
    | string[]
    | {
        uris: string | string[]
        importmap?: ImportMap
      }
  content: Content
}

interface ImportMap {
  imports?: Record<string, string>
  scopes?: Record<string, Record<string, string>>
}

type Content =
  | Component
  | (Component | (number | string))[]
  | (number | string)

interface Component {
  tag: string
  attributes?: Record<string, string>
  booleanAttributes?: string | string[]
  properties?: Record<string, unknown>
  content?: Content
}
```

### Styling

### Mount point

## Layout without Shadow DOM
