---
title: Error pages
description: Applications to cover for errors
sidebar_label: Error pages
sidebar_position: 40
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
```

Error pages are applications without a **route**, meaning that they will be mounted when something goes wrong **fetching 
the required application assets**, when the requested application is **not available or configured**, or in response to
**internal server errors**.

## Default error pages

<micro-lc></micro-lc> provides three default error pages matching errors `401`, `404`, and `500`. It displays `404` when
the required route does not match a configured application, while `401` and `500` are triggered on assets fetch errors
corresponding to _Unauthorized_ and _Internal Server Error_ respectively.

:::caution Important Takeaway
Unauthorized status must be fully managed by your Backend interface.
:::

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

:::tip
Default error pages primary color can be set by the `--micro-lc-primary-color` global variable.
:::

## Custom error pages

To override default error pages, a [dedicated section](../../../api/micro-lc-web-component.md#settings) of 
<micro-lc></micro-lc> configuration is available. Under `settings`, errors are divided into client errors (key `4xx`) 
and server errors (key `5xx`). 

Error pages are then just regular applications without route, meaning that you can have [parcels](./parcels.md),
[composed applications](./compose.md), and even [iFrames](./iframes.md) rendered in response to errors.

:::tip
Displaying error pages can be triggered by [<micro-lc></micro-lc> API](../../../api/micro-lc-api/routing.md#gotoerrorpage).
:::

```mdx-code-block 
<Tabs groupId="configuration">
<TabItem value="0" label="YAML" default>
```
```yaml title="micro-lc.config.yaml"
settings:
  4xx:
    401:
      integrationMode: parcel
      entry: https://my-static-server/custom-401-error-page.html
    404:
      integrationMode: iframe
      src: https://my-website.com/
  
  5xx:
    500:
      integrationMode: compose
      config:
        tag: div
        content: Ops, an error occurred!
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="JSON">
```
```json title="micro-lc.config.json"
{
  "settings": {
    "4xx": {
      "401": {
        "integrationMode": "parcel",
        "entry": "https://my-static-server/custom-401-error-page.html"
      },
      "404": {
        "integrationMode": "iframe",
        "src": "https://my-website.com/"
      }
    },
    "5xx": {
      "500": {
        "integrationMode": "compose",
        "config": {
          "tag": "div",
          "content": "Ops, an error occurred!"
        }
      }
    }
  }
}
```
```mdx-code-block
</TabItem>
</Tabs>
```

### Lifecycle

When error pages are parcel applications, they have access to a slightly different version of 
[parcels lifecycle methods](parcels.md#lifecycle-methods).

[`bootstrap`](parcels.md#bootstrap), [`mount`](parcels.md#mount), and [`unmount`](parcels.md#unmount) methods
have arguments implementing the following interface.

```typescript
interface ErrorPageLifecycleProps extends LifecycleProps {
  message?: string
  reason?: string
}
```

Where `message` is the primary error message, and `reason` is the cause of the error.

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
