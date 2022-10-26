---
id: backend
title: Back-end
sidebar_label: Back-end
---

The **be-config** exposes the endpoints used to configure the **fe-container**:
- the `/authentication` endpoint which receives `GET` requests and responds with the **user configuration** in JSON format;
- the `/configuration` endpoint which receives `GET` requests and responds with the **`micro-lc` configuration** in JSON format;
- the `/configuration/:configurationName` endpoint, for which we suggest to read the [dedicated section](general_configuration.md).

Both are written using `Node.js` and `Fastify`, with the support of [Mia service Node.js library](https://github.com/mia-platform/custom-plugin-lib).

## Configurations loading

The configuration returned by each endpoint is read from a JSON file that **must be accessible** from the **be-config** instance.

The path where each JSON is stored can be configured using the following environment variables:
- **`AUTHENTICATION_CONFIGURATION_PATH`**, for [authentication](authentication.md#example);
- **`MICROLC_CONFIGURATION_PATH`**, for [core](core_configuration.md#example).

:::info
**be-config** is available as [Docker image](https://hub.docker.com/r/miaplatform/microlc-config-manager):
using `docker run` the JSON files can be mounted as `volumes`. On Kubernetes the JSON files can be inserted in a `ConfigMap`.
:::
