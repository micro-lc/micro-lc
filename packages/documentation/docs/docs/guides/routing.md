---
title: Routing
description: micro-lc approach to routing
sidebar_label: Routing
sidebar_position: 30
---

Routing refers to the logic <micro-lc></micro-lc> applies when choosing which micro-frontend should be loaded in the
[dynamic section](../concepts/separation-of-concerns.md) of the application based on the current URL.

Each [registered application](./applications) has to **declare its route**, which must be a valid URL pathname like:
- /home
- /home/accessible/
- /my-awesome-application/
- ./application
- ./react-application/about

:::caution
Absolute paths do not interact with any [_base_ tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)
provided into your main HTML page, while relative paths do.
:::

## Pattern matching

When browsing, <micro-lc></micro-lc> router attempts to match the current 
[URL `href`](https://developer.mozilla.org/en-US/docs/Web/API/URL/href) with any given registered application. The
matching returns at most three possible outcomes:
1. the **exact match**, if any, which is the longest regexp match found amongst applications `route` property,
2. the **exact match with a trailing slash**, if any, which is the same as before with a trailing slash,
3. the **default match**, as a fallback, if any, that enters the game only if URL is requesting the base path and a
default was specified with configuration key [`settings.defaultUrl`](../../api/micro-lc-web-component.md#defaulturl).

The list displays the matching priority: the first who matches will be rendered, otherwise a **404 error page** will be
shown.

To better understand the algorithm, consider, the following configuration:

```yaml title=micro-lc.config.yaml
settings:
  defaultUrl: /home

applications:
  home:
    # ...rest of the application config
    route: /home,

  about:
    # ...rest of the application config
    route: /about,

  about-details:
    # ...rest of the application config
    route: /about/details,

  router-app:
    # ...rest of the application config
    route: /application/,
```

Browsing to `/home` and `/home/` produces the same result: rendering the `home` application.
Moving to `/` – or equivalently to the `window.location.origin` – will still render `home`, since no match could be
found and `settings.defaultUrl` is declared to be `/home`.

When the client requires `/about/details`, the longest match is given by the `about-details` application, despite `/about`
being also available (and this behaviour is the one enabling the **construction of entire SPA-like applications** using
<micro-lc></micro-lc> router).

Finally, when a router application is called, like browsing to `/application/` the internal router of the application
kicks in. If the browser navigate to `/application`, no exact match is found, but a trailing slash is found on
`router-app` matching `/application/`. In this case <micro-lc></micro-lc> replaces the history state with the previous
route and an extra `/` at the end and routing resumes as before.

:::caution
The user is responsible for creating a list of routes that do not overlap.
:::

:::tip
Trailing slash on URL path names is not mandatory. It makes sense that an application could be served without a trailing
slash, like a `/home` page or a `/about` page. We do recommend to explicitly include the trailing slash on sub-applications
that carry a router, like a React application which might enjoy the slashed pathname like `/react-application/`.
:::

This chain of matching allows to both **replicate on the frontend the logic of a static server** (first it tries the uri,
then the uri with an extra `/index.html`, then 404 error page), and to **build an application with subpages**.

:::caution
The presence of a `base` tag on <micro-lc></micro-lc> HTML page, with `href` attribute different from `/`, must be taken
into account when designing application `route` properties. Namely, making all application `route`s relative with an
initial `./` should be enough to ensure routing.

Routes do not depend on the current URL `href` of the browser but are computed once and for all according to the document
`baseURI` when the configuration is passed to <micro-lc></micro-lc>. Keep in mind that `baseURI` is the `href` of a 
`base` tag, if any, or the current window location.
:::
