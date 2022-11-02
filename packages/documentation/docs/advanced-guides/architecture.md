---
title: Architecture
description: micro-lc architecture
sidebar_label: Architecture
sidebar_position: 10
---

## Web component layout

<micro-lc></micro-lc> is an HTML5 custom web component with tag `micro-lc` and comes in two flavors: _development_ and
_production_.

_Development_ variant is injected into the 
[`CustomElementRegistry`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry) with a larger bundle
size (~700 KB) since it includes an instance of the [Ajv JSON schema validator](https://ajv.js.org/) to check if
configuration provided to the web components are valid. _Development_ variant also provides feedback on errors via
browser `console`.

To reduce the bundle size, _production_ variant lacks all previously mentioned features and shrinks down to ~180 KB.

<micro-lc></micro-lc> needs at least a configuration to run its first internal update. There are two ways to provide a configuration:
* set an attribute `config-src` (or the mirrored property `configSrc`) with a valid relative or absolute URL, or 
* set a property `config` with the parsed JSON of a configuration.

:::caution
Ensure the configuration is provided by HTTP response carrying either `application/json` or `text/x-json` as 
`Content-Type` header. <micro-lc></micro-lc> will make a request providing an `Accept` header including those types.
:::

The other attribute with mirrored property available is `disable-shadow-dom` (`disableShadowDom`) and it is interpreted
as a `boolean` attribute. When returns a `true`, `disable-shadow-dom` forces <micro-lc></micro-lc> to render its entire application,
layout and content, inside the real DOM dropping the shadow DOM encapsulation.

### Side effects

On first update, <micro-lc></micro-lc> dynamically imports the [`es-module-shims`](https://github.com/guybedford/es-module-shims) library
to manage bare ES module imports. Any bare import will be added to the window instance of `es-module-shims` being globally
available. If `es-module-shims` is already provided within your HTML file (maybe with a different versioning), <micro-lc></micro-lc>
will not try to override it.

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
<head>
  <script async src="https://ga.jspm.io/npm:es-module-shims@1.6.1/dist/es-module-shims.js"></script>
  <script async type="module" src="****************/micro-lc.production.js"></script>
</head>
<body>
  <micro-lc config-src="./config.json"></micro-lc>
</body>
</html>
```

Moreover, <micro-lc></micro-lc> will make extensive use of qiankun, which binds a global state to the document window. Due to this fact
<micro-lc></micro-lc> cannot be displayed within itself without an `iframe` separating the two instances. Potentially coexistence is
possible but application routing in one instance would reroute the parent application as well making it, *de facto* useless.

<micro-lc></micro-lc> registers a listener on the window `popstate` event meaning it will 
[react](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event) according to user actions meant to change
the page state. If <micro-lc></micro-lc> is disconnected from the page it will unregister all listeners. Currently, it also listens 
to the [`DOMContentLoaded` event](https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event), but it
does not perform any action.

## Configuration injection

When a configuration is provided, some validation steps are taken:
- in _development_ variant the configuration is checked against its schema. In case validation fails, <micro-lc></micro-lc> uses the 
default configuration;
- in _production_ variant the configuration is trusted to be valid
- then, in both flavors, the configuration is merged with the default to ensure that non provided settings are defaulted

Then the lifecycle of <micro-lc></micro-lc> begins
1. it no `es-module-shims` is provided, it is imported
2. global import maps are injected
3. <micro-lc></micro-lc> renders first on shadow dom (layout) then the mount point (content)
4. applications are registered (routes and each independent configuration)
5. the application routes list is cleared
6. the router is rerouted to `window.location.href`
7. the variable `_completeUpdate` is set to `true` (for testing purposes)
8. the `onload` event is fired (useful to clean up a loading mask)

### Default configuration

Default configuration is used if validation steps fail or, by key, when
the user does not provide values for some configuration keys.

- version ➡ 2
- layout ➡ `{content: {tag: 'slot'}}` or equivalently `<slot></slot>`
- settings ➡
