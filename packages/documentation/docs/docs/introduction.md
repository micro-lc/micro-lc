---
title: Introduction
sidebar_label: Introduction
sidebar_position: 10
---

🎼 <micro-lc></micro-lc> is an open source **micro-frontend orchestrator**.

🧱 <micro-lc></micro-lc> offers a solution for building **flexible**, **multi-tenant** frontend applications.

⚡ <micro-lc></micro-lc> aims to be as **lightweight** as possible and to improve **web security**. 

🖼 <micro-lc></micro-lc> brings together **different micro-frontend patterns** inside the same application.

🏃 <micro-lc></micro-lc> consists of a core interface that loads, embeds, and orchestrates individual frontend applications
at **runtime**, while providing **configuration options** and useful **out-of-the-box features**.

## Rationale

In a world of frontend monoliths, [micro-frontend](https://micro-frontends.org/) pattern brings to the frontend world
the benefits [microservice architecture](https://en.wikipedia.org/wiki/Microservices) brought to backend development.
We are talking about scalability, technological agnosticism, faster development and delivery time, maintainability,
governance complexity reduction, just to name a few.

One of the greatest challenges when taking this architectural approach is making sure that all the independent 
micro-frontend application behave in a cohesive way, both in terms of user interface (e.g., styling, theming, branding)
and user experience (e.g., state sharing, routing, error handling).

<micro-lc></micro-lc> has been designed to help overcome this challenge, offering the stability and unity of a centralized
orchestrator, while maintain the flexibility needed to mold the application to each, unique, use case.

## Features

<micro-lc></micro-lc> supports three different micro-frontend patterns at the same time:
[iframes](guides/applications/iframes), [parcels](guides/applications/parcels), and
[shadowed components](guides/applications/compose).

An `iframe` refers to the practice of embedding external websites into our application/website. A `parcel` instead is a
fully-fledged (possibly single-page) application which lives within the context of the main application but is JS-sandboxed
and routed by a browser router (History API) or hash router. Finally, `shadowed components` refer to business logic
encapsulation via web components which allows to protect from style leaks and to scope events using HTML5 elements shadow 
DOM.

Orchestration happens at run-time, meaning that a JSON (or YAML) configuration is all <micro-lc></micro-lc> needs to add
a new micro-frontend application. Configurations can be hot-swapped or edited at run time, meaning a page refresh is
enough to preview your application after config changes.

<micro-lc></micro-lc> provides a smooth navigation/routing experience between different applications, SPAs, and iframes 
while wrapping them in a static layout.

It ships as a *CDN bundle* that can be embedded into HTML pages or other scripts, and as a *Docker container* that can be
configured by mounting volumes (see [getting started page](./getting-started.md) for more information).

<micro-lc></micro-lc> is heavily inspired by and based on micro-frontend orchestration tools such as 
[single-spa](https://single-spa.js.org/) and [qiankun](https://qiankun.umijs.org/).

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
it splits the viewport in two parts: **layout** and **content**. Layout does not depend on the current window history state
(i.e., it does not refresh on URL changes), while content does.

Specifically, <micro-lc></micro-lc> embeds a SPA-like DOM router to respond to useragent-driven URL changes. The typical
response is mounting the content selected according to your configuration. Another scenario might be mounting error pages
to signal the user that something went wrong or a suitable application was not found for the given URL.

Since the layout is fully customizable, <micro-lc></micro-lc> is well suited to build any type of web application
like classical top-bar/sidebar multi-pages websites, CMSs, blogs, or even applications with no layout at all.

This dual nature of <micro-lc></micro-lc> content is reflected on its configuration since there is no overlap between 
layout and content composition.

Still, [means of communication](./concepts/communication.md) are easily accessible by both layout and content while
keeping them apart.
