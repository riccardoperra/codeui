<p>
  <img width="100%" src="https://raw.githubusercontent.com/riccardoperra/codeui/main/codeui.png" alt="CodeUI Monorepo">
</p>

# CodeUI - [CodeImage](https://github.com/riccardoperra/codeimage) UI Kit

Install `@codeui/kit` and `solid-js`. Solid components import their compiled CSS and theme automatically. No CSS import or vanilla-extract plugin is required in your app.

```ts
import { Button } from "@codeui/kit";
```

Each component loads its stylesheet and shared dependencies. Bundlers can remove unused component modules and their CSS. Token-only imports from `@codeui/kit/tokens` remain free of CSS imports.

The styles package can be installed without Solid. The library authors styles with vanilla-extract and extracts them before publishing. Selection is per component, with all its variants and states retained.

In vanilla-extract `*.css.ts` files, import `tokens`, `themeVars`, `themeTokens`, `layoutVars`, `breakpoints`, and `responsiveStyle` from `@codeui/kit/tokens`.
This entry has no Solid or Kobalte imports and is safe to evaluate during style builds in Node; the root entry keeps the same exports for compatibility.

## Theming with plain CSS

Every color, radius, spacing, shadow and motion value is a `--cui-*` custom property. The CodeImage look is the default. Kit styles live in the `cui` cascade layer, so any unlayered rule in your app wins over them, whatever the stylesheet order. You do not need vanilla-extract to retheme the kit.

Set `data-cui-theme="dark"` or `data-cui-theme="light"` on `<html>` or on any subtree. Without the attribute, the kit follows `prefers-color-scheme`.

```css
/* Retheme the whole app. These tokens have one value for both modes,
   so :root reaches every nested data-cui-theme scope. */
:root {
	--cui-action-brand-base: #7c3aed;
	--cui-action-brand-hover: #6d28d9;
	--cui-action-brand-active: #5b21b6;
	--cui-radius-md: 6px;
	--cui-font-family-sans: "IBM Plex Sans", system-ui, sans-serif;
}

/* A token with a dark and a light value is set again on each
   data-cui-theme scope. Override it on the scopes too. */
:root,
[data-cui-theme] {
	--cui-accent-focus: #a78bfa;
}

/* Different values per mode. */
[data-cui-theme="light"] {
	--cui-surface-canvas: #fafaf9;
	--cui-surface-input: #f5f5f4;
}

[data-cui-theme="dark"] {
	--cui-surface-canvas: #0c0a09;
	--cui-surface-input: #1c1917;
}

/* Restyle one instance with a class. */
.danger-zone-button {
	--cui-action-danger-base: #b91c1c;
	border-radius: 0;
}

/* A CSS reset must sit below the kit, or it overrides kit components.
   Declare the order in the first stylesheet the page loads. */
@layer reset, cui;
@layer reset {
	button {
		background: none;
	}
}
```

The names follow `--cui-<role>-<name>`. The roles are `surface`, `text`, `action`, `accent`, `border`, `focus`, `shadow`, `radius`, `space`, `control`, `font` and `motion`. [`k5-token-map.json`](../../docs/kit-2026/design/k5-token-map.json) lists every name with its dark and light value. In TypeScript, `tokens` from `@codeui/kit` holds the same names as `var(--cui-…)` strings.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
