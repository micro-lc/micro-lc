# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

## [2.0.6] - 2023-03-28

## [2.0.5] - 2023-03-09

### Versioning

- Dev dependencies updated

### Fixed

- `shared` properties and microlcApi extensions are persisted in `compose` applications across mount and unmount cycles

## [2.0.4] - 2023-03-07

## [2.0.3] - 2023-03-07

## [2.0.2] - 2023-02-09

### Fixed

- `compose` applications live in a body made by a `div` tag with CSS class `composer-body`

## [2.0.1] - 2023-01-25

### Versioning

- fixes `qiankun-head` faulty behavior with composer `v2.0.1`
- fixes absolute path resolution with orchestrator `v2.0.1`

## [2.0.0] - 2022-12-12

### New Release

- to migrate from v1 to v2 check out the [guide](https://micro-lc.io/docs/migrating-from-v1)

## [1.0.0] 2022-11-03

## [0.9.0]

### Added

- user's permissions evaluation based on user's properties in USER_PROPERTIES_HEADER_KEY request header

## [0.8.1]

### Fixed

- CSP evaluation

## [0.8.0]

### Added

- base html tag in index.html
- dynamic configuration script in index.html

### Changed

- now micro-lc can be exposed on a different path then /

### BREAKING CHANGES

- config file API now is able to return something that is not a JSON

## [0.7.0]

### Added

- full support for Angular 2+, thanks to zone import

### Changed

- tobBar restyling

### Updated

- Dependencies

## [0.6.2]

### Fixed

- favicon import url

## [0.6.1]

### Fixed

- topBar menu with content
- fixedSideBar tooltip style

### Updated

- Dependencies

## [0.6.0]

### Added

- rightMenu section, composed of web-components

### Fixed

- topBarMenu icon behaviour when using different FontAwesome versions

### Updated

- Dependencies

## [0.5.0]

### Added

- Support for multiple back-end

## [0.4.0]

### Fixed

- Issue #273
- iframe div that occupy half page

### Updated

- custom plugin lib to version 4.2.0
- general dependencies

## [0.3.1]

### Fixed

- ACL expression evaluator now does not modify the initial json to filter

### Updated

- Dependencies

## [0.3.0]

### Added

- Internal plugins

### Updated

- Dependencies

## [0.1.1]

### Updated

- nginx version of fe-container to version 1.20.0

### Fixed

- 404 page flash on first load

## [0.1.0]

### Added

- micro-lc is now ready to be considered stable

### Changed

- extracted common components to be used inside the plugins
