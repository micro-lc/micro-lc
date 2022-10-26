---
id: plugin_configuration
title: Plugin configuration
sidebar_label: Plugin configuration
---

This section will explain the different kind of integration modes, and how to make them work.

If you don't know where to place them, we suggest reading [Core configuration](core_configuration.md) first.

## href plugin

An `href` plugin doesn't require any kind of adjustment to work with `micro-lc`.

This is the simplest plugin that `micro-lc` supports. It allows you to redirect the user to another page,
using the same window or a different one, thanks to the [sameWindow](core_configuration.md#samewindow) property.


## Iframe plugin

To work properly, `iframe` needs the 
[`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) header:
this must be configured on the web server in which the frontend application is exposed.

:::caution
For security reasons, we suggest configuring `X-Frame-Options` with `ALLOW-FROM`, instead of using a wildcard.
:::

This kind of plugin allows you to include a website **without changing its implementation**.
However, there are also has some limitations:
- an `iframe` **can't** access the `css variables` provided by `micro-lc`;
- an `iframe` **doesn't** support the properties injected by `micro-lc`;
- inside an `iframe`, it **isn't** possible to control the `micro-lc` navigation flow.

If you own the website to integrate, we advise you to use a [`Qiankun plugin`](#qiankun-plugin).

## Qiankun plugin

To integrate this kind of plugins we rely on the [`qiankun`](https://qiankun.umijs.org/) solution,
that requires most attention on the developer side.

To integrate a `qiankun` plugin with `micro-lc`, you must adapt your web application following the steps described 
[here](https://github.com/umijs/qiankun/blob/master/docs/guide/tutorial.md#micro-app): 
the right procedure depends on the framework used to build the website.

If you want to create **a plugin from scratch using `React`**, consider to use 
[our template](https://github.com/mia-platform-marketplace/microlc-plugin-template).

:::caution
Depending on where you expose your plugin, you should configure the `Access-Control-Allow-Origin` header.

For security reasons, we discourage the use of a wildcard.
:::

### Plugin communication

Each `qiankun` plugin is able to *communicate* with other `qiankun` plugins, and to *navigate* to `qiankun` or `iframe` plugins just using
the standard `window.history.push` functionality: the parameters between plugins can be shared using the `window.location.search`.

An implementation example is available on [GitHub](https://github.com/mia-platform/micro-lc/blob/main/example/src/App.jsx#L24),
as you can see:
```js
let searchParams = new URLSearchParams(window.location.search);
``` 
is used to parse the received parameters, while:
```js 
window.history.pushState({}, `/${pluginRoute}`, `/${pluginRoute}?from=${from}`)
```
is used to navigate to another plugin while it is passing the `from` parameter.
