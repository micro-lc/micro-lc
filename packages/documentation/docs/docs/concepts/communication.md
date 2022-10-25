---
title: Communication
description: Internal communication between micro-lc building blocks
sidebar_label: Communication
sidebar_position: 30
---

In the classic, monolithic approach to frontend applications, each page, section, or domain resides in the same
context (the application itself), which makes it easy enough to exchange data and information from one side to the other.

This task of cross-communication becomes a bit more troublesome when transitioning to micro-frontend world, since
the whole application is divided into multiple, smaller entities running independently with respect to one another.

[Multiple techniques](https://sharvishi9118.medium.com/cross-micro-frontend-communication-techniques-a10fedc11c59)
are available to solve this issue. The approach of <micro-lc></micro-lc> consists in **discouraging global state
pattern in favour of event-driven communication**. Moreover, contexts can be shared between applications and
content applications by using either declarative tools or forcing state refresh by updating properties (React-like).

## micro-lc API

:::tip
Be sure to check out the [detailed overview](../../api/micro-lc-api) of the API capabilities.
:::

The primary mean of communication <micro-lc></micro-lc> offers to application domains is an API injected into each
element composing the layout and as property of all applications rendered as content.

The API then serves as a bridge between the two sides of <micro-lc></micro-lc> — layout and content — and between
different contents. Just to mention a few example, it is useful for sharing:
* style,
* state,
* language
* functional utilities,
* current configuration,
* routing facilities.

<micro-lc></micro-lc> API is extensible, meaning that either layout or content applications can add new state and new
functional utilities. It also provides a reactive interface, acting as a Pub/Sub channel to enable event-driven refreshing
of components or parts of the application.

It encourages using its own routing facilities instead of browser native ones to better handle transition from one
application to another whereas it's totally agnostic towards parts of the browser which do not concern routing, such
as local storage, cookies, and so on.

To provide an example, while adding a custom web component to your layout or any composable application, a useful pattern
to access the API would be:

```typescript title=my-awesome-component.ts
import type { MicrolcApi } from '@micro-lc/orchestrator'

class MyAwesomeWebComponent extends HTMLElement {
  // highlight-next-line
  microlcApi?: MicrolcApi
  
  connectedCallback () {
    console.log('Current micro-lc config: ', this.microlcApi?.getCurrentConfig())
  }
}

customElements.define('my-awesome-component', MyAwesomeWebComponent)
```

## Browser native API

While independent from <micro-lc></micro-lc>, it is useful to point out that each component or content application have
access to the [DOM Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) object, meaning that
[Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) are available for use (and _use is encouraged!_).

:::tip
Before using APIs be sure to check [browser compatibility](https://caniuse.com/).
:::

For example, you may use storage APIs (e.g., browser Locale Storage) to share data between micro-frontends implementing
an asynchronous, Pub/Sub solution.
