<div align="center">

# Micro Launch Complex

</div>

**The Mia-Platform micro frontend solution**

**Microlc** enables you to create modular applications composed by multiple, independent [micro frontends][micro-frontends]
called *plugins* integrated at runtime. Microlc consists of a core interface that loads, embeds, and orchestrates plugins, while
providing configuration options and useful out-of-the-box features.

The core components are written in Typescript and React, microlc is technology-agnostic, which means that it integrates
seamlessly with your favourite toolkit, being it Angular, React, Vue, or anything else you like.

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

In order to try `microlc` on your machine with mocked configurations, you have to execute only the `dev` script, using the following command:

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

[micro-frontends]: https://micro-frontends.org/
[workspaces]: https://classic.yarnpkg.com/en/docs/workspaces/
[lerna]: https://github.com/lerna/lerna
[nvm]: https://github.com/creationix/nvm
[mock-server]: https://github.com/staticdeploy/mock-server
