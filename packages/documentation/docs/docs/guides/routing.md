---
title: Routing
description: micro-lc approach to routing
sidebar_label: Routing
sidebar_position: 30
---

:::caution
This section is work in progress.
:::

> Best practice per il routing (aka come organizzare le chiavi "root" delle applicazioni)
>   * puoi fare tutto relativo a /
>   * puoi fare tutto relativo a ./ e scopizzare con base da inserire in index
>   * il router matcha per lunghezza del match (/orders, /orders/banana e vai su /orders/banana, va sul secondo)
>   * esempio per avere url dinamici

---

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
