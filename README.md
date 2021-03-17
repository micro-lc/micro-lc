<div align="center">

# Micro Launch Complex

</div>

**The Mia-Platform micro frontend solution**

**microlc** enables you to create modular applications composed by multiple, independent [micro frontends][micro-frontends]
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
yarn run coverage
```

These two commands, will install the dependencies and run the tests with the coverage report that you can view as an HTML
page in `coverage/lcov-report/index.html`.

### Run the service locally

You can run the service locally with:

```shell
yarn run dev
```

This command will spin up a [mock-server][mock-server] on port `3456`, run the tests in watch mode and start the service
on port `3000`.

[micro-frontends]: https://micro-frontends.org/
[qiankun]: https://github.com/umijs/qiankun
[nvm]: https://github.com/creationix/nvm
[mock-server]: https://github.com/staticdeploy/mock-server
