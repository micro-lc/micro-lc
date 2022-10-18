---
title: API
---

<micro-lc></micro-lc> injects an API into each element composing the layout and as property of all applications rendered
as content.

The API then serves as a bridge between the two sides of <micro-lc></micro-lc> — layout and content — and between different
contents. It is useful for sharing:
* style,
* state,
* language
* functional utilities,
* current configuration,
* routing facilities,
* ...

<micro-lc></micro-lc> API is extensible, meaning that either layout or content applications can add new state and new
functional utilities. It also provides a reactive interface, acting as a Pub/Sub channel to enable event-driven refreshing
of components or parts of the application.

It encourages using its own routing facilities instead of browser native ones to better handle transition from one
application to another whereas it's totally agnostic towards parts of the browser which do not concern routing such
as local storage, cookies, and so on.

For instance, while adding a custom web component to your layout or any composable application, a useful pattern to
access the API would be:

```typescript title=my-awesome-component.ts
import type { MicrolcApi } from '@micro-lc/orchestrator'

class MyAwesomeWebComponent extends HTMLElement {
  microlcApi?: MicrolcApi
  
  connectedCallback () {
    console.log('Current micro-lc config: ', this.microlcApi?.getCurrentConfig())
  }
}

customElements.define('my-awesome-component', MyAwesomeWebComponent)
```

The API is clustered into:
* [application state](./application-state)
* [reactive communication](./reactive-communication)
* [routing](./routing)
* [extensions](./extensions)
