---
title: 🔧 mlc-loading-animation
sidebar_label: 🔧 mlc-loading-animation
sidebar_position: 20
---

Web-component to display a loading animation until one of its children has finished loading.

## Usage

The web-component works by hiding its children with a spinning animation until one of them declares its readiness.

Practically speaking, the component injects a method called `onload` into each one of its children while hiding them setting
their display style to `none`. When the `onload` method of one of these children is invoked, the component resets the
original display style of the children and hides itself.

In most use cases, this component is used as a wrapper of `micro-lc` itself, which will call `onload` when
its update lifecycle has ended upon connection and first render.

```html title=index.html
<mlc-loading-animation primary-color="#25b864">
  <micro-lc config-src="./config.json"></micro-lc>
</mlc-loading-animation>
```

### Example

Let's take in consideration the following configuration.

```html title=index.html
<mlc-loading-animation primary-color="#25B864">
    <div id="content" style="display: flex;">
      Content
    </div>
</mlc-loading-animation>
```

At startup, the page will show the spinning animation and the div with id `content` will be hidden. As soon as someone
calls the newly injected method `onload` of the div, the animation is hidden and the div shown.

## Properties & attributes

|    Property    |    Attribute    |   Type   | Description                                                                                                   |
|:--------------:|:---------------:|:--------:|---------------------------------------------------------------------------------------------------------------|
| `primaryColor` | `primary-color` | `string` | Color of the animation. It can be Hex, 8-digit Hex, RGB, RGBA HSL, HSLA, HSV, HSVA, or CSS color name string. |

