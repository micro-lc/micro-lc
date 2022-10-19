---
title: Introduction
sidebar_label: Introduction
sidebar_position: 10
---

<micro-lc></micro-lc> is an open source micro-frontend orchestrator.

It brings together three different micro-frontend patterns inside the same application:
[iFrames](guides/applications/iframes), [parcels](guides/applications/parcels), and
[shadowed components](guides/applications/compose).

An `iFrame` refers to the practice of embedding external websites into our application/website. A `parcel` instead is a
fully-fledged (possibly single-page) application which lives within the context of the main application but is JS-sandboxed
and routed by a browser router (History API) or hash router. Finally, `shadowed components` refer to business logic
encapsulation via web components which allows to protect from style leaks and to scope events using HTML5 elements shadow 
DOM.

Orchestration happens at run-time, meaning that a JSON configuration is all <micro-lc></micro-lc> needs to add a new micro-frontend
application. Configurations can be hot-swapped or edited at run time, meaning a page refresh is enough to preview your
application after config changes.

<micro-lc></micro-lc> provides a smooth navigation/routing experience between different applications, SPAs, and iframes while wrapping
them in a static layout.

It ships as a:
- **CDN bundle** that can be embedded in your HTML pages or other scripts;
- **Docker container** that can be configured by mounting volumes;
- **Docker Compose configuration** to orchestrate other micro-services (e.g., BFFs, middleware, ecc.).

It aims to be as lightweight as possible and improve web security.

<micro-lc></micro-lc> is heavily inspired by and based on micro-frontend orchestration tools such as 
[single-spa](https://single-spa.js.org/) and [qiankun](https://qiankun.umijs.org/).

> **Marketing**
> 
> <micro-lc></micro-lc> is the open source solution for building flexible, multi-tenant frontend applications following the Micro 
> Frontend architecture.
>
> <micro-lc></micro-lc> consists of a core interface that loads, embeds, and orchestrates plugins (your individual frontend applications)
> at runtime, while providing configuration options and useful out-of-the-box features.
>
> The project is open source, and it can be found on GitHub. The core components are written in Typescript and React,
> but <micro-lc></micro-lc> is technology-agnostic: this means that it integrates seamlessly with your favorite toolkit, being it 
> Angular, React, Vue, or anything else you like - even Vanilla JavaScript!

By orchestrating micro-frontend applications, <micro-lc></micro-lc> achieves a fair amount of benefits:
* applications written in different frameworks can live together on the same page;
* applications can be deployed independently;
* applications can communicate through standard APIs leveraging also event-driven patterns.

Compared to other tools, <micro-lc></micro-lc> provides:
* live configuration and preview;
* centralized styling APIs;
* HTML-like composition tools (lit-html);
* import map integration (es-module-shims).

## Building blocks

<micro-lc></micro-lc> is a web-component meant to be embedded in your web page. Within its context (i.e., its real and shadow DOMs),
it splits the viewport in two parts: layout and content.

Layout does not depend on the current window history state (i.e., it does not refresh on URL changes), while content does.

Specifically, <micro-lc></micro-lc> embeds a SPA-like DOM router to respond to useragent-driven URL changes. The typical response is
mounting the content selected according to your configuration. Another scenario might be mounting error pages to signal
the user that something went wrong or a suitable application was not found for the given URL.

Since the layout is fully customizable, <micro-lc></micro-lc> is well suited to build any type of web application
like classical top-bar/sidebar multi-pages websites, CMSs, blogs, or even applications with no layout at all.

This dual nature of <micro-lc></micro-lc> content is reflected on its configuration since there is no overlap between layout and
content composition.

Still, means of communication are easily accessible by both layout and content while keeping them apart.

:::caution
Global state pattern is discouraged in favour of event-driven communication. Moreover, contexts can be shared between
applications and sub-applications by using either declarative tools or forcing state refresh by updating properties 
(React-like).
:::

## Fast track

> TODO...

## Comparison with other tools

> TODO...

---

* Cos'è micro-lc
  * web page con layout variabile con una parte fissa e una parte dinamica che dipende dall'url
  * la parte dinamica è un orchestratore di micro fe
  * [immagini che spiegano la differenza tra layout e application]
  * cosa sono i micro fe (perché sono meglio degli iframe)
  * esempi / use cases
  * spiegazione della soluzione
    * routing
    * dinamicità (run time e non build time)
    * estrema customizzabilità in ogni parte del layout
    * portabilità
    * composition --> tutte le feature semantiche dell'html senza l'html

* Fast track
  * understand micro-lc in 5 minutes by playing --> configurazione di micro-lc live

* Comparison with other tools
