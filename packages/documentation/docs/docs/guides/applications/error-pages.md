---
title: Error pages
sidebar_label: Error pages
sidebar_position: 40
---

:::caution
This section is work in progress.
:::

Error pages are applications without a **route**, meaning that they will be mounted when something goes wrong either
fetching the required application assets, or the requested application is not available or configured. Finally, they may
appear on internal server errors.

```mdx-code-block
<></>
<example-frame
  base="/frames/guides/applications/error-pages"
  height="550px"
  showSource={false}
  src={"/"}
  title="404 error"
></example-frame>
```

<micro-lc></micro-lc> provides three default error pages matching errors `401`, `404`, and `500`. It displays `404` when the required
route does not match a configured application, while `401` and `500` are triggered on assists fetch errors corresponding
to unauthorized and internal server error.

:::tip
Default error pages primary color can be set by the `--micro-lc-primary-color` global variable.
:::

:::danger Important Takeaway
Unauthorized status must be fully managed by your Backend interface.
:::

## Custom error pages

To override default error pages, a dedicated section of <micro-lc></micro-lc> configuration is available. Under `settings`, errors
are divided into client errors (key `4xx`) and server errors (key `5xx`). Error pages are then just regular applications
without route.

```json title=micro-lc.config.json
{
  "settings": {
    "4xx": {
      "404": {
        "integrationMode": "parcel",
        "entry": "application-url"
      }
    },
    "5xx": {
      "500": {
        "integrationMode": "compose",
        "config": {
          "content": {
            "tag": "p",
            "content": "Internal Server Error!"
          }
        }
      }
    }
  }
}
```

:::tip
Displaying error pages can be triggered by <micro-lc></micro-lc> API.
:::

### Lifecycle

Error pages have access to a slightly different version of [parcels lifecycle methods](parcels.md#lifecycle-methods).

[`bootstrap`](parcels.md#bootstrap), [`mount`](parcels.md#mount), and [`unmount`](parcels.md#unmount) methods
have arguments implementing the following interface.

```typescript
interface ErrorPageLifecycleProps extends LifecycleProps {
  message?: string
  reason?: string
}
```

* `message` is the primary error message.
* `reason` is the cause of the error.

:::tip
You can use those extra properties for user feedback.
:::

On top of that, error pages have an extra [update](parcels.md#update) method, which is called when the page is already
mounted but properties have changed.

```typescript
function update(props: { message?: string; reason?: string }): Promise<null> {
  /* This is where you do updates */
}
```
