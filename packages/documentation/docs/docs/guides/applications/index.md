---
title: Applications
---

Three integration methods are available to add an application to the context of <micro-lc></micro-lc>. Applications are distinguished
by error pages due to the fact they have a fixed routing pattern.

## Route

Each application must have a **route** which must be a valid URL pathname (the trailing slash is not mandatory) like:

- /home
- /home/accessible/
- /my-awesome-application/
- ./react-application
- ./react-application/about

Absolute paths do not interact with an eventual `base` tag provided to your main HTML page whereas relative do. 

Clearly if no `base` tag is provided there is no need to use relative path. Anyway when configuring a <micro-lc></micro-lc>
instance it might be useful to use relative paths in order to be able to move your application away from `/` if needed.

```json5 title=micro-lc.config.json
{
  // ...
  "applications": {
    "home": {
      "route": "./home",
      // ... rest of the application configuration
    },
    "orders": {
      "route": "/plugins/orders",
      // ... rest of the application configuration
    }
  }
}
```

The user is responsible for creating a list of routes that do not overlap.

The router picks always the longest match, hence if both `/home` and `/home/accessible` are registered, on 
`/home/accessible` navigation from URL top bar or `pushState` the router will avoid `/home`. It is up to the user to 
ensure there are no clashes between an application which have an internal router and routes declarations. This scenario 
though is fairly unlikely.

:::caution
Routes do not depend on the current `href` of the page but are determined once  and for all according to the document 
`baseURI`. Keep in mind that `baseURI` is the `href` of a `base` tag, if any, or the current window location.
:::

## Integration modes

An application must have an `integrationMode` property which is either:

- [`iframe`](./iframes), which indicates the application will be embedded in an iframe tag providing full strict 
encapsulation;
- [`compose`](./compose), which means that the application will be composed of HTML5 elements or web components using 
the composer API on a provided configuration;
- [`parcel`](./parcels), which means that the orchestrator will be provided with the full scope of assets needed to
start the applications (most of the time either an HTML file or JS scripts).

```json5 title=micro-lc.config.json
{
  // ...
  "applications": {
    "home": {
      "route": "./home",
      "integrationMode": "parcel"
      // ... rest of the application configuration
    },
    "orders": {
      "route": "/plugins/orders",
      "integrationMode": "compose"
      // ... rest of the application configuration
    },
    "docs": {
      "route": "/docs",
      "integrationMode": "iframe"
      // ... rest of the application configuration
    }
  }
}
```
