---
title: Separation of concerns
sidebar_label: Separation of concerns
sidebar_position: 10
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
```

<micro-lc></micro-lc> is a web-component meant to be embedded in any web page. Within its context, it splits the viewport
in two parts, **layout** and **content**, which are technically independent of one another, but can
[communicate](./communication) to fill the functional need of cohesion.

```mdx-code-block
<></>
<example-frame
  base="/frames/concepts/separation-of-concernes"
  height="550px"
  showSource={false}
  src={"/"}
  title="Viewport separation"
></example-frame>
```

:::tip
The example above shows an application featuring a classic top bar/sidebar layout. Sometimes this might be neither the
case nor the best option, and that's why <micro-lc></micro-lc> does not limit the 
[shape and size of layout](../guides/layout) in any way.
:::

The main difference between layout and content is that layout is **static**, independent of the current window history
state (i.e., it does not refresh on URL changes), while content is **dynamic**, updating in response to useragent-driven
URL changes.

This dual nature of <micro-lc></micro-lc> is well-reflected on its [configuration](../../api/configuration-schema),
since there is no overlap between layout and content composition.

## DOM management

Being <micro-lc></micro-lc> a web component, it has access to the
[Shadow DOM API](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM), which
[can be used](#disabling-shadow-dom) to encapsulate the layout.

This behaviour enables a complete separation between content and layout **business logic**. Separation which gains importance
considering the static and unmoving nature of layout with respect to the dynamism of content: layout should behave the
same way regardless of the current state of content and should not leak any internal logic besides the ones elected as
touch points.

Moreover, Shadow DOM brings a complete **style segregation** and the possibility to use **slots** in the layout, which
greatly enhance its flexibility and re-usability.

Technically speaking, <micro-lc></micro-lc> puts layout in Shadow DOM and content in the regular DOM, constructing a
tree like:

```mdx-code-block 
<Tabs>
<TabItem value="dom" label="DOM" default>
```
```html title="micro-lc tree with Shadow DOM"
<micro-lc>
  #shadow-root
    ↪️ <slot></slot> <!-- Layout --> 

  <!-- Content --> 
  <div id="__MICRO_LC_MOUNT_POINT"></div>
</micro-lc>
```
```mdx-code-block
</TabItem>
<TabItem value="config" label="Configuration">
```
```yaml title=micro-lc.config.yml
settings:
  mountPoint: |
    <div id="__MICRO_LC_MOUNT_POINT"></div>
  mountPointSelector: "#__MICRO_LC_MOUNT_POINT"
  
layout: 
  content: |
    <slot></slot>
```
```mdx-code-block
</TabItem>
</Tabs>
```

Layout in Shadow DOM needs a [slot tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot) to embed
content as child. Content must include the mount point for applications.

### Disabling Shadow DOM

:::caution
We do not recommend disabling <micro-lc></micro-lc> Shadow DOM, since it can cause style leaking and business logic
conflicts.
:::

Even if it brings all the benefits detailed in the previous section, there may be some use cases for which <micro-lc></micro-lc>
Shadow DOM is not suitable and should be turned off.

Examples may include the need to use in layout components with listeners attached to `window` firing
[not `composed` events](https://pm.dartus.fr/blog/a-complete-guide-on-shadow-dom-and-event-propagation/), global theming
issues where CSS styles has to be accessible by both layout and content, desire to control the entire HTML in a single
place configuring both layout and content in the mount point.

<micro-lc></micro-lc> offers the possibility to disable Shadow DOM, rendering content and layout in a single root, with 
`disableShadowDom` property (or mirrored boolean attribute `disable-shadow-dom`), which will resolve in a tree like:

```mdx-code-block 
<Tabs>
<TabItem value="dom" label="DOM" default>
```
```html title="micro-lc tree with Shadow DOM"
<micro-lc disable-shadow-dom>
  <div>
    Layout
    <div id="__MICRO_LC_MOUNT_POINT">Content</div>
  </div>
</micro-lc>
```
```mdx-code-block
</TabItem>
<TabItem value="config" label="Configuration">
```
```yaml title=micro-lc.config.yml
settings:
  mountPointSelector: "#__MICRO_LC_MOUNT_POINT"
  
layout:
  content: |
    <div>
      Layout
      <div id="__MICRO_LC_MOUNT_POINT">Content</div>
    </div>
```
```mdx-code-block
</TabItem>
</Tabs>
```
