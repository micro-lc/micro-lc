---
title: Composition
description: DOM composition from markup language content
sidebar_label: Composition
sidebar_position: 20
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
```

The key of <micro-lc></micro-lc> flexibility lies – among others – in the built-in capacity of **transforming** a string or
a serialization markup language content, as JSON or YAML, into a valid, appendable DOM. 

This behaviour enables the possibility to dynamically instruct <micro-lc></micro-lc> on the shape of a page by writing a
configuration file to be loaded at runtime, and can be applied both on [layout](../guides/layout.md) and content
when using [compose integration](../guides/applications/compose.md) strategy.

Let us take a look at a working example. The frame below shows a simple use case where the page is divided into layout
and content and both are constructed dynamically from a textual configuration.

```mdx-code-block
<></>
<example-frame
  base="../../frames/concepts/composition"
  height="550px"
  sourceTabs={[
    { filePath: "/index.html" },
    { filePath: "/config.yaml", isDefault: true }
  ]}
  src={"/"}
  title="Composition"
></example-frame>
```

## How it works

:::tip
The composition functionality is exposed though <micro-lc></micro-lc> [composer API](../../api/composer-api.md).
:::

At height level, this feature is achieved by leveraging
[lit-html library](https://lit.dev/docs/libraries/standalone-templates/) APIs combined with a 
[lexer](https://en.wikipedia.org/wiki/Lexical_analysis) and a _non-eval_ interpolation library.

:::info
One of the main feature of <micro-lc></micro-lc> composition is, actually, that it does not exploit any kind of unsafe
runtime evaluation (e.g., `eval` or `Function`) which are strongly discouraged on websites and mitigated via
[omission in `Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#unsafe_eval_expressions).
:::

Almost any HTML element can be seen, from the point of view of the DOM, as the combination of:
- a tag (e.g., `<div>`, `<header>`, `<aside>`, `<img>`, `<micro-lc>`),
- a list of attributes (e.g., `style="margin: 10px;"`, `class="my-css-class"`),
- a list of boolean attributes (e.g., `hidden`, `disabled`),
- a list of properties injected by JavaScript on the DOM counterpart of the given element,
- a content inside of the tag, (e.g., `0`, `Hello, World!`, `<p>My Paragraph</p>`).

```html title="HTML element"
<p ⬅ Tag
  id="my-awesome-paragraph" ⬅ Attribute
  disabled ⬅ Boolean attribute
>
  Hello, World! ⬅ Content
</p>

<script>
  const element = document.getElementById('my-awesome-paragraph')
  element.className = 'my-custom-dynamic-class' ⬅ Property
</script>
```

HTML elements can be full represented in JavaScript with the help of `lit-html` ES6 
[tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates),
that evaluate attributes, boolean attributes and properties. The example above would translate in:

```javascript title="Lit HTML element rappresentation"
import {html} from 'lit-html'

const customClassName = 'my-custom-dynamic-class'

const template = html`
  <p ⬅ Tag
    id="my-awesome-paragraph" ⬅ Attribute
    disabled="" ⬅ Boolean attribute
    .className=${customClassName} ⬅ Property
  >
    Hello, World! ⬅ Content
  </p>
`
```

Now that the desired HTML tree is described in JavaScript, a **render function** attaches the template to a provided 
container (i.e., another HTML element) by interpreting non-dotted keys (e.g, `id`, `disabled`) as attributes, and dotted
keys (e.g., `className`) as JavaScript properties.

:::tip
In <micro-lc></micro-lc> composition api, properties can be any combination of numbers, strings, arrays or JSON
equivalent objects.
:::

Before doing this, however, we need to address the fact that we do not know the value of `customClassName` at compile 
time, and we would like to inject it at runtime (without using `eval`, of course!). To solve this issue, 
<micro-lc></micro-lc> provides a **lexer** and an **interpolation API** to plug a
[fully compliant](https://lit.dev/docs/templates/expressions/#well-formed-html) template literal to the `lit-html`
library.

Together, these tools make the [composition API](../../api/composer-api.md), the flow of which is fully visualized in the
example below.

### The complete process

```mdx-code-block 
<Tabs>
<TabItem value="0" label="Starting point" default>
```
Let us consider the following JSON file describing what we would like out DOM to be.

```json title="JSON DOM description"
{
  "tag": "div",
  "attributes": {
    "style": "margin: 10px;"
  },
  "content": [
    {
      "tag": "p",
      "content": "Some Text"
    },
    {
      "tag": "button",
      "booleanAttributes": ["disabled"],
      "properties": {
        "myProp": { "foo": "bar" },
        "special": "special.[0]"
      },
      "content": "Click Me!"
    }
  ]
}
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="First step">
```
The first step consists in parsing the JSON file into JavaScript object (and – _if in development mode_ – checking it
against a provided [JSON schema](https://json-schema.org/)).

```javascript title="JavaScript parsed object"
const obj = {
  tag: 'div',
  attributes: {
    style: 'margin: 10px;'
  },
  content: [
    {
      tag: 'p',
      content: 'Some Text',
    },
    {
      tag: 'button',
      booleanAttributes: ['disabled'],
      properties: {
        myProp: { foo: 'bar' },
        special: 'special.[0]'
      },
      content: 'Click Me!'
    },
  ],
}
```
```mdx-code-block
</TabItem>
<TabItem value="2" label="Second step">
```
The second step consists in transforming the JavaScript object into a template literal.

```javascript title="Template literal"
const literals = [
  '<div style="margin: 10px;"><p>Some Text</p><button disabled .myProp=',
  ' .special=',
  '>Click Me!</button></div>'
]

const values = ["{\"foo\":\"bar\"}", 'special.[0]']
```
```mdx-code-block
</TabItem>
<TabItem value="3" label="Third step">
```
The third step consists in parsing values associated with properties.

```javascript title="Template literal with parsed values"
const literals = [
  '<div style="margin: 10px;"><p>Some Text</p><button disabled .myProp=',
  ' .special=',
  '>Click Me!</button></div>'
]

const values = [{ foo: 'bar' }, 'special.[0]']
```
```mdx-code-block
</TabItem>
<TabItem value="4" label="Fourth step">
```
The fourth step consists in interpolating values with any previously provided context (similar to 
[handlebars](https://handlebarsjs.com/), without the usage of `eval`).

```javascript title="Interpolated context"
const context = { special: [1, 'string'] }
interpolate(values, context)

// Output: [{ foo: 'bar' }, 1]
```
```mdx-code-block
</TabItem>
<TabItem value="5" label="Final result">
```
Finally, the result is passed to `lit-html` render.

```html title="Final HTML result"
<div style="margin: 10px;">
  <p>Some Text</p>
  <button disabled>
    Click Me!
  </button>
</div>

<script>
  const buttonElement = document.querySelector('button')
  
  console.log(buttonElement.myProp, button.special)
  // Output: { foo: 'bar' }, 1
</script>
```
```mdx-code-block
</TabItem>
</Tabs>
```
