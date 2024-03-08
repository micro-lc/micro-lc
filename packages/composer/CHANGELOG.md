# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- package is now a `module`
- removed `nyc` for `c8`

### Fixed

- compose lexer was wrongly throwing when exiting in normal mode
- refactor to pre-minified version of the compose lexer
  several exports explicitly added in `package.json`

### Versioning

- `lit-html` to `^2.8.0`
- `es-module-shims` to `^1.8.0`
- `rxjs` bumped to `^7.8.1`
- Typescript set to `^5.1.6` with yarn `3.6.1`
- Typescript set to `^5.3.3` with yarn `4.1.0`
- Development dependencies updated

## [2.0.3] - 2023-03-09

### Added

- apis are kept in memory across `mount` calls

## [2.0.2] - 2023-03-07

### Versioning

- Development dependencies updated
- Typescript set to `^4.9.5` with yarn `3.4.1`
- `lit` to `^2.6.1`

### Added

- refactor to `premount` API in order to better follow the promise lifecycle

## [2.0.1] - 2023-01-12

### Added

- `premount` allows to collect errors via a `reporter` optional parameter which defaults to `console.error`

### Fixed

- `composer` is allowed to further scope its container when `qiankun` provides an application name

### Versioning

- Development dependencies updated
- Typescript set to `^4.9.4` with yarn `3.3.1`
- Typescript is set to `4.9.3` due to yarn berry temporary incompatibility
- Direct dependencies `lit-html` was updated and deduped due to this [issue](https://github.com/lit/lit/issues/3241)
- Direct dependencies `rxjs` was updated

## [2.0.0] - 2022-12-12

## [0.4.2] - 2022-11-29

### Added

- added `createPool` method to the `composer` library

### Versioning

- bumped eslint dev dependency

## [0.4.1] - 2022-11-26

### Added

- composer releases a ES module bundle at `/dist/bundle/index.min.js`

### Fixed

- composer can render a single string node like `Hello 👋`

## [0.4.0] - 2022-11-21

### Added

- api expanded to include `render` method

### Versioning

- Development dependencies version bumps

## [0.3.1] - 2022-11-04
