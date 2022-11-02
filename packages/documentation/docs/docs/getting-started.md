---
title: Getting started
description: Start using micro-lc
sidebar_label: Getting started
sidebar_position: 20
---

<micro-lc></micro-lc> is shipped as an ES module [CDN bundle](#import-from-cdn) and can be imported in any HTML page.
Moreover, a [dockerized webserver](#deploy-docker-container) is available on Docker Hub.

## Import from CDN

Create a blank `index.html` file and paste the following snippet:

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
<head>
  <title>micro-lc</title>
  <link rel="icon" href="https://avatars.githubusercontent.com/u/92730708?s=200&v=4" />

  <!-- 👇 CDN link to download micro-lc -->
  <script async type="module" src="https://cdn.jsdelivr.net/npm/@micro-lc/orchestrator@latest/dist/micro-lc.production.js"></script>
</head>
<body>
  <!-- 👇 micro-lc tag with config reference -->
  <micro-lc config-src="./config.yaml"></micro-lc>
</body>
</html>
```

Let's start with adjusting the page style. We recommend you add some style in the `head` of the Document:

```css
html, body {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
}
```

:::tip
To enhance the security of your websites you can add [CSP rules](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
either on your web server response header (e.g. [nginx](https://content-security-policy.com/examples/nginx/)), or as a
`meta` tag on the `head` of your Document:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
    default-src 'self' https: http:;
    script-src 'self' 'unsafe-eval' blob: data: https://cdn.jsdelivr.net/npm/;
  "
/>
```
:::

<micro-lc></micro-lc> works even without a configuration file, however a 404 error page is all you will see. It's time
to write our first configuration file. You can choose either JSON or YAML (we suggest YAML for development, and JSON for
production). A YAML to JSON converter is available in the <a href="../../playground" target="_blank">Playground section</a>.

```yaml title="config.yaml"
# 👇 Configuration writing process gets easier if your file is validated against the schema below
$schema: https://cdn.jsdelivr.net/npm/@micro-lc/interfaces@latest/schemas/v2/config.schema.json

# 👇 Version of micro-lc
version: 2

# 👇 Lets start with a simple iFrame application
applications:
  home:
    integrationMode: iframe
    src: https://wikipedia.org
    route: ./
```

You can now serve the application with your static server of choice, like 
[Python http.server](https://docs.python.org/3/library/http.server.html) by running:

```shell
python -m http.server 8000
```

Read the documentation to know more about what <micro-lc></micro-lc> can do, and use the live <a href="../../playground" target="_blank">Playground section</a> 
to test your configurations.

## Deploy Docker container

<micro-lc></micro-lc> static assets are also embedded in a pre-built Docker container available on 
[Docker Hub](https://hub.docker.com/r/microlc/micro-lc). The container is a nginx web server that comes with some useful
set-up.

To deploy it locally, ensure your localhost _8080_ port is available, and run

```shell
docker run -d -p 8080:8080 microlc/micro-lc:latest
```

This container has the following runtime environment variables.

|     Name     |                    Type                    |     Default     | Description                                                                                             |
|:------------:|:------------------------------------------:|:---------------:|---------------------------------------------------------------------------------------------------------|
| `BASE_PATH`  |            <code>string</code>             |       `/`       | `index.html` [base tag href](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base#attr-href). |
|    `MODE`    | <code>development &#124; production</code> |  `production`   | <micro-lc></micro-lc> bundle.                                                                           |
| `CONFIG_SRC` |            <code>string</code>             | `./config.json` | URL to <micro-lc></micro-lc> config.                                                                    |

`BASE_PATH` is useful if your <micro-lc></micro-lc> app must be served on a sub path. Be aware that any `route` declared
in the configuration file under `applications`, when relative, are computed with respect to `BASE_PATH`.

### Web Server

The <micro-lc></micro-lc> container is effectively an [nginx](https://www.nginx.com/) web server, currently on version 
`1.23.2`. It is preset to rewrite any route according to your `BASE_PATH` choice. Moreover, it does per-call 
[sub filtering](http://nginx.org/en/docs/http/ngx_http_sub_module.html#sub_filter) of special variables. This feature is
useful to
* inject runtime variables to <micro-lc></micro-lc> web component, and 
* inject a [CSP nonce](https://content-security-policy.com/nonce/) on scripts and style tags.

Which basically sums up to the following configuration:

```nginx
http {
  server {
    # ...
    location ~ (^/|^${BASE_PATH}) {
      set_secure_random_alphanum      $cspNonce 32;

      rewrite                         ^${BASE_PATH}$ /index.html break;
      rewrite                         ^${BASE_PATH}/?(.*) /$1 break;

      sub_filter_once                 off;
      sub_filter                      '**MICRO_LC_BASE_PATH**' '${BASE_PATH}';
      sub_filter                      '**MICRO_LC_MODE**' '${MODE}';
      sub_filter                      '**MICRO_LC_CONFIG_SRC**' '${CONFIG_SRC}';
      sub_filter                      '**CSP_NONCE**' $cspNonce;

      expires                         -1;
      try_files                       $uri $uri/index.html /index.html =404;
    }
  }
}
```

Notice that the algorithm `set_secure_random_alphanum` is provided by an `nginx` external
[module](https://github.com/openresty/set-misc-nginx-module) and generates 32 bytes of random hash on each endpoint call
replacing the variable `**CSP_NONCE**.

### Customization

To override default configurations with your own, you can use **volumes**:
* `index.html` is mounted at `/usr/static/index.html`
* `config.json` is mounted at `/usr/static/config.json`
* `default.conf` is mounted at `/etc/nginx/conf.d/default.conf`

## Building from source

If you would like to contribute or simply run <micro-lc></micro-lc> from source code, checkout locally the
[official repository](https://github.com/micro-lc/micro-lc). 

Be aware that it needs `node` `16+` and `yarn` `1.22+`. These requirements can be met installing a node version manager
like [`nvm`](https://github.com/nvm-sh/nvm#install--update-script) and then running:

```shell
nvm install lts/gallium
corepack enable
```

Once your `node` is up and running, issue:

```shell
yarn install
yarn initialize
```

and the source code of <micro-lc></micro-lc> will be located at `packages/orchestrator/dist`. 

Locally a playground is available but requires Docker and Docker Compose to run. After running:

```shell
yarn playground
```

the playground will be available on [http://localhost/](http://localhost).

## Playground

An online playground is <a href="/playground/" target="_blank">available</a> on this documentation website. Refer to our
guides to try <micro-lc></micro-lc> out on the playground setup.
