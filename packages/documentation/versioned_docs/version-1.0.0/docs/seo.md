---
id: seo
title: SEO integration
sidebar_label: SEO integration
---

Starting with version 0.7.0, `micro-lc` supports the SEO integration thanks to [Prerender](https://prerender.io/).

You can self-host an instance of Prerender using the [Docker image](https://hub.docker.com/r/microlc/micro-lc-prerender) that we provide.

This image has its own [open source repository](https://github.com/micro-lc/micro-lc-prerender), 
where you can consult the [README.md](https://github.com/micro-lc/micro-lc-prerender/blob/main/README.md) to understand how to make it up and running.

### Configure `micro-lc` to use `micro-lc-prerender`

In `micro-lc` we already [configured for you NGINX](https://github.com/micro-lc/micro-lc/blob/main/packages/fe-container/nginx/conf.d/website.conf) 
to redirect the requests made from crawlers to the `Prerender` instance.

To enable this, you must set only the environment variable named `REPLACE_PRERENDER_HOST` in the `micro-lc` container.  
The content of this environment variable must be the host that expose Prerender.

E.g. if you have are running the containers locally, the value of `REPLACE_PRERENDER_HOST` must be the IP of your PC.
