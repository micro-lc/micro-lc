---
title: Routing
sidebar_label: Routing
sidebar_position: 30
---

## `goTo`

```typescript
export interface MicrolcApi {
  router: {
    // highlight-next-line
    goTo: (url: string | URL | undefined) => void
    // ...rest of the API
  }
  // ...rest of the API
}
```

## `goToApplication`

```typescript
export interface MicrolcApi {
  router: {
    // highlight-next-line
    goToApplication<S = unknown>(id: string, opts?: {data?: S; type?: 'push' | 'replace'}): Promise<void>
    // ...rest of the API
  }
  // ...rest of the API
}
```

## `goToErrorPage`

```typescript
export interface MicrolcApi {
  router: {
    // highlight-next-line
    goToErrorPage(statusCode?: number): void
    // ...rest of the API
  }
  // ...rest of the API
}
```

## `open`

```typescript
export interface MicrolcApi {
  router: {
    // highlight-next-line
    open: (url?: string | URL, target?: string, features?: string) => Window | null
    // ...rest of the API
  }
  // ...rest of the API
}
```

`open` mirrors the [browser native API](https://developer.mozilla.org/en-US/docs/Web/API/Window/open).

## `pushState`

```typescript
export interface MicrolcApi {
  router: {
    // highlight-next-line
    pushState: (data: any, unused: string, url?: string | URL | null) => void
    // ...rest of the API
  }
  // ...rest of the API
}
```

`pushState` mirrors the [browser native API](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState).

## `replaceState`

```typescript
export interface MicrolcApi {
  router: {
    // highlight-next-line
    replaceState: (data: any, unused: string, url?: string | URL | null) => void
    // ...rest of the API
  }
  // ...rest of the API
}
```

`replaceState` mirrors the [browser native API](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState).
