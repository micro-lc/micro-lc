# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- package is now a `module`
- removed `nyc` for `c8`

### Versioning

- Development dependencies updated

## [1.3.1] - 2023-07-21

### Fixed

- ignore symbols `/* @vite-ignore */` and `/* webpackIgnore: true */` added to dynamic imports to suppress warnings
- SVG elements different from `svg` and `path` are now correctly rendered

### Versioning

- Development dependencies updated

## [1.3.0] - 2023-07-06

### Added

- Added support for [`phosphor` icons](https://phosphoricons.com/), which are now bundled as part of the published content

## [1.2.1] - 2023-07-05

### Added

- Ant Design icons are now bundled

## [1.2.0] - 2023-06-21

### Added

- support for fontawesome brands icons

## [1.1.1] - 2023-05-29

### Fixed

- "Two tone" Ant Design icons are now loaded correctly

## [1.1.0] - 2023-05-29

### Added

- A list of available icons for each supported library is now available in final bundle

### Versioning

- Development dependencies updated
- Typescript set to `^5.0.4`

## [1.0.1] - 2023-03-28

### Fixed

- imports are module-like with a trailing `.js` to allow import on a browser

### Versioning

- Development dependencies updated
- Typescript set to `^4.9.5` with yarn `3.4.1`
- Typescript set to `^4.9.4` with yarn `3.3.1`
- Typescript is set to `4.9.3` due to yarn berry temporary incompatibility
- Typescript set to `^5.0.2` with yarn `3.5.0`

## [1.0.0] - 2022-12-12

### Versioning

- Development dependencies version bumps

### Fixed

- Default `<svg>` returned if icon is not found now correctly receives props 

### Versioning

- Development dependencies version bumps

## [0.1.2] - 2022-11-04
