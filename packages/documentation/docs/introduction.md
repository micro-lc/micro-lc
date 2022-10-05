---
title: Introduction
sidebar_label: Introduction
slug: /
---

micro-lc is an open source micro-frontend orchestrator. 

Orchestration happens at run-time, meaning a JSON configuration is all micro-lc needs to add a new micro-frontend to the
application.

It provides a smooth navigation/routing experience between different applications, SPAs, and iFrames while wrapping
them in a static layout.

It ships as a CDN bundle that can be embedded in your HTML pages or other scripts.

It aims to be as lightweight as possible and improve web security.

micro-lc is heavily inspired by and based on micro-frontend orchestration tools such as SPA and Qiankun.

Configuration can be hot-swapped or edited at run time, meaning a page refresh is enough to preview your application after
config changes.

> **Marketing**
> 
> micro-lc is the open source solution for building flexible, multi-tenant frontend applications following the Micro Frontend architecture.
>
> micro-lc consists of a core interface that loads, embeds, and orchestrates plugins (your individual frontend applications) at runtime,
> while providing configuration options and useful out-of-the-box features.
>
> The project is open source, and it can be found on GitHub. The core components are written in Typescript and React, but micro-lc
> is technology-agnostic: this means that it integrates seamlessly with your favorite toolkit, being it Angular, React, Vue, or anything
> else you like - even Vanilla JavaScript!
> 
> Take a look at the introduction about micro frontend and how micro-lc works:

By orchestrating micro-frontend applications, micro-lc achieves a fair amount of benefits:
* applications written in different frameworks can live together on the same page;
* applications can be deployed independently;
* applications can communicate through standard APIs leveraging also event-driven patterns.

Compared to other tools, micro-lc provides:
* live configuration and preview;
* centralized styling APIs;
* HTML-like composition tools (lit-html);
* import map integration (es-module-shims).

## Building blocks

micro-lc is a web-component meant to be embedded in your web page. Within its context, it splits the viewport in two parts:
layout and content.

Layout does not depend on the current window history state (i.e., it does not refresh on URL changes), while content does.

Specifically, micro-lc embeds a SPA-like DOM router to respond to useragent-driven URL changes mounting the content selected
according to your configuration.

Due to the fact that the layout is fully customizable, micro-lc is well suited to build any type of web application
like classical top-bar/side-bar multi-pages websites, CMSs, blogs, or even applications with no layout at all.

This dual nature of micro-lc content is reflected on its configuration since there is no overlap between layout and
content composition.

Still, means of communication are easily accessible by both layout and content while keeping them apart.

:::
Global state pattern is discouraged in favour of event-driven communication. Moreover, contexts can be shared between
applications and sub-applications by using either declarative tools or forcing state refresh by updating properties (React-like).
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
