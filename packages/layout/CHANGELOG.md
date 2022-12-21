# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Fixed

- vite warning on inline css import resolved
- json schema import fixed for `mlc-config` web component

### Versioning

- Storybook updated
- Development dependencies updated
- Typescript set to `^4.9.4` with yarn `3.3.1`
- Typescript is set to `4.9.3` due to yarn berry temporary incompatibility
- Direct dependencies `@ctrl/tinycolor` was updated
- Direct dependencies `lit-html` was updated and deduped due to this [issue](https://github.com/lit/lit/issues/3241)

## [1.0.0] - 2022-12-12

### Added

- Multiple application ids on `mlc-layout`

## [0.1.8] - 2022-11-26

### Fixed

- Fixed `monaco-editor` workers both for build and storybook

### Versioning

- Development dependencies version bumps
- Direct dependency `antd` has been fixed to `4.24.1` due to a breaking change in its own dependencies (`rc-motion` and `rc-image`) on build
- Checking [issue](https://github.com/react-component/image/issues/144) for `rc-image` not import `rc-motion`

## [0.1.7] - 2022-11-15
