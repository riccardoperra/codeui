# Theming

Every kit color, radius, spacing, shadow and motion value is a `--cui-*` custom property. `data-cui-theme="dark"` or `"light"` on `<html>` or any subtree picks the mode; without it the kit follows `prefers-color-scheme`. Kit styles live in the `cui` cascade layer, so unlayered app CSS overrides them regardless of stylesheet order.

## Sub-features

- `theme-attr` switches tokens and `color-scheme` with `data-cui-theme`.
- `theme-tokens` exposes `--cui-<role>-<name>` values per mode (roles: `surface`, `text`, `action`, `accent`, `border`, `focus`, `shadow`, `radius`, `space`, `control`, `font`, `motion`).
- `theme-override` lets unlayered app CSS (a `:root` token or a class rule) win over kit styles.
- `theme-components` renders every component legibly in both modes.

## How to get to it (user POV)

- An app sets `data-cui-theme` on `<html>`; in Storybook the dark-mode toolbar addon does it through the `ThemeWrapper` decorator. `drive.mjs --theme dark|light` forces it.
- An app adds a stylesheet that sets `--cui-*` on `:root` or a class (see `packages/kit/README.md`, "Theming with plain CSS").
- Token names and values: `docs/kit-2026/design/k5-token-map.json`.

## Driving it with drive.mjs

Preconditions:

- Doctor exits 0.

- **Mode switch.** Drive `designsystem-button--primary` with a journey that reads `document.documentElement`: `data-cui-theme` equals the theme, `colorScheme` equals the theme, and `--cui-surface-canvas` is `#0f0f10` dark and `#f7fafc` light. The body background matches `backgrounds[theme]`. Observed in a probe on this base.
- **Override.** In the same journey, `page.addStyleTag({ content: ':root{--cui-action-brand-base: rgb(1, 2, 3)}' })`, then `[data-cui=button]` has computed `backgroundColor` `rgb(1, 2, 3)` in both themes. Before the override it is `rgb(0, 112, 240)`. Observed in a probe on this base.
- **Layer contract.** `BASELINE_URL=<launch url> node tools/baseline/layer.mjs` checks on `[data-cui=button]` that every matching kit rule sits in `@layer cui` and an unlayered app background (`rgb(1, 2, 3)`) wins; exit 0 and four `true` checks. It also writes an untracked `docs/kit-2026/phase-0/baseline/layer.json`; delete it so it is not staged.
- **Every component in both modes.** `drive.mjs <story-id>` with no journey for each story you touched; compare `dark/01-rendered.png` and `light/01-rendered.png`.

## Gotchas

- `--cui-action-brand-base` is the same (`#0070f0`) in both modes; use a surface or text token to tell modes apart.
- `color-scheme` is inherited, so `getComputedStyle(anyKitElement).colorScheme` proves which mode a subtree resolved to.
- The baseline harness serves empty CSS for remote stylesheets; font-family checks see the fallback font.
