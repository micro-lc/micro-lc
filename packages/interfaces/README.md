<div align="center">

# micro-lc interfaces 📃

</div>

Collection of micro-lc versioned interfaces. Interfaces are formalized using [JSON Schemas](https://json-schema.org/),
from which Typescript types are generated.

This repo offers also a [command-line interface](#cli) to perform conversion between different configurations versions.

## Using interfaces

The interfaces declared here are meant to be used as guidance when configuring and developing micro-lc.

### JSON schemas

> ⚠ This section is still work-in-progress.

### Typescript types

> ⚠ This section is still work-in-progress.

## CLI

> ⚠ The command-line interface is still work-in-progress.

## Development

To run the project you need:
* Node 16+
* Yarn

and you need to install the dependencies running

```shell
yarn install
```

## Adding a new schema

New schemas should be added in [schemas](./schemas) directory, under the correct version subdirectory.

When writing interfaces you should **always follow** these guidelines.

- Each file containing a schema *must* be called `*.schema.json`.
- The file containing the configuration schema *must* be called `config.schema.json`.
- Each version *must* be self-contained, meaning that references should be resolved inside the same directory (i.e., no
  "common files" between versions).
- Each schema *should* contain the property `$schema` referencing the JSON schema implementation in use (e.g., `http://json-schema.org/draft-07/schema`).
- Each schema *must* contain the property `$id`, which is a univocal identifier of the schema. The property should have
  the following structure: `<repo_remote_url>/interfaces/main/schemas/<schema_version>/<schema_file_name>`.
- Add as many examples as possible in the schemas using the `examples` property.

To generate the Typescript types from the schemas, simply run

```shell
yarn make-types
```

and you will find them in [types](./types) directory.

## Testing

Tests can be lunched running

```shell
yarn test
```

This project implements two test suits for the schemas:

- one to validate the content of every `examples` property against the schema portion it is exemplifying, and
- one to validate the JSON files in `/schemas/<version>/__tests__` directories against the corresponding
  config schemas.

The suites automatically target each schema in `schemas`. 
