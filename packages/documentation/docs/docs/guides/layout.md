---
title: Layout
description: Static portion of micro-lc
sidebar_label: Layout
sidebar_position: 20
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
import CodeBlock from '@theme-original/CodeBlock'
```

A well-though, user-friendly layout is one of the most important aspect of a frontend application.

Whether we talk about classic top bar/sidebar navigation, peculiar layouts crafted around a specific need, or even no
layout at all, <micro-lc></micro-lc> provides the flexibility to meet every requirement 
[dynamically composing](../concepts/composition.md) applications layout at runtime on the basis of a user-supplied 
[configuration](../../api/micro-lc-web-component.md#layout).

## Mount point

To understand how layout works, it is important to talk about <micro-lc></micro-lc> mount point, the place in DOM on
which <micro-lc></micro-lc> appends the dynamic content.

In its simplest (and default) form, <micro-lc></micro-lc> mount point is a `<div>` tag with id `__micro_lc` and a `<style>`
tag applying some base styling. The resulting tree depends on whether Shadow DOM is enabled, but regardless both the tags
are rendered in the default DOM.

```mdx-code-block 
<Tabs>
<TabItem value="0" label="Tree with Shadow DOM" default>
```
```html
<micro-lc>
  #shadow-root (open)
    <slot>
      ↪️ <style>
      ↪️ <div>
    </slot>
      
  <style>
    div#__micro_lc {
      width: 100%;
      height: 100%;
    }
    
    div#__micro_lc > :first-child {
      width: inherit;
      height: inherit;
      overflow: hidden
    }
  </style>
      
  <div id="__micro_lc">
    <!-- Here micro-lc will mount the dynamic content -->
  </div>  
</micro-lc>
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="Tree without Shadow DOM">
```
```html
<micro-lc disable-shadow-dom>
  <style>
    div#__micro_lc {
      width: 100%;
      height: 100%;
    }

    div#__micro_lc > :first-child {
      width: inherit;
      height: inherit;
      overflow: hidden
    }
  </style>

  <div id="__micro_lc">
    <!-- Here micro-lc will mount the dynamic content -->
  </div>
</micro-lc>
```
```mdx-code-block
</TabItem>
</Tabs>
```

The `<div>` **is always rendered**, since <micro-lc></micro-lc> needs it to ensure content is correctly mounted. However,
the `<div>` id [can be changed](../../api/micro-lc-web-component.md#properties--attributes), and the preset style 
[can be disabled](../../api/micro-lc-web-component.md#properties--attributes).

### Composition

<micro-lc></micro-lc> mount point can be personalized with the
configuration key [`mountPoint`](../../api/micro-lc-web-component.md#mountpoint), which accepts a
[content definition](./applications/compose.md#content-definition).

<CodeBlock language="typescript">
type MountPoint = string | number | <a href="./applications/compose#component-representation">Component</a> | (<a href="./applications/compose#component-representation">Component</a> | number | string)[]
</CodeBlock>

The rationale behind a mount point personalization depends on Shadow DOM status:
* if Shadow DOM is enabled, mount point allows to extend the layout with a portion outside Shadow DOM;
* if Shadow DOM is disabled, mount point is actually **the only way** to define a layout, since `layout` key is not
considered.

In a customized mount point, the actual element in which <micro-lc></micro-lc> should append the content likely needs
to change. To instruct <micro-lc></micro-lc> of the new mount point, use the
configuration key [`mountPointSelector`](../../api/micro-lc-web-component.md#mountpointselector), which accepts a
valid [query selector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector#parameters) to be run on
<micro-lc></micro-lc> base `<div>` (i.e., the one with id `__micro_lc` by default) subtree to find the new mount point.

:::caution
Any content of the node referenced by `mountPointSelector` will be **substituted** by <micro-lc></micro-lc> content.
:::

:::caution
If `mountPointSelector` does not find a valid node, the **whole mount point customization will be discarded** and
<micro-lc></micro-lc> will revert to its default settings.
:::

```mdx-code-block 
<details>
<summary>Example with Shadow DOM</summary>
<div>
<Tabs>
<TabItem value="0" label="Configuration" default>
```
```yaml title=micro-lc.config.yaml
settings:
  mountPoint:
    tag: div
    content:
      - This is some addition to the layout outside micro-lc shadow-root
      - tag: div
        attributes:
          id: custom_mount_point

  mountPointSelector: "#custom_mount_point"

layout:
  content:
    tag: div
    content:
      - This is the layout
      - tag: slot
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="Resulting DOM">
```
```html
<micro-lc>
  #shadow-root (open)
    <div>
      This is the layout
      <slot>
        ↪️ <style>
        ↪️ <div>
      </slot>
    </div>
      
  <style>
    div#__micro_lc {
      width: 100%;
      height: 100%;
    }
    
    div#__micro_lc > :first-child {
      width: inherit;
      height: inherit;
      overflow: hidden
    }
  </style>
      
  <div id="__micro_lc">
    <div>
      This is some addition to the layout outside micro-lc shadow-root
      <div id="custom_mount_point">
        <!-- Here micro-lc will mount the dynamic content -->
      </div>
    </div>
  </div>  
</micro-lc>
```
```mdx-code-block
</TabItem>
</Tabs>
</div>
</details>
```

```mdx-code-block 
<details>
<summary>Example without Shadow DOM</summary>
<div>
<Tabs>
<TabItem value="0" label="Configuration" default>
```
```yaml title=micro-lc.config.yaml
settings:
  mountPoint:
    tag: div
    content:
      - This is both layout and mount point, all outside micro-lc shadow-root
      - tag: div
        attributes:
          id: custom_mount_point

  mountPointSelector: "#custom_mount_point"
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="Resulting DOM">
```
```html
<micro-lc disable-shadow-dom>
  <style>
    div#__micro_lc {
      width: 100%;
      height: 100%;
    }

    div#__micro_lc > :first-child {
      width: inherit;
      height: inherit;
      overflow: hidden
    }
  </style>

  <div id="__micro_lc">
    <div>
      This is both layout and mount point, all outside micro-lc shadow-root
      <div id="custom_mount_point">
        <!-- Here micro-lc will mount the dynamic content -->
      </div>
    </div>  
  </div>
</micro-lc>
```
```mdx-code-block
</TabItem>
</Tabs>
</div>
</details>
```

## Build a layout

If <micro-lc></micro-lc> **Shadow DOM [is enabled](../../api/micro-lc-web-component.md#properties--attributes)**, a 
custom layout can be built using the configuration key [`layout`](../../api/micro-lc-web-component.md#layout).

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

The layout interface (and [the engine](../concepts/composition.md) behind its creation) has the same shape of the interface
used to build composable applications. Hence, refer to [that section](./applications/compose.md#plugin-configuration) for
a detailed description of the subject.

### Slotting

When building custom layouts, [_slots_](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot) can be used to
mark placeholders to be filled with markup at runtime.

A <micro-lc></micro-lc> layout **needs one unnamed `<slot>`** (i.e., a `<slot>` without the
[name attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot#attr-name)) to correctly mount the
dynamic content.

```mdx-code-block 
<Tabs>
<TabItem value="0" label="Configuration" default>
```
```yaml title=micro-lc.config.yaml
layout:
  content:
    - tag: div
      attributes:
        class: top-bar
    - tag: div
      attributes:
        class: main-content
      content:
        - tag: div
          attributes:
            class: side-bar
        # highlight-next-line
        - tag: slot
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="Resulting DOM">
```
```html
<micro-lc>
  #shadow-root (open)
    <div class="top-bar"></div>
    <div class="main-content">
      <div class="side-bar"></div>
      <!-- highlight-start -->
      <slot>
        ↪️ <style>
        ↪️ <div>
      </slot>
      <!-- highlight-end -->  
    </div>
      
  <style>
    div#__micro_lc {
      width: 100%;
      height: 100%;
    }
    
    div#__micro_lc > :first-child {
      width: inherit;
      height: inherit;
      overflow: hidden
    }
  </style>
      
  <div id="__micro_lc">
    <!-- Here micro-lc will mount the dynamic content -->
  </div>  
</micro-lc>
```
```mdx-code-block
</TabItem>
</Tabs>
```

:::tip
While <micro-lc></micro-lc> requires an unnamed `<slot>`, you can use as many named slots as you want to allow external 
injection of content in specific spots of the layout.
:::

#### Two-level slotting

If you build a custom web component to be used as layout, and you want it to be in Shadow DOM too, you will face the
issue of mounting the content through two levels of shadow-root.

To make this work, you need to append a `<slot>` as sibling of the layout web component Shadow DOM with the same name of
the inner content `<slot>` so that any sibling of the layout is correctly mounted.

```mdx-code-block 
<Tabs>
<TabItem value="0" label="Custom web component" default>
```
```javascript title=my-awesome-component.js
class MyAwesomeWebComponent extends HTMLElement {
  constructor() {
    super()

    this._shadowRoot = this.attachShadow({ mode: 'open' })

    this._container = this.ownerDocument.createElement('div')
    // highlight-next-line
    this._container.appendChild(this.ownerDocument.createElement('slot'))
    this._shadowRoot.appendChild(this._container)

    // highlight-next-line
    this.appendChild(this.ownerDocument.createElement('slot'))
  }
}

customElements.define('my-awesome-component', MyAwesomeWebComponent)
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="Configuration">
```
```yaml title=micro-lc.config.yaml
layout:
  sources: ./my-awesome-component.js
  content:
    - tag: my-awesome-component
```
```mdx-code-block
</TabItem>
<TabItem value="2" label="Resulting DOM">
```
```html
<micro-lc>
  #shadow-root (open)
    <my-awesome-component>
      #shadow-root (open)
      <div>
        <!-- highlight-start -->
        <slot>
          ↪️ <slot>
        </slot>
        <!-- highlight-end -->
      </div>
      <!-- highlight-start -->
      <slot>
        ↪️ <style>
        ↪️ <div>
      </slot>
      <!-- highlight-end -->
    </my-awesome-component>
      
  <style>
    div#__micro_lc {
      width: 100%;
      height: 100%;
    }
    
    div#__micro_lc > :first-child {
      width: inherit;
      height: inherit;
      overflow: hidden
    }
  </slot>
      
  <div id="__micro_lc">
    <!-- Here micro-lc will mount the dynamic content -->
  </div>  
</micro-lc>
```
```mdx-code-block
</TabItem>
</Tabs>
```
