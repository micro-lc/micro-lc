---
title: Reuse third party libraries
description: Dependency sharing
sidebar_label: Reuse third party libraries
sidebar_position: 60
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
```

:::caution Disclaimer
For the time being, this feature is applicable **only to web components** (i.e., [layout](./layout.md) and application of
type [compose](./applications/compose.md)). In the future it will be extended also to [parcels](./applications/compose.md).
:::

Encapsulation and complete separation among components/applications may lead to bundle same third-party dependencies
multiple times. For instance, you might use the same framework to build your reusable components, and then compose your 
pages with components that belongs to different libraries.

## Import maps

To mitigate this issue, <micro-lc></micro-lc> ships with native support for [import maps](https://github.com/WICG/import-maps).

Since at present time neither Firefox nor Safari [support](https://caniuse.com/import-maps) import maps, <micro-lc></micro-lc>
embeds the [es-module-shims](https://github.com/guybedford/es-module-shims) import maps polyfill. Any composable content 
of <micro-lc></micro-lc> can leverage the import maps technique utility.

Suppose you want to use two web components form two different libraries, both having a direct dependency from 
[RxJS](https://rxjs.dev/).

```mdx-code-block 
<Tabs>
<TabItem value="library-1" label="Library 1" default>
```
```typescript title="my-awesome-web-component-1.ts"
import type { MicrolcApi } from '@micro-lc/orchestrator'
// highlight-next-line
import { filter } from 'rxjs'

class MyAwesomeWebComponent extends HTMLElement {
  microlcApi?: MicrolcApi

  connectedCallback () {
    this.microlcApi?.currentApplication$
      .pipe(filter(id => id === 'home'))
      .subscribe(() => console.log('We are at home!'))
  }
}

customElements.define('my-awesome-web-component', MyAwesomeWebComponent)
```
```mdx-code-block
</TabItem>
<TabItem value="library-2" label="Library 2">
```
```typescript title="my-awesome-web-component-2.ts"
import type { MicrolcApi } from '@micro-lc/orchestrator'
// highlight-next-line
import { filter } from 'rxjs'

class MyAwesomeWebComponent extends HTMLElement {
  microlcApi?: MicrolcApi

  connectedCallback () {
    this.microlcApi?.currentApplication$
      .pipe(filter(id => id !== 'home'))
      .subscribe(() => console.log('We are not at home!'))
  }
}

customElements.define('my-other-awesome-web-component', MyAwesomeWebComponent)
```
```mdx-code-block
</TabItem>
<TabItem value="micro-lc" label="micro-lc config">
```
```yaml title=micro-lc.config.yaml
applications:
  home:
    integrationMode: compose
    route: "/",
    config:
      sources:
        - "https://my-static-server/library-1.js"
        - "https://my-static-server/library-2.js"
      content:
        # highlight-next-line
        - tag: "my-awesome-web-component"
        # highlight-next-line
        - tag: "my-other-awesome-web-component"
```
```mdx-code-block
</TabItem>
</Tabs>
```

If you bundle the dependency in the libraries, RxJS will be downloaded twice when visiting a page using both the
components. However, if you bundle a version of the libraries leaving the import as a
[bare module import](https://github.com/WICG/import-maps#bare-specifiers-for-javascript-modules) (i.e., without including
it in the final bundle), you can leverage import maps functionality to download the shared dependency just once.

:::tip
Excluding modules at compile time while crafting your bundle is an option available to most JavaScript bundlers
(e.g., [Rollup](https://rollupjs.org/guide/en/#external)). When employed, it requires the browser who runs it to properly
interpret the import as a bare ES6 module import.

```typescript title="A bare module import"
import { filter } from 'rxjs'
```

Otherwise, the browser will fire an error like:

```mdx-code-block
<console-error-line>Error: Unable to resolve specifier 'rxjs'</console-error-line>
```

To learn more about the topic, visit [ES Module Shims repository](https://github.com/guybedford/es-module-shims#es-module-shims).
:::

### Usage

Import maps can be declared in different sections of <micro-lc></micro-lc> configuration depending on their scope.

If you want them to be accessible by the whole application (i.e., both layout and all mounted micro-frontends), you can
use top-level [`importmap` configuration key](../../api/micro-lc-web-component.md#importmap).

```mdx-code-block 
<details>
<summary>Example</summary>
<div>
<Tabs groupId="configuration">
<TabItem value="0" label="YAML" default>
```
```yaml title="micro-lc.config.yaml"
importmap:
  imports:
    react: https://esm.sh/react@next
    react-dom: https://esm.sh/react-dom@next
  scopes:
    https://esm.sh/react-dom@next:
      /client: https://esm.sh/react-dom@next/client
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="JSON">
```
```json title="micro-lc.config.json"
{
  "importmap": {
    "imports": {
      "react": "https://esm.sh/react@next",
      "react-dom": "https://esm.sh/react-dom@next"
    },
    "scopes": {
      "https://esm.sh/react-dom@next": {
        "/client": "https://esm.sh/react-dom@next/client"
      }
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

On the contrary, if you want to narrow their scope, you need to use key 
[`sources.importmap`](./applications/compose.md#plugin-configuration) when defining the configuration of a 
[layout](./layout.md), a [composable application](./applications/compose.md) or a
[custom composable error page](./applications/error-pages.md#custom-error-pages).

```mdx-code-block 
<details>
<summary>Example</summary>
<div>
<Tabs groupId="configuration">
<TabItem value="0" label="YAML" default>
```
```yaml title="micro-lc.config.yaml"
# 👇 Custom error pages
settings:
  4xx:
    404:
      integrationMode: compose
      config:
        sources:
          uris: https://my-static-server/my-web-component.js
        importmap:
          imports:
            react: https://esm.sh/react@next
            react-dom: https://esm.sh/react-dom@next
          scopes:
            https://esm.sh/react-dom@next:
              /client: https://esm.sh/react-dom@next/client
        content:
          tag: my-web-component

# 👇 Layout
layout:
  sources:
    uris: https://my-static-server/my-web-component.js
  importmap:
    imports:
      react: https://esm.sh/react@next
      react-dom: https://esm.sh/react-dom@next
    scopes:
      https://esm.sh/react-dom@next:
        /client: https://esm.sh/react-dom@next/client
  content:
    tag: my-web-component

# 👇 Composable applications
applications:
  - compose:
      integrationMode: compose
      route: ./compose
      config:
        sources:
          uris: https://my-static-server/my-web-component.js
        importmap:
          imports:
            react: https://esm.sh/react@next
            react-dom: https://esm.sh/react-dom@next
          scopes:
            https://esm.sh/react-dom@next:
              /client: https://esm.sh/react-dom@next/client
        content:
          tag: my-web-component
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="JSON">
```
```json title="micro-lc.config.json"
{
  "settings": {
    "4xx": {
      "404": {
        "integrationMode": "compose",
        "config": {
          "sources": {
            "uris": "https://my-static-server/my-web-component.js"
          },
          "importmap": {
            "imports": {
              "react": "https://esm.sh/react@next",
              "react-dom": "https://esm.sh/react-dom@next"
            },
            "scopes": {
              "https://esm.sh/react-dom@next": {
                "/client": "https://esm.sh/react-dom@next/client"
              }
            }
          },
          "content": {
            "tag": "my-web-component"
          }
        }
      }
    }
  },
  "layout": {
    "sources": {
      "uris": "https://my-static-server/my-web-component.js"
    },
    "importmap": {
      "imports": {
        "react": "https://esm.sh/react@next",
        "react-dom": "https://esm.sh/react-dom@next"
      },
      "scopes": {
        "https://esm.sh/react-dom@next": {
          "/client": "https://esm.sh/react-dom@next/client"
        }
      }
    },
    "content": {
      "tag": "my-web-component"
    }
  },
  "applications": [
    {
      "compose": {
        "integrationMode": "compose",
        "route": "./compose",
        "config": {
          "sources": {
            "uris": "https://my-static-server/my-web-component.js"
          },
          "importmap": {
            "imports": {
              "react": "https://esm.sh/react@next",
              "react-dom": "https://esm.sh/react-dom@next"
            },
            "scopes": {
              "https://esm.sh/react-dom@next": {
                "/client": "https://esm.sh/react-dom@next/client"
              }
            }
          },
          "content": {
            "tag": "my-web-component"
          }
        }
      }
    }
  ]
}
```
```mdx-code-block
</TabItem>
</Tabs>
</div>
</details>
```

Regardless of where import maps are declared, their configuration is an object of the following shape:

```typescript
interface ImportMap {
  imports?: Record<string, string>
  scopes?: Record<string, Record<string, string>>
}
```

Key `imports` allows control over what URLs get fetched by JavaScript import statements and import() expressions. It is
an object mapping modules to URLs from which they can be fetched.

```yaml
importmap:
  imports:
    react: https://esm.sh/react@next
```

It is often the case that you want to use the same import specifier to refer to multiple versions of a single library,
depending on who is importing them. This encapsulates the versions of each dependency in use, and avoids dependency hell.
This use case is supported through key `scopes` which allows you to change the meaning of a specifier within a given
scope.

```yaml
scopes:
  https://esm.sh/react-dom@next:
    /client: https://esm.sh/react-dom@next/client
```
