# CHANGELOG

👉 This file is a copy of the micro-lc orchestrator [CHANGELOG](./packages/orchestrator/CHANGELOG.md)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [2.4.3] - 2024-10-28

### Versioning

- Upgraded `@micro-lc/composer`

## [2.4.2] - 2024-06-13

### Fixed

- typo in `@micro-lc/orchestrator` package.json `peer-dependencies` section preventing installation

### Added

- remove 3rd party modules to generate nonce and bump nginx to v1.25.5

### Versioning

- Development dependencies updated
- `qiankun` to version `2.10.16`

## [2.4.1] - 2024-04-30

### Fixed

- `fallback-language` value made available via new language API extension

## [2.4.0] - 2024-03-22

### Added

- `fallback-language` property in micro-lc web component

## [2.3.1] - 2024-03-16

### Added

- added support for direct CJS imports via tools like `jest`

### Fixed

- add an injection prop param for `loadApp` in `compose` integration mode
- removed `@ts-ignore-error` directive on proxied fetch due to type fix

### Versioning

- Development dependencies updated

## [2.3.0] - 2024-03-08

### Added

- refactor of ESM lib end exposing `MFELoader` class to embed `micro-lc` in a JS browser application
- `loadApp` function in `./mfe-loader`

### Changed

- package is now a `module`
- removed `nyc` for `c8`

### Versioning

- Development dependencies updated

## [2.2.3] - 2024-02-06

## [2.2.2] - 2023-10-13

### Fixed

- fix to `cve-2023-38039` in docker container by updating `curl` and `libcurl` dependency
- fix to `goToApplication` API: correct order of actions is taken 1. unmount 2. url push 3. mount

### Versioning

- Development dependencies updated

## [2.2.1] - 2023-10-04

### Versioning

- `qiankun` to `^2.10.13`

## [2.2.0] - 2023-07-20

### Added

- `microfrontend-loader` webcomponent which wraps the `micro-lc` loading API to reuse MFE loading inside compose applications
- extraction of the application configuration maker which is now shared with `microfrontend-loader`

### Fixes

- security updates / vulnerability fixes in `.docker/Dockerfile` related with `nginx:1.25.1-alpine` for `CVE-2023-2975`, `CVE-2023-3138`, and `CVE-2023-3316`
- `compose` are not anymore mounted twice at startup: fixed a race condition between qiankun `loadMicroApp` load and our router `mount` call

### Versioning

- `Dockerfile` to `nginx:1.25.1-alpine`
- Development dependencies updated
- `qiankun` to `^2.10.11`,
- `es-module-shims` from `1.7.2` to `^1.8.0`
- `lit-html` to `v2.8.0`

## [2.1.0] - 2023-06-09

### Added

- `micro-lc` config supports `injectBase` -> `override` const value to instruct the app loader to optionally remove any existing base from an incoming parcel entrypoint

### Versioning

- Development dependencies updated

### Fixes

- security updates / vulnerability fixes in `.docker/Dockerfile` related with `nginx:1.24.0-alpine`

## [2.0.10] - 2023-05-31

### Added

- in browser tests to validate support to angular 12, 13, and 14
- added support to `linux/arm64` in docker container `microlc/micro-lc`

### Versioning

- `lit-html` to `2.7.4`
- `rxjs` bumped to `7.8.1`
- `es-module-shims` bumped to `1.7.2`

### Fixed

- routing towards a `parcel` application which is registered as `/app/` takes the precedence when calling the URL `/app`
- public assets on a `parcel` application are served on a path which ends by a trailing slash
- removed `console.log` statements

## [2.0.9] - 2023-04-20

### Added

- `Symbol.observable` polyfill is available at `dist/polyfills/symbol-observable.js` as side-effect script

### Fixed

- `base` tag `href` attribute of a `parcel` application, when `injectBase` is true must be equal to the configured `route`

### Versioning

- `lit-html` to `2.7.2`
- `es-module-shims` to `1.7.1`
- Development dependencies updated
- Typescript set to `^5.0.4`
- `nginx` to `1.24.0` on support docker container

## [2.0.8] - 2023-04-11

### Versioning

- Development dependencies updated

### Fixed

- error page customization does not override all error codes defaults
- excluding speedy sandbox allows to bump `qiankun` up to current latest

## [2.0.7] - 2023-04-03

### Fixed

- `parcel` application settings can be written as `{"html": "<path>"}` construct

### Versioning

- Development dependencies updated

## [2.0.6] - 2023-03-28

### Fixed

- fix to `cve-2022-3970` in docker container by updating `tiff` dependency

### Versioning

- Development dependencies updated
- Typescript set to `^5.0.2` with yarn `3.5.0`

## [2.0.5] - 2023-03-09

### Fixed

- `shared` properties and microlcApi extensions are persisted in `compose` applications across mount and unmount cycles

## [2.0.4] - 2023-03-07

### Versioning

- `nginx` alpine bumped to v1.23.3
- `devel-kit` bumped to v0.3.2

### Fixed

- `qiankun` is not bundled as its own chunk, to prevent faulty behavior on resources loading
- `libcurl` CVEs mitigation

## [2.0.3] - 2023-03-07

### Fixed

- assets naming do not include a hash

### Versioning

- Development dependencies updated
- Typescript set to `^4.9.5` with yarn `3.4.1`
- `qiankun` to `^2.9.3`
- `qiankun` to `^2.9.1`

### Added

- `onload` of `micro-lc` is called after a successful reroute

## [2.0.2] - 2023-02-09

### Fixed

- `compose` applications live in a body made by a `div` tag with CSS class `composer-body`

## [2.0.1] - 2023-01-24

### Added

- `compose` integration mode is scoped to allow the presence of a `qiankun-head` tag
- applications `route` and `config` fields, when representing URLs, are computed wrt `document.baseURI`

### Fixed

- fixed bug on route matching
- assets renaming removed hash for error pages (401, 404, and 500) + composer application bundle

### Versioning

- Development dependencies updated
- Typescript set to `^4.9.4` with yarn `3.3.1`
- Typescript is set to `4.9.3` due to yarn berry temporary incompatibility
- Direct dependencies `rxjs` was updated

## [2.0.0] - 2022-12-12

## [0.3.0] - 2022-11-28

### Added

- url pattern matching extended to parametric values
- layout sidebar accepts multiple applications per item to mock a SPA folder structure

### Versioning

- Development dependencies version bumps

## [0.2.5] - 2022-11-26

### Added

- Support for `srcdoc` attributes on iframes
- `playground` has an example of direct use of composer in browser
- `playground` has an example of programmatic use of `micro-lc` tag mount as the result of a composition

### Versioning

- Development dependencies version bumps

## [0.2.4] - 2022-11-11
