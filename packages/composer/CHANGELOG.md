# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Versioning

- Development dependencies updated
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
