---
id: composition
title: Composition
sidebar_label: Composition
---

While mounting your applications inside the `content` area of `micro-lc`,
it is useful to lay out, as a configuration, the kind of frame your entire
web application is wrapped around. The user will then perform essential functions on the browser:

- navigate the application
- anchor to external references

Many websites use top-bars or side-bars with anchors and links, but this sometimes might be
neither the case nor the best option. Check out `micro-lc` live configuration playground to review a different
type of layout.

`micro-lc` provides a simple configuration setting that is converted into a fully
functioning HTML fragment then embedded in your page, starting from a JSON or a Yaml (coming soon) file.

`micro-lc` web component is divided in separate DOMs to embed both `content` and `layout`
(this behaviour can be toggled off rendering in a single root):

- `shadow-dom` -> `layout`
- `dom` -> `content`

Strictly speaking, `micro-lc` provides us with a HTML root for both parts and then awaits for
HTML compliant elements to append

```html
<micro-lc>
  #shadow-root
    ↪️ <div>Layout</div>

  <div>Content</div>
</micro-lc>
```

Composition refers to the process of transforming a `string` or a serialization markup langugage content,
as JSON or Yaml, into a valid appendable DOM. In the case at hand we would love to dynamically instruct
`micro-lc` on the shape of our layout by writing a configuration file to be loaded at runtime.

We achieved this feature by leveraging the [lit-html library](https://lit.dev/docs/libraries/standalone-templates/) apis
combined with a lexer and a `non-eval` interpolation library.

Almost any HTML element can be seen, from the point of view of the DOM, as the combination of:

- a tag, i.e. `div`, `header`, `aside`, `img`, `micro-lc`...
- a list of attributes, i.e. `style="margin: 10px;"`, `class="my-css-class"`...
- a list of boolean attributes, i.e. `hidden`, `disabled`...
- a list of properties injected by JavaScript on the DOM counterpart of the given element
- a content inside of the tag, i.e. `0`, `Hello, World!`, `<p>My Paragraph</p>`...

`lit-html` provides an ES6 [tagged template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)
that evaluate attributes, boolean attributes and properties:

```javascript
import {html} from 'lit-html'

const customProperty = "my possibly dynamically evaluated string"
const template = html`
  <div style="margin: 10px;">
    <p>Some Text</p>
    <button disabled="" .customProperty=${customProperty}>Click Me!</button>
  </div>
`
```

Finally a `render` function attaches the template to a provided HTML element by interpreting
non-dotted keys (style, disabled, ...) as attributes and dotted keys as JavaScript properties.

Obviously in our case we do not know `customProperty` at compile time and we would like to inject
it at runtime, which opens the door of the "evil" `eval`, strongly discouraged on websites and
mitigated via [omission in `Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#unsafe_eval_expressions).

## Advanced --- how it works

`micro-lc` provides a lexer and an interpolation api to avoid `eval` and plug a [fully compliant](https://lit.dev/docs/templates/expressions/#well-formed-html)
template literal to the `lit-html` library. Together these tools make the `compositionApi`.

Consider the following JSON file

```json
{
  "content": {
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
          "customProperties": "my possibly dynamically evaluated string"
        },
        "content": "Click Me!"
      }
    ]
  }
}
```

`micro-lc` composition api performs the following steps

1. parse the JSON into a JavaScript object
2. (in development mode only) checks it against a provided schema
3. transform the JavaScript object into a template literal
4. parses values associated with properties
5. interpolates values with any previously provided context (similar to `handlebars` without `eval`)
6. passes the result to `lit-html` render

in `micro-lc` composition api, properties can be any combination of numbers, strings, arrays or JSON equivalent objects.

```json
{
  "content": {
    "tag": "div",
    "properties": {
      "myProp": {"a": 1},
      "$special": "$special.[0]"
    }
  }
}
```

```javascript
const obj = {
  content: {
    tag: 'div',
    properties: {
      myProp: {a: 1},
      $special: '$special.[0]'
    }
  }
}
```

```javascript
const literals = [
  '<div .myProp=',
  ' .$special=',
  '></div>'
]
const values = [{a: 1}, '$special.[0]']
```

```javascript
const context = {$special: [1, 'string']}
interpolate(values, context)
/**
 * returns
 * [{a: 1}, 1]
 */
```

`micro-lc` area devoted to these tasks could be the `layout` area. Such area does not have
a given shape and can be fully taylored. The same pattern will be also available to the `content`
area for a given `integration mode`
