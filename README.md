<p>
  <img width="100%" src="codeui.png" alt="CodeUI Monorepo">
</p>

<div align="center">

# CodeUI - [CodeImage](https://github.com/riccardoperra/codeimage) UI Kit

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?logo=turborepo)](https://turborepo.org/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/bcc7a6d1-e9dc-4650-a465-ced9cd676f6b/deploy-status?style=for=t)](https://app.netlify.com/sites/codeui/deploys)

> **Warning** This is Still WIP

</div>

## Project Commands

List of cli commands available from a project root.

To use the commands, first install [pnpm](https://pnpm.io) and install dependencies with `pnpm i`.

```bash
pnpm run dev
# Builds all packages in watch mode, and starts all playgrounds
# turbo run dev --parallel

pnpm run build
# Builds all the packages in the monorepo
# turbo run build --filter=!./playgrounds/*

pnpm run test
# Runs tests for all the packages in the monorepo
# turbo run test --filter=!./playgrounds/*

pnpm run typecheck
# Runs TS typecheck for all the packages in the monorepo
# turbo run typecheck --filter=!./playgrounds/*

pnpm run build-test
# Runs build, typecheck and test commands for all the packages in the monorepo
# "turbo run build test typecheck --filter=!./playgrounds/*

pnpm run format
# Formats the reposotory with prettier
# prettier -w \"packages/**/*.{js,ts,json,css,tsx,jsx,md}\" \"playgrounds/**/*.{js,ts,json,css,tsx,jsx,md}\"

pnpm run changeset
# Creates a changeset
# changeset

pnpm run version-packages
# Applies changesets to bump package versions and update CHANGELOGs
# "changeset version && pnpm i

pnpm run release
# Builds and publishes changed packages to npm
# pnpm run build-test && changeset publish

pnpm run update-deps
# Updates all dependencies in the repository
# taze -w -r && pnpm i
```
