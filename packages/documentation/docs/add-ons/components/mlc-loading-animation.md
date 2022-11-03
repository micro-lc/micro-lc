---
title: 🖼 mlc-loading-animation
description: Beautiful loading animation
sidebar_label: 🖼 mlc-loading-animation
sidebar_position: 20
---

Web component to display a loading animation until one of its children has finished loading.

```mdx-code-block
<></>
<example-frame
  base="../../frames/components/mlc-loading-animation"
  height="550px"
  showSource={false}
  src={"/"}
  title="Overview"
></example-frame>
```

## How it works

The web component works by hiding its children with a spinning animation until one of them declares its readiness.

Practically speaking, the component injects a method called `onload` into each one of its children while hiding them setting
their display style to `none`. When the `onload` method of one of these children is invoked, the component resets the
original display style of the children and hides itself.

In most use cases, this component is used as a wrapper of <micro-lc></micro-lc> itself, which will call `onload` when its update 
lifecycle has ended upon connection and first render.

## Usage

The component can be sourced from 
[jsDelivr CDN](https://cdn.jsdelivr.net/npm/@micro-lc/layout@latest/dist/mlc-loading-animation.js).

To use the component in <micro-lc></micro-lc> wrap the `micro-lc` element tag in the HTML definition.

```html title=index.html
<!doctype html>
<html lang="en">
<head>
  <script async type="module" src="https://cdn.jsdelivr.net/npm/@micro-lc/orchestrator@latest/dist/micro-lc.production.js"></script>
  <script async type="module" src="https://cdn.jsdelivr.net/npm/@micro-lc/layout@latest/dist/mlc-loading-animation.js"></script>
</head>
<body>
  <mlc-loading-animation primary-color="#25b864">
    <micro-lc config-src="./config.json"></micro-lc>
  </mlc-loading-animation>
</body>
```

## Properties & attributes

|    Property    |    Attribute    |   Type   | Description                                                                                                   |
|:--------------:|:---------------:|:--------:|---------------------------------------------------------------------------------------------------------------|
| `primaryColor` | `primary-color` | `string` | Color of the animation. It can be Hex, 8-digit Hex, RGB, RGBA HSL, HSLA, HSV, HSVA, or CSS color name string. |
