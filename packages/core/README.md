# Core

This package contains the common data models and business logic.

The data models are written as [JSON Schemas](https://json-schema.org/) and compiled as Typescript types using [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts#readme).

# Project structure

The root directory for the business logic is `src`.

Inside `src` there is the `models` folder, where the models are divided by purpose:
- `configuration`: the models about `microlc` configuration
- `user`: the information about a user managed by `microlc`
