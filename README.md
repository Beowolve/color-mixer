# Color Mixer

An interactive web tool for mixing colors and finding optimal color combinations.

## Features

- Interactive background and target color inputs
- Single and double overlay blend modes (persisted in local storage)
- Automatic calculation of top 25 matching shorthand RGB/RGBA values
- Click-to-copy color code with toast notification feedback
- Light, dark, and system theme support
- Header version label sourced directly from `package.json`

## Technology Stack

- React 18
- Vite 7
- TypeScript (strict mode)
- Vitest for unit tests
- `color-string` for color parsing and conversion

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Scripts

```bash
# Start development server
npm run dev

# Alias for development server
npm start

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Run tests once
npm run test

# Type check TypeScript
npm run typecheck

# Lint TypeScript sources
npm run lint

# Auto-fix lint issues
npm run format
```

## Release Process

- Follow repository rules in `AGENTS.md`.
- Keep `CHANGELOG.md` and `package.json` in sync before release.
- Create release tags in format `v*.*.*` (example: `v1.2.0`).

## CI/CD

- `CI` workflow runs typecheck, lint, tests, and build on pushes/PRs to `main`.
- `Release` workflow runs on `v*.*.*` tags, generates release notes, publishes GitHub Releases, and deploys via FTP.

## Reusable Release Actions

The release workflow is built from reusable actions under `.github/actions`:

- `build-react-app`
- `generate-release-notes`
- `notify-discord-release`
- `deploy-ftp`

Manual FTP deploy is available via **Actions -> Release -> Run workflow** and optional `ref` input.

## Browser Support

- Chrome/Edge (modern versions)
- Firefox (modern versions)
- Safari (modern versions)

## License

This project is open source.
