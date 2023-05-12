<h1 align="center">
  <a href="https://micro-lc.io"><img src="https://micro-lc.io/img/logo-light.png" alt="micro-lc"></a>
</h1>

<p align="center">
    <a href="https://mia-platform.eu/?utm_source=referral&utm_medium=github&utm_campaign=micro-lc"><img src="https://img.shields.io/badge/Supported%20by-Mia--Platform-green?style=for-the-badge&link=https://mia-platform.eu/&color=DE0D92&labelColor=214147" alt="Mia-Platform" /></a>
</p>

<p align="center">
  <a href="https://www.jsdelivr.com/package/npm/@micro-lc/orchestrator">
    <img src="https://data.jsdelivr.com/v1/package/npm/@micro-lc/orchestrator/badge?style=rounded" alt="" />
  </a>
  <a>
    <img src="https://github.com/micro-lc/micro-lc/actions/workflows/main.yml/badge.svg?branch=main" alt="" />
  </a>
  <a href="https://badge.fury.io/js/@micro-lc%2Forchestrator">
    <img src="https://badge.fury.io/js/@micro-lc%2Forchestrator.svg" alt="npm version" height="20">
  </a>
  <a>
    <img src="https://img.shields.io/npm/dm/@micro-lc/orchestrator.svg" alt="npm downloads" />
  </a>
  <a href="https://opensource.org/licenses/Apache-2.0">
    <img alt="License" src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" />
  </a>
  <a>
    <img alt="ts" src="https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label" />
  </a>
</p>

## Introduction

micro-lc is an open source micro-frontend orchestrator for building flexible, multi-tenant frontend applications.
And [much more](https://micro-lc.io/)!

**Tip**: use the official **[playground](https://micro-lc.io/playground/)** to try micro-lc immediately.

An introduction about micro frontend and how micro-lc works:

<div align="center">
  <a href="https://www.youtube.com/watch?v=QumadjC2krU"><img src="https://img.youtube.com/vi/QumadjC2krU/0.jpg" alt="micro-lc introduction"></a>
</div>

## Installation

micro-lc is shipped as an ES module **CDN bundle** and can be imported in any HTML page. Moreover, a **dockerized 
webserver** is available on Docker Hub.

[Read the docs](https://micro-lc.io/docs/getting-started) to learn how you can use micro-lc in your
next project!

## Handle the repo

### Build

This repository is made of 5 subpackages. The dependencies can be sketched as follows:

```
  `interfaces`
           |
    `composer`
           |
`orchestrator` `iconic`
           |    |
          `layout`
```

to build the packages there's a script which can be invoked after install as

```shell
yarn initialize [OPTIONS]
```

where `OPTIONS` are

1. `-c` or `--cleanup`
2. one of the subpackages: `interfaces`, `iconic`, `composer`, `orchestrator`, and `layout` (default)

By using `cleanup` you require `initialize` to trash anything in the `dist`, `node_modules`, and `coverage` directories.
By choosing one subpackage, `initialize` will build up to that one.

To build the repository disregarding previous actions run:

```shell
yarn initialize --cleanup
```

### Shortcuts

Yarn allows to invoke scripts onto subpackages in a `workspaces` environment. Such commands might
become soon verbose since to build a subpackage the command would be like:

```shell
yarn workspace @micro-lc/orchestrator build
```

hence we enforced some shortcuts:

1. `workspace @micro-lc/interfaces` -> `i`
2. `workspace @micro-lc/iconic` -> `c`
3. `workspace @micro-lc/composer` -> `m`
4. `workspace @micro-lc/orchestrator` -> `o`
5. `workspace @micro-lc/layout` -> `l`

hence the command above would become:

```shell
yarn o build
```

### Test

To run tests ensure some CommonJS to ESM conversion on dependencies by running

```shell
yarn prepare-test
```

then simply run

```shell
yarn test
```

or

```shell
yarn coverage
```

### Components Playground

`layout` is a webcomponents repository and provides a storybook environment.
Remind to build dependencies as prompted [before](#build) and then run:

```shell
yarn l storybook
```

A local playground is also available. Run:

```shell
yarn playground
```

to start the playground, and:

```shell
yarn playground-stop
```
to stop it.

## Contributing

We are thankful for any contributions from the community, read our [contributing guide](./CONTRIBUTING.md) to learn
about our development process, how to propose bugfixes and improvements, and how to build and test your changes to
micro-lc.

## Licence

micro-lc is [Apache 2.0 licensed](https://www.apache.org/licenses/LICENSE-2.0).
