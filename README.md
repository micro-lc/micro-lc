<div align="center">

# micro-lc

[![Build Status][github-actions-svg]][github-actions]
[![javascript style guide][standard-mia-svg]][standard-mia]
[![Coverage Status][coverall-svg]][coverall-io]
[![Docker fe pull][docker-frontend-pull-svg]][docker-frontend-pull]
[![Docker be pull][docker-backend-pull-svg]][docker-backend-pull]

</div>

**The Mia-Platform micro frontend solution**

**micro-lc** enables you to create modular applications composed by multiple, independent [micro frontends][micro-frontends]
called _plugins_ integrated at runtime. `micro-lc` consists of a core interface that loads, embeds, and orchestrates plugins, while
providing configuration options and useful out-of-the-box features.

The core components are written in Typescript and React, `micro-lc` is technology-agnostic, which means that it integrates
seamlessly with your favourite toolkit, being it Angular, React, Vue, or anything else you like.

You can consult [here][micro-lc-doc] the full documentation.

# Getting Started

The project is a monorepo built with [yarn workspaces][workspaces] and [lerna][lerna]. All workspaces can be found under
the `packages` folder. Each package has its own readme file which contains detailed information about its content.

### Set up the local environment

To develop the service locally you need:

- Node.js v12 or later,
- Yarn 1.x.x

To set up node.js, we suggest using [nvm][nvm], so you can manage multiple versions easily. Once you have installed nvm,
you can go inside the directory of the project and simply run `nvm install`, the `.nvmrc` file will install and select
the correct version if you don’t already have it.

To install Yarn, run `npm install --global yarn`.

Once you have all the dependency in place, you can launch:

```shell
yarn install
```

This command will install the dependencies for every workspace and will trigger a build of the [core](./packages/core/README.md)
workspace.

### Start the project

In order to try `micro-lc` on your machine with mocked configurations, you have to execute only the `dev` script, using the following command:

```shell
yarn dev
```

### Run a package script

To run a script in a workspace, you can run `yarn workspace PACKAGE_NAME SCRIPT_NAME`. For example, to run tests in
[fe-container](./packages/fe-container/README.md) you should run:

```shell
yarn workspace fe-container test
```

or you can use the shortcut:

```shell
yarn fe-container test
```

### Run tests e2e

To run the e2e tests on your local code, you should first build the front-end and back-end images: otherwise you can use the images uploaded on Docker Hub.

#### Build `fe-container` image

Run inside the `fe-container` directory the commands

```shell
yarn build
docker build -t miaplatform/microlc .
```

#### Build `be-config` image

Run inside the `root` directory

```shell
yarn be-config build
docker build -f packages/be-config/Dockerfile -t miaplatform/microlc-config-manager .
```

#### Run e2e tests

Run inside the `e2e` directory the command

```shell
docker-compose up
```

to spin-up the `e2e` environment, and then

```shell
yarn e2e
```

to run your tests

[micro-frontends]: https://micro-frontends.org/
[workspaces]: https://classic.yarnpkg.com/en/docs/workspaces/
[lerna]: https://github.com/lerna/lerna
[nvm]: https://github.com/creationix/nvm
[mock-server]: https://github.com/staticdeploy/mock-server
[standard-mia-svg]: https://img.shields.io/badge/code_style-standard--mia-orange.svg
[standard-mia]: https://github.com/mia-platform/eslint-config-mia
[coverall-svg]: https://coveralls.io/repos/github/mia-platform/microlc/badge.svg
[coverall-io]: https://coveralls.io/github/mia-platform/microlc
[docker-frontend-pull]: https://hub.docker.com/r/miaplatform/microlc
[docker-frontend-pull-svg]: https://img.shields.io/docker/pulls/miaplatform/microlc?label=Frontend%20pulls
[docker-backend-pull]: https://hub.docker.com/r/miaplatform/microlc-config-manager
[docker-backend-pull-svg]: https://img.shields.io/docker/pulls/miaplatform/microlc-config-manager?label=Backend%20pulls
[github-actions]: https://github.com/mia-platform/microlc/actions
[github-actions-svg]: https://img.shields.io/github/workflow/status/mia-platform/microlc/Node.js%20fe-container%20CI
[micro-lc-doc]: https://docs.mia-platform.eu/docs/business_suite/microlc/overview
