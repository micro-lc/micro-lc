---
title: Parcels
description: micro-frontend loaded using parcels
sidebar_label: Parcels
sidebar_position: 30
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
```

Most common integration mode, recommended to embed SPAs. This kind of applications are directly managed by the 
orchestrator, which needs to be supplied with the assets entry point.

:::danger
Up to now, only JavaScript **UMD scripts** can be used as parcel application assets.
:::

> A single-spa parcel is a framework-agnostic component. It is a chunk of functionality meant to be mounted manually by an
> application, without having to worry about which framework was used to implement the parcel or application. A parcel can
> be as large as an application or as small as a component and written in any language as long as it exports the correct
> [lifecycle events](#lifecycle-methods).
> 
> — [single-spa documentation](https://single-spa.js.org/docs/parcels-overview/#parcel-lifecycles)

We provide an extensive list of templates to build your own parcel application using your favourite framework:
* [React](https://github.com/micro-lc/micro-lc-react-template)
* more are coming soon...

## Usage

For what concerns <micro-lc></micro-lc> configuration, a parcel is an object with keys `html`, `scripts`, and `styles`
(at least one between `html` and `scripts` is mandatory). By polymorphism, we allow entry to be a string which will be
interpreted as an HTML asset entry.

```typescript
interface ParcelApplication {
  integrationMode: "parcel"
  entry:
    // Shorthand syntax
    | string
    // Normal syntax
    | (
        | {
            scripts: string | [string, ...string[]]
            styles?: string | string[]
            html?: string
          }
        | {
            scripts?: string | string[]
            styles?: string | string[]
            html: string
          }
      )
  route: string // Path on which the parcel will be rendered
  properties?: Record<string, unknown> // Data passed to the parcel
  injectBase?: boolean // See explanation below
}
```

```mdx-code-block
<></>
<example-frame
  base="../../../frames/guides/applications/parcels"
  height="550px"
  sourceTabs={[
    { filePath: "/index.html" },
    { filePath: "/config.yaml", isDefault: true }
  ]}
  src={"/"}
  title="Base injection"
></example-frame>
```

## Lifecycle methods

A parcel application has to provide a standard set of lifecycle methods. Those methods must be located either in an
inline script in the application HTML asset, or as UMD script export within one of the application scrip assets.

The simplest form of a parcel application is shown in following example.

```mdx-code-block 
<Tabs>
<TabItem value="0" label="index.html" default>
```
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Lifecycle methods</title>

  <script src="lifecycle.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="lifecycle.js">
```
```javascript
function registerLifecycle(self) {
  Object.assign(
    self,
    {
      bootstrap: () => Promise.resolve(null),
      mount: () => Promise.resolve(null),
      unmount: () => Promise.resolve(null),
      update: () => Promise.resolve(null),
    }
  )
}

// 👇 https://dontkry.com/posts/code/browserify-and-the-universal-module-definition.html
(function register(self, factory) {
  self.__MY_PARCEL = {}
  factory(self.__MICRO_LC_ERROR, self)
}(window, registerLifecycle))
```
```mdx-code-block
</TabItem>
</Tabs>
```

Lifecycle methods are:
* [`bootstrap`](#bootstrap)
* [`mount`](#mount)
* [`unmount`](#unmount)
* [`update`](#update)

They all return `Promise<null>`. Update is not mandatory and is available only for [error pages](error-pages.md#lifecycle).
The others take as argument an object with the following interface.

```typescript
interface LifecycleProps {
  name: string
  container: HTMLElement
  entry: {
    html: string
    scripts: string[]
    styles: string[]
  }
  props: {
    injectBase: boolean
    microlcApi?: Partial<MicrolcApi>
    [key: string]: unknown
  }
}
```

* `name` is the application unique identifier as per <micro-lc></micro-lc> configuration key 
[applications](../../../api/micro-lc-web-component.md#applications).
* `container` is the application mount point which is provided by <micro-lc></micro-lc> configuration key
[mountPointSelector](../../../api/micro-lc-web-component.md#mountpointselector).
* `entry` is the application assets object.
* `props` is an object including application custom properties and <micro-lc></micro-lc> injected properties. See 
[dedicated section](#properties) for a detailed description.

### Bootstrap

This lifecycle function will be called once, right before the parcel is mounted for the first time.

```typescript
function bootstrap(props: LifecycleProps): Promise<null> {
  /* This is where you do one-time initialization */
}
```

### Mount

This lifecycle function is called when the router selects the parcel for rendering.

```typescript
function mount(props: LifecycleProps): Promise<null> {
  /* This is where you tell a framework (e.g., React) to render some UI to the DOM */
}
```

### Unmount

When redirecting to another application, the parcel is unmounted.

:::tip
When called, this function should clean up all DOM elements, DOM event listeners, leaked memory, globals, observable 
subscriptions, etc. that were created at any point when the parcel was mounted.
:::

```typescript
function unmount(props: LifecycleProps): Promise<null> {
  /* This is where you tell a framework (e.g., React) to un-render some ui from the DOM */
}
```

### Update

This lifecycle method is only available for [error pages](error-pages.md#lifecycle).

## Properties

<micro-lc></micro-lc> injects two default properties, which can be extended in two ways:
* on a per-application basis with the `properties` key on the application configuration, and
* with configuration key [shared](../../../api/micro-lc-web-component.md#shared) for properties common to all applications
and [composed](./compose.md) DOM nodes (the content of `shared.properties` will be spread on first level).

### `injectBase`

:::danger
If your application `index.html` already has a `base` tag, this property **will not** override it. <micro-lc></micro-lc>
will consider this plugin to have been built with prior knowledge of its configuration and deploy route.
:::

* Type: `boolean`
* Default: `false`

Instructs <micro-lc></micro-lc> on whether to inject a [base tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) to
allow application internal routing to behave as if it was deployed on the bundle selected root, or any root that was
selected at build time.

This property should be set to `true` only on applications that **do not have a hash router**. On applications without 
internal routing, this property does not do anything.

:::tip
For better compatibility, we recommend to choose `./` as build time public URL.
:::

The example below is a showcase of two minimal React applications, one with a browser router and one with a hash router.
The correct usage of `injectBase` enables both of them to work correctly (and to coexist undisturbed).

```mdx-code-block
<></>
<example-frame
  base="../../../frames/guides/applications/parcels/inject-base"
  height="550px"
  sourceTabs={[
    { filePath: "/config.yaml" },
    { filePath: "/browser-parcel.jsx" },
    { filePath: "/hash-parcel.jsx" }
  ]}
  src={"/"}
  title="Base injection"
></example-frame>
```

### `microlcApi`

<micro-lc></micro-lc> injects some useful utils to each application in order to share state, events, and styles. Read
[the full reference](../../../api/micro-lc-api) for a detailed description of this property.
