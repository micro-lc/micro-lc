# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Versioning

- Development dependencies updated
- `qiankun` to `^2.10.9`,
- `es-module-shims` from 1.7.2 to 1.7.3

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
