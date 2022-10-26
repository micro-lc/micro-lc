---
id: core_plugins
title: Core plugins
sidebar_label: Core plugins
---

To extend the potential of `micro-lc`, Mia-Platform created some [configurable](core_configuration.md#props) plugins called `core plugins`.

These plugins are open source and can be deployed using the console with low effort.

## microlc-element-composer

This plugin is [publicly available on GitHub](https://github.com/micro-lc/microlc-element-composer) and 
can be used to compose the UI of your page, with the precondition that each piece has been made as [`custom-elements`](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements).

The layout can be composed using rows and columns: it will be adaptive thanks to the `flex` layout.

:::caution
In addition to the [properties that you can configure](core_plugins.md#config) for each `custom-element`, 
the plugin **always** injects the 3 following properties:
- `eventBus`: an [RxJS's Subject](https://rxjs.dev/guide/subject) used as communication channel between components;

- `currentUser`: an object which may represent the session currently authenticated user;

- `headers`: an object made of standard/custom HTTP headers, which may propagate cookies and other helpful settings to manage frontend HTTP calls.
:::

#### type
- _type_: string;
- _enum_: `row`, `column`, `element`;
- _required_: `true`;
- _description_: type of object to render.

#### tag
  **This property is mandatory only for `element` type**.
- _type_: string;
- _required_: `false`;
- _description_: tag of the custom element to render.  

#### url
  **This property is considered only for `element` type**.
- _type_: string;
- _required_: `false`;
- _description_: URL of  the entry point used to register and boot the custom element.  

#### attributes
- _type_: object;
- _required_: `false`;
- _description_: attributes injection for the DOM element.

#### properties
- _type_: object;
- _required_: `false`;
- _description_: properties injection for the DOM element.

#### busDiscriminator
  **This property is considered only for `element` type**.
- _type_: string;
- _required_: `false`;
- _description_: Event bus discriminator, used to create a dedicated communication channel.  
  By default, is injected the general communication channel.  

#### content
- _type_: object;
- _required_: `false`;
- _description_: the definition of the children components. This field makes this structure recursive.

### Structure example
```json
{
  "type": "row",
  "content": [{
    "type": "column",
    "attributes": {
      "style": "width: 89%",
    },
    "content": [{
      "type": "element",
      "tag": "button",
      "url": "https://your-host.com/your/component/entry.js",
      "properties": {
        "property-a": "value-a"
      }
    }]
  }]
}
```
