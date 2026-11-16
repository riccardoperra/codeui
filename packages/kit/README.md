<p>
  <img width="100%" src="https://raw.githubusercontent.com/riccardoperra/codeui/main/codeui.png" alt="CodeUI Monorepo">
</p>

# CodeUI - [CodeImage](https://github.com/riccardoperra/codeimage) UI Kit

## Theming with plain CSS

Every color, radius, spacing, shadow and motion value is a `--cui-*` custom property. The CodeImage look is the default. Kit styles live in the `cui` cascade layer, so any unlayered rule in your app wins over them, whatever the stylesheet order. You do not need vanilla-extract to retheme the kit.

Set `data-cui-theme="dark"` or `data-cui-theme="light"` on `<html>` or on any subtree. Without the attribute, the kit follows `prefers-color-scheme`.

```css
/* Retheme the whole app. */
:root {
	--cui-action-brand-base: #7c3aed;
	--cui-action-brand-hover: #6d28d9;
	--cui-action-brand-active: #5b21b6;
	--cui-accent-focus: #a78bfa;
	--cui-radius-md: 6px;
	--cui-font-family-sans: "IBM Plex Sans", system-ui, sans-serif;
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
