---
title: Parcels
sidebar_label: Parcels
sidebar_position: 30
---

Most common integration mode, recommended to embed SPAs. This kind of application are directly managed by the orchestrator,
which needs to be supplied with the assets entry point.

> A single-spa parcel is a framework-agnostic component. It is a chunk of functionality meant to be mounted manually by an
> application, without having to worry about which framework was used to implement the parcel or application. A parcel can
> be as large as an application or as small as a component and written in any language as long as it exports the correct
> [lifecycle events](#lifecycle-methods).
> 
> — [single-spa documentation](https://single-spa.js.org/docs/parcels-overview/#parcel-lifecycles)

For what concerns <micro-lc></micro-lc> configuration, a parcel is an object with keys `html`, `scripts`, and `styles` (at least one
between `html` and `scripts` is mandatory). By polymorphism, we allow entry to be a string which will be interpreted as
an HTML asset entry.

:::danger Important takeaway
Up to now, only JavaScript **UMD scripts** can be used as parcel application assets.
:::

```json
{
  "applications": {
    "home": {
      "route": "./home",
      "integrationMode": "parcel",
      "entry": "./home/index.html"
    },
    "orders": {
      "route": "./orders",
      "integrationMode": "parcel",
      "entry": {
        "scripts": "./orders/index.js",
        "styles": "./orders/style.css"
      }
    },
    "customers": {
      "route": "./customers",
      "integrationMode": "parcel",
      "entry": {
        "html": "./customers/index.html",
        "styles": "./customers/style.css"
      }
    }
  }
}
```

We provide an extensive list of templates to build your own parcel application using your favourite framework:
* [React](https://github.com/micro-lc/micro-lc-react-template)
* ...

## Lifecycle methods

A parcel application has to provide a standard set of lifecycle methods. Those methods must be located either in an
inline script in the application HTML asset, or as UMD script export within one of the application scrip assets.

The simplest form of a parcel application is shown in following example.

```mdx-code-block
<></>
<source-tabs
  base="/frames/guides/applications/parcels/lifecycle-methods"
  tabs={[
    { filePath: "/index.html" },
    { filePath: "/lifecycle.js" }
  ]}
></source-tabs>
```

Lifecycle methods are:
* [`bootstrap`](#bootstrap)
* [`mount`](#mount)
* [`unmount`](#unmount)
* [`update`](#update)

They all return `Promise<null>`. Update is not mandatory and is available only for [error pages](./error-pages.md#update-lifecycle).
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

* `name` is the application unique identifier as per <micro-lc></micro-lc> configuration at "applications".
* `container` is the application mount point which is provided by <micro-lc></micro-lc> configuration at "settings.mountPointSelector".
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
  /* This is where you tell a framework (e.g., React) to unrender some ui from the DOM */
}
```

### Update

:::caution
This lifecycle method is only available for [error pages](./error-pages.md#update-lifecycle).
:::

## Properties

<micro-lc></micro-lc> injects two default properties which can be extended on a per-application basis via the `properties`
key on the application configuration.

### `injectBase`

`injectBase` is a boolean property, defaulting to `false`. 

:::caution
This property should be set to `true` only on applications that do not have a hash router. On applications without 
internal routing, this property does not do anything.
:::

Instructs <micro-lc></micro-lc> on whether to inject a [base tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) to
allow application internal routing to behave as if it was deployed on the bundle selected root, or any root that was
selected at build time.

```mdx-code-block
<></>
<example-frame
  base="/frames/guides/applications/parcels/inject-base"
  height="550px"
  sourceTabs={[
    { filePath: "/config.json5" },
    { filePath: "/browser-parcel.jsx" },
    { filePath: "/hash-parcel.jsx" }
  ]}
  src={"/"}
  title="Base injection"
></example-frame>
```

:::tip
For better compatibility, we recommend to choose `./` as build time public URL. 
:::

:::danger
If your application `index.html` already has a `base` tag, this property **will not** override it. <micro-lc></micro-lc> will consider
this plugin to have been built with prior knowledge of its configuration and deploy route. 
:::

### `microlcApi`

<micro-lc></micro-lc> injects some useful utils to each application in order to share state, events, and styles. The full reference
for this property can be found ...
