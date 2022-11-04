---
title: Extensions
description: Built-in and custom API extensions
sidebar_label: Extensions
sidebar_position: 40
---

Extensions is a grouping for static (i.e., not event-driven) API. `extensions` accepts plugins as keys in a JavaScript
object. `extensions` are initialized with a set of default features.

## Manipulating extensions

To get currently mounted extensions, API provides method `getExtensions` which returns an immutable object which
contains extensions as properties of an object. Being an immutable object, there is no direct way to modify it. If
a component or application need to add an extension, the API provides method `setExtension`, which takes the scoping
key of the new extension and its content.

```typescript
// Application 1 ⤵
microlcApi.setExtension({ getUserName: () => 'John Doe' })

// Application 2 ⤵
const userNameGetter = microlcApi.getExtensions().getUserName
console.log(userNameGetter())
// output: "John Doe"
```

### `getExtensions`

```typescript
export interface MicrolcApi<T extends BaseExtension> {
  // highlight-next-line
  readonly getExtensions: () => Readonly<Partial<T>>
  // ...rest of the API
}
```

### `setExtension`

```typescript
export interface MicrolcApi<T extends BaseExtension> {
  // highlight-next-line
  readonly setExtension: (key: keyof T, value: T[keyof T]) => Readonly<T>
  // ...rest of the API
}
```

## Base extension

```typescript
type BaseExtension = Record<string, unknown> & {
  css: { /*...*/ }
  head: { /*...*/ }
  json: { /*...*/ }
  language: { /*...*/ }
}
```

### `css.setStyle`

```typescript
export type BaseExtension = Record<string, unknown> & {
  css: {
    // highlight-next-line
    setStyle: (styles: CSSConfig) => void
  }
}

interface CSSConfig {
  global?: Record<string, string | number>
  nodes?: Record<string, Record<string, string | number>>
}
```

`head.setIcon` can be used to [inject styling](../../docs/guides/style.md) in <micro-lc></micro-lc> applications.

### `head.setIcon`

```typescript
export type BaseExtension = Record<string, unknown> & {
  head: {
    // highlight-next-line
    setIcon: (attrs: Partial<Pick<HTMLLinkElement, 'sizes' | 'href' | 'type'>>) => void
  }
}
```

`head.setIcon` can be used to set a `link` tag for [favicon](https://developer.mozilla.org/en-US/docs/Glossary/Favicon)
relation.

:::caution
Be aware that any application with integration mode [parcel](../../docs/guides/applications/parcels.md) can override this 
setting.
:::

### `head.setTitle`

```typescript
export type BaseExtension = Record<string, unknown> & {
  head: {
    // highlight-next-line
    setTitle: (title: string) => void
  }
}
```

`head.setTitle` can be used to set a [`title` tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title).

:::caution
Be aware that any application with integration mode [parcel](../../docs/guides/applications/parcels.md) can override this
setting.
:::

### `json.fetcher`

```typescript
export type BaseExtension = Record<string, unknown> & {
  json: {
    // highlight-next-line
    fetcher: (url: string, init?: RequestInit) => Promise<unknown>
  }
}
```

`json.fetcher` can be used to download a JSON or YAML resource. It performs a GET request including an `Accept` header
with the following value:

```text
Accept: application/json,text/x-json,application/yaml,application/x-yaml,text/yaml
```

The response is interpreted according to `Content-Type` header vale and then parsed as a JSON or a YAML accordingly.

:::caution
Be aware that YAML parsing requires an extra ~38 KB of dynamic import to be added to the total bundle size.
:::

and an `Accept-Language` header matching either the browser current language or any language that has been set via 
<micro-lc></micro-lc> API using the [`setLanguage`](#languagesetlanguage) method. When the required language is 
expressed ad `aa-AA`, an extra generic language is added with a quality factor. On `en-US` the header would be

```text
Accept-Language: en-US, en;q=0.5
```

This header can be leveraged in server [content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation).

The `RequestInit` type is the standard [fetch option type](https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts#L1534) where
`Accept` and `Accept-Language` headers cannot be overridden.

### `json.validator`

```typescript
export type BaseExtension = Record<string, unknown> & {
  json: {
    // highlight-next-line
    validator: <S>(json: unknown, schema: SchemaOptions, opts?: JsonCatcherOptions<S>) => Promise<S>
  }
}

type SchemaOptions = Ajv.SchemaObject | {
  id: string
  parts: Ajv.SchemaObject[]
}

interface JsonCatcherOptions<S> {
  defaultValue?: S
  file?: string
}
```

:::caution
This method works **only** in development mode. In production mode, simply proxies of the provided JSON.
:::

`json.validator` can be used to validate a JSON value against a schema using [Ajv](https://ajv.js.org/).

In case validation goes wrong, the return value would be the input object itself or, if you like to override it, the
default value provided in `opts.defaultValue`. To better understand validation errors, messages can be scoped with 
`opts.file`.

### `language.getLanguage`

```typescript
export type BaseExtension = Record<string, unknown> & {
  language: {
    // highlight-next-line
    getLanguage: () => string
  }
}
```

`language.getLanguage` can be used to retrieve current application language according to 
[rfc5646 specification](https://datatracker.ietf.org/doc/html/rfc5646). 

### `language.setLanguage`

```typescript
export type BaseExtension = Record<string, unknown> & {
  language: {
    // highlight-next-line
    setLanguage: (lang: string) => void
  }
}
```

`language.setLanguage` can be used to set current application language to a valid
[rfc5646 specification](https://datatracker.ietf.org/doc/html/rfc5646) tag.

:::caution
Be aware that, given the static nature of <micro-lc></micro-lc> APi extensions, `language.setLanguage` can be used
to dynamically change language, but it will trigger a full <micro-lc></micro-lc> config reload and update. This feature
is required to properly re-negotiate a translated configuration file.

Refer to [reactive communication section](./reactive-communication.md) for event-driven alternatives, but keep in mind
that <micro-lc></micro-lc> will use `language` extension to perform any language-related operation. 
:::
