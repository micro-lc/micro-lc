---
title: Compose
description: Composition of HTML tags
sidebar_label: Compose
sidebar_position: 20
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
```

A [composable](../../concepts/composition.md) application is a pseudo-HTML document enhanced with JavaScript properties
dynamically injected by the [composer application](../../../api/composer-api.md). 

The resulting DOM tree is constructed on the basis of a specific configuration, which can be directly provided, or sourced
from an external JSON or YAML file.

## Usage

Declare an application with integration mode `compose` in <micro-lc></micro-lc> configuration:

```typescript
interface ComposableApplication {
  integrationMode: "compose"
  config: PluginConfiguration | string // See explanation below
  route: string // Path on which the composable application will be rendered
}
```

The application configuration has to be supplied with the `config` key, which may be either a full
[configuration object](#plugin-configuration) or a URL string from which a configuration with the same structure can
be downloaded.

## Plugin configuration

The configuration of a composable application is the blueprint used by <micro-lc></micro-lc> composer (being it the
default one or a [custom implementation](../../../api/micro-lc-web-component.md#composeruri)) to dynamically construct
the page at runtime.

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
If an [importmap](../reuse-third-party-libraries.md) is needed, `sources` can become an object housing JavaScript asset
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
or YAML) that undergoes a [series of processes](../../concepts/composition.md) to be transformed into a valid, appendable
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
* a stringified DOM tree#stringified-dom-tree, particularly powerful when used in YAML files, since it can benefit
from [YAML block scalars](https://yaml-multiline.info/) to greatly enhance readability
  ```yaml
  content: |
    <div .classname=${"my-class"} .microlcApi=${microlcApi}>
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
      classname: my-class
    content: This structure is transformed into a valid HTML element
  ```
* a list of the above
  ```yaml
  content:
    - "String element"
    - 12
    - tag: div
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
content:
  tag: button
  attributes:
    style: "color: red;"
  booleanAttributes: disabled
  content: Click me!

# Output: <button disabled style="color: red;">Click me!</button>

---

content:
  tag: my-component
  attributes:
    class: my-class
    my-numeric-attribute: 2
  properties:
    myCustomProperty: some-value
  content:
    tag: span
    content: Hello World!

# Output: 👇
#   <my-component class="my-class" my-numeric-attribute="2">
#     <span>Hello World!</span>
#   </my-component>
#
#   document.querySelector("my-component").myCustomProperty 👉 "some-value"
```

## Properties injection

When composing a content, the constructed nodes can receive two types of properties: 
- user-supplied properties **explicitly declared** in configuration, and
- a set of **special properties** interpolated and injected directly by <micro-lc></micro-lc> composer.

### User-supplied properties

User-supplied properties can be declared using the `properties` property of
[component interface](#component-representation), or through a special _dotted notation_ 
(`.property_name=${property_value}`) if relying on the stringified DOM tree representation. Either case, any 
**valid JSON value** is acceptable as property and injected into components context as is.

```mdx-code-block 
<Tabs>
<TabItem value="0" label="Objective representation" default>
```
```yaml
content:
  tag: my-component
  properties:
    stringProp: foo
    numberProp: 3
    arrayProp:
      - foo
      - bar
    objectProp:
      foo: bar

# myComponent.stringProp 👉 Output: "foo"
# myComponent.numberProp 👉 Output: 3
# myComponent.arrayProp  👉 Output: ["foo", "bar"]
# myComponent.objectProp 👉 Output: {foo: "bar"}
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="Stringified representation">
```
```yaml
layout:
  content: |
    <div
      .stringProp=${"foo"}
      .numberProp=${4}
      .arrayProp=${["foo", "bar"]}
      .objectProp=${{"foo": "bar"}}
    ></div>

# myComponent.stringProp 👉 Output: "foo"
# myComponent.numberProp 👉 Output: 3
# myComponent.arrayProp  👉 Output: ["foo", "bar"]
# myComponent.objectProp 👉 Output: {foo: "bar"}
```
```mdx-code-block
</TabItem>
</Tabs>
```

### Interpolated properties

<micro-lc></micro-lc> injects a series of special properties into each DOM node it creates. These properties are
automatically interpolated, and therefore they need to be marked by **reserved keywords** for <micro-lc></micro-lc> to
recognize them and assign them the correct value (always in a secure manner without `eval` or similar structures).

When using _object component representation_, interpolated properties **do not need to be explicitly declared**. However,
if they are, the key used must match the reserved one, and the value must be equal to the key. On the other hand, when
using _stringified DOM tree representation_, properties you want to be injected need to be **explicitly declared** with
the correct key and value.

For example, let's consider the special property `microlcApi` and different scenarios.

```mdx-code-block 
<Tabs>
<TabItem value="0" label="Objective representation" default>
```
```yaml
content:
  tag: my-component

# myComponent.microlcApi is defined and correctly set

---

content:
  tag: my-component
  properties:
    stringProp: foo

# myComponent.microlcApi is defined and correctly set

---

content:
  tag: my-component
  properties:
    microlcApi: microlcApi
    
# myComponent.microlcApi is defined and correctly set

---

content:
  tag: my-component
  properties:
    microlcApi: foo

# myComponent.microlcApi is undefined
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="Stringified representation">
```
```yaml
layout:
  content: |
    <my-component></my-component>

# myComponent.microlcApi is undefined

---

layout:
  content: |
    <my-component .microlcApi=${microlcApi}></my-component>

# myComponent.microlcApi is defined and correctly set

---

layout:
  content: |
    <my-component .microlcApi=${foo}></my-component>

# myComponent.microlcApi is undefined
```
```mdx-code-block
</TabItem>
</Tabs>
```

The special properties injected by <micro-lc></micro-lc> are the following.

#### `microlcApi`

```mdx-code-block
<div style={{paddingLeft: '1em'}}>
```
* Type: `Object`

Common [API](../../../api/micro-lc-api) offered by <micro-lc></micro-lc> as 
[mean of communication](../../concepts/communication.md#micro-lc-api).
```mdx-code-block
</div>
```

#### `composerApi`

```mdx-code-block
<div style={{paddingLeft: '1em'}}>
```
* Type: `Object`

Common [API](../../../api/composer-api.md) offered by <micro-lc></micro-lc> composer to achieve 
[composition](../../concepts/composition.md).
```mdx-code-block
</div>
```

#### `eventBus`

```mdx-code-block
<div style={{paddingLeft: '1em'}}>
```
:::caution
Composed [layouts](../layout.md#build-a-layout) and [mount points](../layout.md#mount-point) **do not have access** to
this property.
:::

* Type
  ```typescript
  interface EventBus<T = unknown> extends rxjs.ReplaySubject<T> {
    [index: number]: rxjs.ReplaySubject<T>
    pool: Record<string, rxjs.ReplaySubject<T>>
  }
  ```

[RxJS ReplaySubject](https://rxjs.dev/api/index/class/ReplaySubject) useful to establish a reactive communication
between components of the same application.

The property gives component the ability to spawn multiple ReplaySubjects, allowing multichannel communication.
`eventBus` itself is a ReplaySubject, but calling `eventBus[0]` or `eventBus.pool.foo` will create two other – 
completely different – ReplaySubject entities.

```yaml title=micro-lc.config.yaml
content:
  tag: my-component
  
# myComponent.eventBus !== myComponent.eventBus[0] !== myComponent.eventBus.pool.foo
```
```mdx-code-block
</div>
```

#### `currentUser`

```mdx-code-block
<div style={{paddingLeft: '1em'}}>
```
:::danger Deprecation notice
This property will be removed in future versions. Use <micro-lc></micro-lc> API 
[subscribe method](../../../api/micro-lc-api/reactive-communication.md#subscribe) instead.
:::

* Type: `rxjs.Observable`

[RxJS Observable](https://rxjs.dev/guide/observable) taken from <micro-lc></micro-lc> API
[Pub/Sub channel](../../../api/micro-lc-api/reactive-communication.md#subscribe) containing information on the current
application user.
```mdx-code-block
</div>
```

#### Shared properties

```mdx-code-block
<div style={{paddingLeft: '1em'}}>
```
Content of `properties` key of configuration key [`shared`](../../../api/micro-lc-web-component.md#shared). `properties`
key is spread and each of its property is injected independently.

Example:

```mdx-code-block 
<Tabs>
<TabItem value="0" label="Objective representation" default>
```
```yaml
shared:
  properties:
    foo: bar

layout:
  content:
    tag: my-component

# myComponent.foo 👉 Output: "bar"
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="Stringified representation">
```
```yaml
shared:
  properties:
    foo: bar

layout:
  content: |
    <div id="my-div" .foo=${foo}></div>

# myComponent.foo 👉 Output: "bar"
```
```mdx-code-block
</TabItem>
</Tabs>
```
```mdx-code-block
</div>
```
