---
title: Separation of concerns
sidebar_label: Separation of concerns
sidebar_position: 10
---

<micro-lc></micro-lc> is a web-component meant to be embedded in any web page. Within its context, it splits the viewport
in two parts, **layout** and **content**, which are technically independent of one another, but can
[communicate](./communication) to fill the functional need of cohesion.

> Example showing separation

The main difference between this two parts is that layout is **static**, independent of the current window history state
(i.e., it does not refresh on URL changes), while content is **dynamic**, updating in response to useragent-driven URL
changes.

This dual nature of <micro-lc></micro-lc> is well-reflected on its [configuration](../../api/configuration-schema),
since there is no overlap between layout and content composition.

## DOM management

Being <micro-lc></micro-lc> a web component, it has access to the
[Shadow DOM API](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM), which
[can be used](#disabling-shadow-dom) to encapsulate the layout.

This behaviour enables a complete separation between content and layout **business logic**. Separation which gains importance
considering the static and unmoving nature of layout with respect to the dynamism of content: layout should behave the
same way regardless of the current state of content and should not leak any internal logic besides the ones elected as
touch points.

Moreover, Shadow DOM brings a complete **style segregation** and the possibility to use **slots** in the layout, which
greatly enhance its flexibility and re-usability.

Technically speaking, <micro-lc></micro-lc> puts layout in Shadow DOM and content in the regular DOM, constructing a
tree like:

```html title="micro-lc tree with Shadow DOM"
<micro-lc>
  #shadow-root
    ↪️ <div>Layout</div>

  <div>Content</div>
</micro-lc>
```

### Disabling Shadow DOM

:::danger
We **do not recommend** disabling <micro-lc></micro-lc> Shadow DOM, since it can cause style and business logic
leaking.
:::

Even if it brings all the benefits detailed in the previous section, there may be some use cases for which <micro-lc></micro-lc>
Shadow DOM is not suitable and should be turned off.

We may be talking about technical issues – like the need to use in layout components with listeners attached to `window`
firing [not `composed` events](https://pm.dartus.fr/blog/a-complete-guide-on-shadow-dom-and-event-propagation/) –,
theming needs – like global CSS styles that has to be accessible by both layout and content –, or other specific 

<micro-lc></micro-lc> offers the possibility to disable Shadow DOM, rendering content and layout in a single root, with 
`disableShadowDom` property (or mirrored boolean attribute `disable-shadow-dom`), which will resolve in a tree like:

```html title="micro-lc tree without Shadow DOM"
<micro-lc disable-shadow-dom>
  <div>Layout</div>
  <div>Content</div>
</micro-lc>
```

- componenti che hanno dei listener appesi alla window e lanciano eventi che non sono "composed"
- poter controllare tutto in una singola configurazione, tutto l'html in un singolo posto
  (non serve il layout, puoi controllare tutto dal mount point)
- l'app ha molto css globale che non riesci ad iniettarlo nel content e vuoi metterlo come link in testa

---

While mounting your applications inside the `content` area of <micro-lc></micro-lc>, it is useful to lay out, as a configuration,
the kind of frame your entire web application is wrapped around. The user will then perform essential functions on the
browser:
- navigate the application
- anchor to external references

Many websites use top-bars or sidebars with anchors and links, but this sometimes might be neither the case nor the
best option. Check out <micro-lc></micro-lc> live configuration playground to review a different type of layout.

<micro-lc></micro-lc> provides a simple configuration setting that is converted into a fully functioning HTML fragment then embedded
in your page, starting from a JSON or a Yaml (coming soon) file.

---
