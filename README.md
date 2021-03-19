<div align="center">

# Micro Launch Complex

</div>

**The Mia-Platform micro frontend solution**

**microlc** enables you to create modular applications composed by multiple,
independent [micro frontends][micro-frontends]
called *plugins* integrated at runtime using [qiankun][qiankun].

# Getting Started

## Setup the local environment

To develop the serive locally you need:

- Node.js v12 or later,
- Yarn 1.x.x

To setup node.js, we suggest using [nvm][nvm], so you can manage multiple versions easily. Once you have installed nvm,
you can go inside the directory of the project and simply run `nvm install`, the `.nvmrc` file will install and select
the correct version if you don’t already have it.

To install Yarn, run `npm install --global yarn`.

Once you have all the dependency in place, you can launch:

```shell
yarn install
yarn coverage
```

These two commands, will install the dependencies and run the tests with the coverage report that you can view as an
HTML page in `packages/*/coverage/lcov-report/index.html`.

### Run a package script

This folder use yarn as package manager.

To run a script in a sub package, you should use `yarn workspace PACKAGE_NAME SCRIPT_NAME`.

So, for example, to run tests in website sub package you should run:

```shell
yarn workspace fe-container test
```

or it is possible to use the shortcut:

```shell
yarn fe-container test
```

### Run the services locally

You can run the service locally with:

```shell
yarn start
```

This command will spin up the `fe-container` on port `3000`.

### CI/CD

The `CI/CD` is powered by [`GitHub Actions`][`github-actions`].

The pipelines are divided in `.yml` files, that you can find under `.github/workflows` folder. 

[micro-frontends]: https://micro-frontends.org/

[qiankun]: https://github.com/umijs/qiankun

[nvm]: https://github.com/creationix/nvm

[mock-server]: https://github.com/staticdeploy/mock-server

[github-actions]: https://github.com/features/actions
