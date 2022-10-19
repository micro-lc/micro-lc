---
title: iFrames
sidebar_label: iFrames
sidebar_position: 10
---

When an `iframe` integrated application is configured, its context is rendered inside the <micro-lc></micro-lc> mount point
as an `iframe` tag. It is mandatory to explicitly set a source to the corresponding
[`iframe`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) element. Moreover any valid attribute
will be passed to the element

```json5 title=micro-lc.config.json
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

By default, the style of an `iframe` application is set to

```css
iframe {
  width: inherit;
  height: inherit;
  border: none;
}
```

and can be overridden easily by setting the `style` attribute.

:::caution
Be mindful that a website [cannot](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) be embedded
as an `iframe` if it served with any `X-Frame-Options` header and <micro-lc></micro-lc> is not `SAMEORIGIN` of the embedded `iframe`.

Attempting to do so will result in a console error like:

```mdx-code-block
<p style={{padding: '10px', backgroundColor: '#ffc7d577', color: 'red', borderRadius: '5px'}}>
  The loading of “https://www.google.com/” in a frame is denied by “X-Frame-Options“ directive set to “SAMEORIGIN“
</p>
```

When a website responds with a `X-Frame-Options` header, the `iframe` does not emit an `onerror` event, hence <micro-lc></micro-lc>
cannot redirect to an error page. The view then depends on the browser used to run the application.
:::
