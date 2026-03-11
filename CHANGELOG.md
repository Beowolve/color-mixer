# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [Unreleased]

## [1.1.0] - 2026-03-11

### Added

- Added TypeScript migration across the app with strict compiler settings.
- Added blend mode switch for single and double overlays.
- Added explanatory tooltips for single and double blend modes.
- Added copy-to-clipboard toast feedback with accessible live region support.
- Added app version display in the header.
- Added CI and release workflows with reusable GitHub Actions.
- Added lint, format, and typecheck scripts.
- Added repository process documentation in `AGENTS.md`.

### Changed

- Migrated the build toolchain from CRA (`react-scripts`/`react-app-rewired`) to Vite.
- Migrated unit tests from Jest to Vitest.
- Aligned release deployment output to `dist` for parity with `unit-golf`.
