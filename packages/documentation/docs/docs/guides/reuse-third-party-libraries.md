---
title: Reuse third party libraries
sidebar_label: Reuse third party libraries
sidebar_position: 60
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
```

:::caution
This section is work in progress.
:::

:::info Disclaimer
For the time being, this feature is applicable **only to web components** (i.e., layout and application of type
[compose](./applications/compose)). In the future it will be extended also to [parcels](./applications/compose).
:::

Encapsulation and complete separation among components/applications may lead to bundle same third-party dependencies
multiple times. For instance, you might use the same framework to build your reusable components, and then compose your 
pages with components that belongs to different libraries.

## Import maps

To mitigate this issue, <micro-lc></micro-lc> ships with native support for [import maps](https://github.com/WICG/import-maps).

Since at present time neither Firefox nor Safari [support](https://caniuse.com/import-maps) import maps, <micro-lc></micro-lc>
embeds the [es-module-shims](https://github.com/guybedford/es-module-shims) import maps polyfill. Any composable content 
of <micro-lc></micro-lc> can leverage the import maps technique utility.

### Usage example

Suppose you want to use two web components form two different libraries, both having a direct dependency from RxJS.

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
```yaml title=micro-lc.config.yml
"$schema": "https://cdn.jsdelivr.net/npm/@micro-lc/interfaces@latest/schemas/v2/config.schema.json"
version: 2
applications:
  admins:
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

To achieve this behaviour, the share dependency has to be declared in <micro-lc></micro-lc> configuration. The point
where you declare it depends on its scope: it can be declared at application level – and it would be available only to
the components in that application –, or globally – and it would be available everywhere –.

```mdx-code-block
<Tabs>
<TabItem value="application-level" label="Application level" default>
```
```yaml title=micro-lc.config.yml
"$schema": "https://cdn.jsdelivr.net/npm/@micro-lc/interfaces@latest/schemas/v2/config.schema.json"
version: 2
applications:
  admins:
    integrationMode: compose
    route: "/",
    config:
      sources:
        uris: 
        - "https://my-static-server/library-1.js"
        - "https://my-static-server/library-2.js"
        # highlight-start
        importmap: 
          imports:
            rxjs: "https://cdn.jsdelivr.net/npm/@esm-bundle/rxjs@7.5.6/esm/es2015/rxjs.min.js"
        # highlight-end
      content:
        - tag: "my-awesome-web-component"
        - tag: "my-other-awesome-web-component"
```
```mdx-code-block
</TabItem>
<TabItem value="global-level" label="Global level">
```
```yaml title=micro-lc.config.yml
"$schema": "https://cdn.jsdelivr.net/npm/@micro-lc/interfaces@latest/schemas/v2/config.schema.json"
version: 2
# highlight-start
importmap:
  imports:
    rxjs: "https://cdn.jsdelivr.net/npm/@esm-bundle/rxjs@7.5.6/esm/es2015/rxjs.min.js"
# highlight-end
applications:
  admins:
    integrationMode: compose
    route: "/",
    config:
      sources:
        - "https://my-static-server/library-1.js"
        - "https://my-static-server/library-2.js"
      content:
        - tag: "my-awesome-web-component"
        - tag: "my-other-awesome-web-component"
```
```mdx-code-block
</TabItem>
</Tabs>
```

### Dependency scoping
