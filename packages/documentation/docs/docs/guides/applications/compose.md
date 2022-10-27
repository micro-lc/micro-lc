---
title: Compose
description: Composition of HTML tags
sidebar_label: Compose
sidebar_position: 20
---

:::caution
This section is work in progress.
:::

A [composable](../../concepts/composition) application is a pseudo-HTML document enhanced with JavaScript properties
dynamically injected by the [composer application](../../../api/composer-api). 

The resulting DOM tree is constructed on the basis of a specific configuration, which can be directly provided, or sourced
from an external JSON or YAML file.

## Usage

Declare an application with integration mode `compose` in <micro-lc></micro-lc> configuration:

```typescript
interface ComposableApplication {
  integrationMode: "compose"
  config: PluginConfiguration | string // See explanation below
  route: string // Path on which the composable application will be rendered
  version?: 1 | 2 // ???
}
```

The application configuration has to be supplied with the `config` key, which may directly be or a full
[configuration object](#plugin-configuration) or a URL string from which a configuration with the same structure can
be downloaded.

> Example frame with two different applications (one with string and one with configuration)

## Plugin configuration

The configuration of a composable application is the blueprint used by <micro-lc></micro-lc> composer (being it the
default one or a [custom implementation](../../../api/micro-lc#composeruri)) to dynamically construct the page at
runtime.

```typescript
interface PluginConfiguration {
  $schema: string
  sources?:
    | string
    | string[]
    | {
        uris: string | string[]
        importmap?: ImportMap
      }
  content: Content
}
```

:::tip
Key `$schema` can be used to reference <micro-lc></micro-lc> plugin configuration
[JSON schema](https://cdn.jsdelivr.net/npm/@micro-lc/interfaces@latest/schemas/v2/plugin.schema.json) to greatly ease
the writing process by constantly validating the JSON or YAML content against it.
:::

The actual page structure is provided in `content` key, and building blocks are HTML5 elements or custom web components.
In the letter case, sources have to be provided for custom components, and one can do so with the `sources` key.

By polymorphism, `sources` can be a string or an array of strings if just JavaScript asset entries have to be provided.
If an [importmap](../reuse-third-party-libraries) is needed, `sources` can become an object housing JavaScript asset
entry URIs (key `uris`) and importmap definition (key `importmap`).

```yaml title="micro-lc.conf.yaml"
applications:

  # Single JavaScript asset entry URI
  app-1:
    sources: https://my-static-server/my-web-component.js
    content: ...

  # Multiple JavaScript asset entry URIs
  app-2:
    sources: 
      - https://my-static-server/my-web-component-1.js
      - https://my-static-server/my-web-component-2.js
    content: ...

  # Importmap
  app-3:
    sources:
      uris: https://my-static-server/my-web-component.js
      importmap:
        imports: ...
        scopes: ...
    content: ...
```

## Content definition

A composable application content is a representation of a pseudo-DOM tree written in a markup language (namely JSON
or YAML) that undergoes a [series of processes](../../concepts/composition) to be transformed into a valid, appendable
DOM.

```typescript
type Content = string | number | Component | (Component | number | string)[]
```

A valid content can assume different shapes, as long as it is a valid HTML element or a convertible representation of
one. It may be:

* a primitive (`string` or `number`)
  ```yaml
  content: "A string is a valid HTML element!"
  ```
* a [stringified DOM tree](#stringified-dom-tree)
  ```yaml
  content: |
    <div .classname=${"my-class"} .microlcApi=${microlcApi} .eventBus=${{ "mainDataBus": "eventBus.pool.mainDataBus" }}>
      <p style="color: red;">
        This is written as a single string
      </p>
    </div>
  ```
* a single [component representation](#component-representation)
  ```yaml
  content:
    tag: div
    attributes:
      style: "color: red;"
    properties:
      classname: "dynamic-class"
      microlcApi: microlcApi
      eventBus:
        mainDataBus: eventBus.pool.mainDataBus
    content: This structure is transformed into a valid HTML element
  ```
* a list of the above
  ```yaml
  content:
    - "String element"
    - 12
    - tag: div
  ```

### Stringified DOM tree

:::tip
This way of writing content is particularly powerful when used in YAML files, since it can benefit from
[YAML block scalars](https://yaml-multiline.info/) to greatly enhance readability.
:::

Instead of recurring to the ["objective" representation](#component-representation) of components, DOM nodes can also
be expressed in a single string using an HTML-like syntax in which properties are represented with a **dotted
notation** (i.e., `.property_name=property_value).

```yaml
content: |
  <div
    style="color: red;"
    .
  >
    Hello World!
  </div>
```

## Component representation

A component corresponds to an HTML node, being it an HTML5 element or a custom web component. Practically speaking,
a component is an object with the following structure:

```typescript
interface Component {
  /** HTML node tag name */
  tag: string
  
  /** HTML5 attribute applied using setAttribute API */
  attributes?: Record<string, string>
  
  /** HTML5 boolean attribute applied using setAttribute API */
  booleanAttributes?: string | string[]
  
  /** DOM element property applied as object property after creating an element */
  properties?: Record<string, unknown>

  /** Node children */
  content?: Content
}
```

The type is recursive as `content` is a [content definition](#content-definition) which may itself take the form of a
`Component`.

```yaml
tag: button
attributes:
  style: "color: red;"
booleanAttributes: disabled
content: Click me!

# Output: <button disabled style="color: red;">Click me!</button>

---

tag: my-custom-component
attributes:
  class: my-class
  my-numeric-attribute: 2
properties:
  myCustomProperty: some-value
content:
  tag: span
  content: Hello World!

# Output: 👇
#   <my-custom-component class="my-class" my-numeric-attribute="2">
#     <span>Hello World!</span>
#   </my-custom-component>
#
#   document.querySelector("my-custom-component").myCustomProperty 👉 "some-value"
```

## Interpolated properties

<micro-lc></micro-lc> composer injects a series of properties into each DOM node it creates. 

These properties are automatically available in web components, you just need to declare them and access them through
the component context (i.e., `this`). For example:

```typescript title="my-awesome-web-component.ts"
import type { MicrolcApi } from '@micro-lc/orchestrator'

class MyAwesomeWebComponent extends HTMLElement {
  // highlight-next-line
  microlcApi?: MicrolcApi

  connectedCallback () {
    // highlight-next-line
    this.microlcApi?.goTo('/')
  }
}

customElements.define('my-awesome-web-component', MyAwesomeWebComponent)
```

```typescript
{
  this.eventBus.banana
}
```

Even if this behavior is automatic, it can be customized varying the way properties are defined in
[component representations](#component-representation).

#### `microlcApi`

#### `composerApi`

Composer mette a disposizione una serie di prop interpolate:
- microlcApi
- composerApi
- eventBus
- currentUser --> observable preso dal canale pub/sub della API --> deprecated!
- shared props spread --> deprecated, verranno inserite in base dell'API

### Usage

Queste possono essere dichiarate in configurationze dei vai componenti (devono esserlo nel caso di htmlx)

```yaml
content:
  - tag: my-custom-component --> trovi microlcApi
  
  - tag: my-custom-component --> trovi microlcApi
    properties:

  - tag: my-custom-component --> trovi microlcApi
    properties:
      microlcApi: microlcApi

  - tag: my-custom-component --> trovi microlc e microlcApi
    properties:
      microlc: microlcApi 

  - tag: my-custom-component --> trovi microlcApi con valore pippo
    properties:
      microlcApi: pippo
```

- Se non le metti, ti vengono comunque iniettate
- Se le metti a loro stesse, ti vengono comunque iniettate

### Event bus

E' un replay subject

Non ce l'ha il layout

```yaml
  - tag: my-custom-component --> trovi eventBus di default
  
  - tag: my-custom-component --> trovi eventBus di default
    properties:

  - tag: my-custom-component --> trovi eventBus di default
    properties:
      eventBus: eventBus

  - tag: my-custom-component --> trovi un altro eventBus
    properties:
      eventBus: eventBus.[0]

  - tag: my-custom-component --> trovi un altro eventBus
    properties:
      eventBus: eventBus.pool.foo
```
