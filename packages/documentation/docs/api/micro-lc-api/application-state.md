---
title: Application state
description: Consume content state
sidebar_label: Application state
sidebar_position: 10
---

<!-- TODO: Insert some examples -->

<micro-lc></micro-lc> API provides a subset of methods and properties to read the current state of the content part
of the application, and which sub-application is running in it.

It provides both an imperative and an event-driven interface from which any subscriber can choose whether to read static
the state or react to any change.

## `currentApplication$`

```typescript
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

export interface MicrolcApi {
  // highlight-next-line
  readonly currentApplication$: Observable<string | undefined>
  // ...rest of the API
}
```

`currentApplication$` is a [RxJS Observable](https://rxjs.dev/api/index/class/Observable) which emits anytime the content
application changes.

:::caution
If no application is found, it emits `undefined`.
:::

Since <micro-lc></micro-lc> applications are configured as a key-value pair, where the key is the unique identifier of
the application, currentApplication$` return such id as a string.

## `getCurrentApplication`

```typescript
export interface MicrolcApi {
  // highlight-next-line
  readonly getCurrentApplication: () => Readonly<Partial<{handlers: Handlers | undefined; id: string}>>
  // ...rest of the API
}

type Handlers = {
  mount(): Promise<null>
  unmount(): Promise<null>
  update?(customProps: Record<string, unknown>): Promise<any>
  getStatus():
    | "NOT_LOADED"
    | "LOADING_SOURCE_CODE"
    | "NOT_BOOTSTRAPPED"
    | "BOOTSTRAPPING"
    | "NOT_MOUNTED"
    | "MOUNTING"
    | "MOUNTED"
    | "UPDATING"
    | "UNMOUNTING"
    | "UNLOADING"
    | "SKIP_BECAUSE_BROKEN"
    | "LOAD_ERROR"
  loadPromise: Promise<null>
  bootstrapPromise: Promise<null>
  mountPromise: Promise<null>
  unmountPromise: Promise<null>
}
```

`getCurrentApplication` provides, statically, the handlers and the unique identifier of the application that is currently
running as content.

It can be helpful to update or unmount manually the application.

## `getCurrentConfig`

```typescript
export interface MicrolcApi {
  // highlight-next-line
  readonly getCurrentConfig: () => Readonly<CompleteConfig>
  // ...rest of the API
}
```

`getCurrentConfig` provides, statically, <micro-lc></micro-lc> complete configuration, where "complete" means the user
defined configuration merged with default on key not specified while configuring.

## `setCurrentConfig`

:::danger
This method is still work in progress. Usage will trigger complete refresh of the application coursing a loss of the 
layout.
:::

```typescript
export interface MicrolcApi {
  // highlight-next-line
  readonly setCurrentConfig: (newConfig: CompleteConfig) => void
  // ...rest of the API
}
```

`setCurrentConfig` provides a handler to replace <micro-lc></micro-lc> configuration at runtime.

No configuration diffing is scheduled, hence the full configuration is replace and <micro-lc></micro-lc> bootstraps from
scratch.
