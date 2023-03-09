# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

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
