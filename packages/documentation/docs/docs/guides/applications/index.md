---
title: Applications
description: Dynamic portion of micro-lc
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
import CodeBlock from '@theme-original/CodeBlock'
```

Applications are micro-frontends rendered in the [dynamic part](../../concepts/separation-of-concerns.md) of 
<micro-lc></micro-lc>. Each application corresponds to a URL pathname, and <micro-lc></micro-lc> is responsible to 
property handle [routing](../routing.md) between them.

<micro-lc></micro-lc> supports three different micro-frontend patterns to integrate applications:
- [`iframe`](./iframes.md), where applications are embedded in an iframe tag providing full strict encapsulation,
- [`compose`](./compose.md), where applications are dynamically composed of HTML5 elements or web components following a
provided configuration, and
- [`parcel`](./parcels.md), where the orchestrator is provided with the full scope of assets needed to start the applications
(most of the time either an HTML file or JS scripts).

There also exists a particular type of applications, [error pages](./error-pages.md), which differ in that have a fixed
routing pattern.

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```

## Configuration

Applications are registered in the context of <micro-lc></micro-lc> through 
configuration key [`applications`](../../../api/micro-lc-web-component.md#applications), a map linking application 
**unique identifiers** to specific information needed for the **integration**.

<CodeBlock language="typescript">
interface Applications &#123;{'\n'}
  {'\ \ '}[unique_id: string]: <a href="./iframes">IFrameApplication</a> | <a href="./compose">ComposableApplication</a> | <a href="./parcels">ParcelApplication</a>{'\n'}
}
</CodeBlock>

```mdx-code-block
<details>
<summary>Example</summary>
<div>
<Tabs groupId="configuration">
<TabItem value="0" label="YAML" default>
```
```yaml title="micro-lc.config.yaml"
applications:
  iFrame:
    integrationMode: iframe
    route: ./my-iframe-application
    src: https://www.wikipedia.org/
    attributes:
      title: Wikipedia
      
  compose:
    integrationMode: compose
    route: ./my-compose-application
    config:
      - tag: div
        attributes:
          style: "color: red;"
        content: Hello World!
  
  parcel:
    integrationMode: parcel
    route: ./my-parcel-application
    entry: https://my-static-server/my-parcel-entry.html
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="JSON">
```
```json title="micro-lc.config.json"
{
  "applications": {
    "iFrame": {
      "integrationMode": "iframe",
      "route": "./my-iframe-application",
      "src": "https://www.wikipedia.org/",
      "attributes": {
        "title": "Wikipedia"
      }
    },
    "compose": {
      "integrationMode": "compose",
      "route": "./my-compose-application",
      "config": [
        {
          "tag": "div",
          "attributes": {
            "style": "color: red;"
          },
          "content": "Hello World!"
        }
      ]
    },
    "parcel": {
      "integrationMode": "parcel",
      "route": "./my-parcel-application",
      "entry": "https://my-static-server/my-parcel-entry.html"
    }
  }
}
```
```mdx-code-block
</TabItem>
</Tabs>
</div>
</details>
```


