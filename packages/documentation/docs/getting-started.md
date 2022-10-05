---
title: Getting started
sidebar_label: Getting started
---

`micro-lc` is shipped as a ES module CDN bundle and can be imported in any HTML page.
Moreover a dockerized webserver is available on `docker hub` with a `docker-compose` yaml.

## Import from CDN

Create a blank `index.html` file and paste

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="icon" href="*****************" />
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'self' https: http:;
    script-src 'self' 'unsafe-eval' blob: data:;
    connect-src 'self' data: https://cdn.jsdelivr.net/npm/;
  "/>
  <style>
    html, body {
      position: relative;
      width: 100%;
      height: 100%;
      margin: 0;
    }
  </style>
  <script type="module" src="****************/micro-lc.development.js"></script>
</head>
<body>
  <micro-lc config-src="./config.json"></micro-lc>
</body>
</html>
```

then write your config file

```json title="config.json"
{
  "$schema": "link to schema *********************************",
  "version": 2,
  "layout": {
    "sources": {
      "uris": [
        "/packages/layout/dist/mlc-layout.min.js",
        "/packages/layout/dist/mlc-antd-theme-manager.min.js"
      ]
    },
    "content": [
      {
        "tag": "mlc-antd-theme-manager",
        "attributes": {
          "primary-color": "#25B864"
        }
      },
      {
        "tag": "mlc-layout",
        "properties": {
          "logo": {
            "url": "****************/favicon.png"
          },
          "menuItems": [
            {
              "icon": {
                "library": "@ant-design/icons-svg",
                "selector": "BugOutlined"
              },
              "id": "main",
              "label": "Wikipedia",
              "type": "application"
            }
          ]
        }
      }
    ]
  },
  "applications": {
    "main": {
      "integrationMode": "iframe",
      "route": "./",
      "src": "https://wikipedia.org"
    }
  }
}

```

then run any static server like

### Python 2.x

```shell
python -m SimpleHTTPServer 8000
```

### Python 3.x

```shell
python -m http.server 8000
```

## Deploy docker container

## Docker Compose configuration

```yaml file="docker-compose.yml
version: '3'

services:
  micro-lc:

```

* Implementazione da CND
* Download del container (Docker + Docker Compose)
* Building from source

## Playground

* Code sandbox
* StackBlitz
