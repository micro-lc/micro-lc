---
title: Composer API
description: micro-lc composer API
sidebar_label: Composer API
sidebar_position: 30
---

Any HTML element mounted in <micro-lc></micro-lc> via [layout](../docs/guides/layout.md) or
[mount point](../docs/guides/layout.md#mount-point), or any 
[composable application](../docs/guides/applications/compose.md) is provided with the property `composerApi`, which
provides the same dynamic capability for [mounting HTML subtrees](../docs/concepts/composition.md) <micro-lc></micro-lc>
itself uses under the hood.

The composer API is an object with two methods:
- `premount` which flattens polymorphic configurations and injects import maps, and
- `createComposerContext` which builds an appender that can be called by assigning a root HTML DOM appending the
dynamically configured HTML DOM as subtree of the root.

### `premount`

```typescript
interface ComposerApi {
  // ... rest of the API
  premount: (config: PluginConfiguration) => Promise<ResolvedConfig>
}
```

`premount` allows to reduce the 
[`PluginConfiguration` type](localhost:3000/docs/guides/applications/compose#plugin-configuration) to the following
`ResolvedConfig` type

```typescript
interface ResolvedConfig {
  content: Content
  sources: {
    importmap?: ImportMap
    uris: string[]
  }
}
```

After being called, `premount` ensures all import maps declared are available and `uris` sources have been fetched and
their code run. If there is no `sources` in the `PluginConfiguration`, `premount` is a no-operation.

### `createComposerContext`

```typescript
interface ComposerApi {
  // ... rest of the API
  createComposerContext: (
    content: Content,
    options: ComposerOptions
  ) => Promise<ComposerContextAppender>
}
```

Once `premount` has been run, if needed, `createComposerContext` provides a callback for appending the DOM
configured in `content`:

```typescript
type ComposerContextAppender = (container: HTMLElement | DocumentFragment, options?: RenderOptions) => void
```

where `container` is the root element that will be used to append the composed subtree and `options`
refer to optional features provided by the [`lit-html` `render` method](https://lit.dev/docs/api/templates/#render).

Finally, `options` in `createComposerContext` is the object to interact with when the compiler needs to be
instructed to recognize some properties as special context. This feature allows to inject JS context avoiding eval and
works according to the [composability principles](../docs/guides/applications/compose.md#interpolated-properties).