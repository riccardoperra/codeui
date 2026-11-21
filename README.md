<p>
  <img width="100%" src="codeui.png" alt="CodeUI Monorepo">
</p>

<div align="center">

# CodeUI - [CodeImage](https://github.com/riccardoperra/codeimage) UI Kit

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?logo=turborepo)](https://turborepo.org/)

> **Warning** This is Still WIP

</div>

## Try packages from a pull request

Use the install command in the `pkg.pr.new` comment on the pull request. It points to a specific commit. The kit preview includes matching previews of `@codeui/styles` and `@codeui/inkstone` as dependencies. The Solid 2 kit requires both `solid-js@^2` and `@solidjs/web@^2`.

You can also download the `codeui-preview` artifact from the **Package preview** run on the pull request. Extract the ZIP in your consumer project and install all three tarballs together.

```sh
npm install ./.codeui-preview/*.tgz
```

The run summary includes a GitHub CLI command that downloads the tarballs to that directory. The artifact expires after 14 days. Repository maintainers can enable direct install URLs by installing the [pkg.pr.new GitHub App](https://github.com/apps/pkg-pr-new) for CodeUI.

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
