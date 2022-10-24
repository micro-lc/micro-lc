# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- user's permissions evaluation based on user's properties in USER_PROPERTIES_HEADER_KEY request header

## 0.8.1

### Fixed

- CSP evaluation

## 0.8.0

### Added

- base html tag in index.html
- dynamic configuration script in index.html

### Changed

- now micro-lc can be exposed on a different path then /

### BREAKING CHANGES

- config file API now is able to return something that is not a JSON


## 0.7.0

### Added

- full support for Angular 2+, thanks to zone import


### Changed

- tobBar restyling

### Updated

- Dependencies

## 0.6.2

### Fixed

- favicon import url

## 0.6.1

### Fixed

- topBar menu with content
- fixedSideBar tooltip style

### Updated

- Dependencies

## 0.6.0

### Added

- rightMenu section, composed of web-components

### Fixed

- topBarMenu icon behaviour when using different FontAwesome versions

### Updated

- Dependencies

## 0.5.0

### Added

- Support for multiple back-end

## 0.4.0

### Fixed

- Issue #273
- iframe div that occupy half page

### Updated

- custom plugin lib to version 4.2.0
- general dependencies

## 0.3.1

### Fixed

- ACL expression evaluator now does not modify the initial json to filter

### Updated

- Dependencies

## 0.3.0

### Added

- Internal plugins

### Updated

- Dependencies

## 0.1.1

### Updated

- nginx version of fe-container to version 1.20.0

### Fixed

- 404 page flash on first load

## 0.1.0

### Added

- micro-lc is now ready to be considered stable

### Changed

- extracted common components to be used inside the plugins
