---
title: How to add an application
sidebar_label: How to add an application
sidebar_position: 40
---

## Applications

Three integration methods are availble to add an application to
the context of micro-lc. Applications are distinguished by error pages
due to the fact they have a fixed routing pattern.

### Route

Each application must have a **route** which must be a valid
URL pathname (the trailing slash is not mandatory) like:

- /home
- /home/accessible/
- /my-awesome-application/
- ./react-application
- ./react-application/about

Absolute paths do not interact with an eventual `base` tag provided to
your main HTML page whereas relative do. 

Clearly if no `base` tag is provided
there is no need to use relative path. Anyway when configuring a micro-lc
instance it might be useful to use relative paths in order to be able to move
your application away from `/` if needed.

```json5 file=config.json
{
  // ...,
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

The router picks always the longest match, hence if both `/home` and `/home/accessible`
are registered, on `/home/accessible` navigation from URL top bar or `pushState`
the router will avoid `/home`.
It is up to the user to ensure there are no clashes between an application which have an internal router and routes declarations. This scenario though is fairly unlikely.

:::caution

routes do not depend on the current `href` of the page but are determined once
and for all according with the document `baseURI`. Keep in mind that `baseURI` is
the `href` of a `base` tag, if any, or the current window location.

:::

### Integration Modes

An application must have an `integrationMode` property which is either:

- iframe
- compose
- parcel

`iframe` indicates the application will be embedded in an iframe tag providing
full strict encapsulation.
`compose` means that the application will be composed from HTML5 elements or webcomponents
using the composer API on a provided configuration
`qiankun` means that the orchestrator will be provided with the full scope of
assets needed to start the applications (most of the time either an html file or JS scripts)

```json5 file=config.json
{
  // ...,
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

#### iframe

When an `iframe` integrated application is configured, its context is rendered inside the micro-lc mount point
as an `iframe` tag. It is mandatory to explicitly set a source to the corresponding
[`iframe`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) element. Moreover any valid attribute
will be passed to the element

```json5 file=config.json
{
  // ...,
  "applications": {
    "docs": {
      "route": "/docs",
      "integrationMode": "iframe",
      "src": "https://docs.mia-platform.eu",
      "attributes": {
        "title": "Inline Frame Example",
        // ... more attributes
      }
    }
  }
}
```

Attributes are not mandatory.

By default the style of an `iframe` application is set to

```css
width: inherit;
height: inherit;
border: none;
```

and can be overriden easily by setting the `style` attribute.

:::caution

Be mindful that a website [cannot](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) be embedded as an `iframe` if it served with any `X-Frame-Options` header
and micro-lc is not `SAMEORIGIN` of the embedded `iframe`.
Attempting to do so will result in a console error like

<div style={{padding: '10px', backgroundColor: '#ffc7d577', color: 'red', borderRadius: '5px', marginBottom: '15px'}}>
The loading of “https://www.google.com/” in a frame is denied
by “X-Frame-Options“ directive set to “SAMEORIGIN“
</div>

When a webside responds with a `X-Frame-Options` header, the `iframe` does not emit an `onerror` event, hence micro-lc cannot redirect to an error page.
The view then depends on the browser used to run the application.

:::

#### compose

A composable application is a pseudo-HTML document enhanced with JavaScript properties dynamically injected
by the composer application. A configuration is mandatory and can either be
a full configuration or a URL to be downloaded to obtain the configuration

```json5 file=config.json
{
  // ...,
  "applications": {
    "orders": {
      "route": "/plugins/orders",
      "integrationMode": "compose",
      "config": "/api/orders.json"
    }
  }
}
```

#### parcel

## Error Pages

Error pages are applications without a **route**.
