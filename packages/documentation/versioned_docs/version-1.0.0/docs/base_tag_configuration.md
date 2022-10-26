---
id: base_tag_configuration
title: Base tag configuration
sidebar_label: Base tag configuration
---

Since version 0.8.0 `micro-lc` supports the definition of the [`base` HTML tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base).

To do this, in the `index.html` it imports a script using `./api/v1/microlc/configuration/micro-lc-base.js` as `src`.

This script can be served using the [general configuration API](general_configuration.md).

An example of the script's content can be the following:

```javascript
var baseTag = document.querySelector('base')
baseTag.setAttribute('href', '/your-base-path/')
baseTag.setAttribute('target', '_blank')
```
