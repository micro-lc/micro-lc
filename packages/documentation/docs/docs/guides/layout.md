---
title: Layout
description: Static portion of micro-lc
sidebar_label: Layout
sidebar_position: 20
---

:::caution
This section is work in progress.
:::

A well-though, user-friendly layout is one of the most important aspect of a frontend application.

Whether we talk about classic [top bar/sidebar navigation](../../add-ons/components/mlc-layout), peculiar 
layouts [crafted around a specific need](../../../playground), or even no layout at all, <micro-lc></micro-lc> provides
the flexibility to meet every requirement [dynamically composing](../concepts/composition) applications layout at
runtime on the basis of a user-supplied [configuration](../../api/micro-lc#layout).

:::caution
From now on, the assumption in place is <micro-lc></micro-lc> being in
[Shadow DOM](../concepts/separation-of-concernes). If it's not your case, consult the 
[dedicated section](#layout-without-shadow-dom) for more information. 
:::

## Build a layout

Layouts are built using <micro-lc></micro-lc> [configuration key `layout`](../../api/micro-lc#layout):

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
```

Through this structure, <micro-lc></micro-lc> is provided with a blueprint to follow to construct the desired DOM tree
dynamically at runtime. The building blocks (`content`) are HTML5 elements or custom web components.

:::tip
Take a look at <micro-lc></micro-lc> [add-on components](../../add-ons/components) for ready-to-use layout solutions.
:::

The layout interface (and [the engine](../concepts/composition) behind its creation) has the same shape of the interface
used to build composable applications. Hence, refer to [that section](./applications/compose#plugin-configuration) for a
detailed description on the subject.

### Mount point

???

## Layout without Shadow DOM

???
