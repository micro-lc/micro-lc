# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Versioning

- Development dependencies updated
- Typescript set to `^4.9.5` with yarn `3.4.1`

## [1.0.2] - 2023-01-12

### Added

- in `schemas/v2/config.schema.js` the parcel application entry has its own separate definition

### Versioning

- Development dependencies updated
- Typescript set to `^4.9.4` with yarn `3.3.1`

## [1.0.1] - 2022-12-19

### Fixed

- V2 schemas are referenced to `github` raw cdn resources and their `$id`s were modified accordingly
- missing `main` tag in `html-tag.schema.json` has been added

### Versioning

- Development dependencies updated
- Typescript is set to `4.9.3` due to yarn berry temporary incompatibility

## [1.0.0] - 2022-12-12

## [0.5.0] - 2022-12-06

### Fixed

- removed an unused key from `parcel` application json schema

## [0.4.0] - 2022-11-26

### Fixed

- v2 schemas `$id`'s updated to support trailing `#`
- v2 schemas `integrationMode` iframe: fixed types for attributes which must be a key value map string to string + added examples

### Versioning

- Development dependencies version bumps

## [0.3.3] - 2022-11-11
