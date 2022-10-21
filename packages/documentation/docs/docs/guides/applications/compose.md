---
title: Compose
sidebar_label: Compose
sidebar_position: 20
---

:::caution
This section is work in progress.
:::

> Da finire dopo la sezione "composability" e spiegare chiave "config" (json, yaml o conf diretta)

A composable application is a pseudo-HTML document enhanced with JavaScript properties dynamically injected
by the composer application. A configuration is mandatory and can either be a full configuration or a URL to be downloaded
to obtain the configuration.

```json5 title=micro-lc.config.json
{
  // ...
  "applications": {
    "orders": {
      "route": "/plugins/orders",
      "integrationMode": "compose",
      "config": "/api/orders.json"
    }
  }
}
```
