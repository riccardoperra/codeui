# @codeui/inkstone

The shared Inkstone design tokens for use in any application. The package ships a CSS theme, TypeScript references and breakpoints, and DTCG token data for light and dark. At build time Gosfuig generates the grey, blue, red, orange, and green ramps. Toghen resolves the semantic aliases for both modes.

## Use the CSS theme

```css
@import "@codeui/inkstone/theme.css";

.notice {
  background: var(--cui-surface-panel);
  color: var(--cui-text-default);
  padding: var(--cui-space-4);
}
```

The default follows the system color preference. Set `data-cui-theme="light"` or `data-cui-theme="dark"` on the document or a subtree to choose a mode. Override shared values such as `--cui-action-brand-base` and `--cui-radius-scale` to customize the theme. CSS formulas for derived colors and radii resolve in the browser.

## Read the token data

```ts
import { breakpoints, themeValues, tokens } from "@codeui/inkstone";

const buttonHeight = tokens.control.height.md; // var(--cui-control-height-md)
```

- The package entry provides CSS references, numeric breakpoints in pixels, and the web theme values. It supports ESM and CommonJS.
- `@codeui/inkstone/light.json` and `@codeui/inkstone/dark.json` provide resolved DTCG tokens for each mode. Browser formulas and web-only values such as compound shadows are represented in the CSS theme and web theme values.
- `@codeui/inkstone/resolver.json` is the DTCG resolver for tools that need the original sources.
- `@codeui/inkstone/custom-media.css` provides the shared breakpoint aliases for a build tool that supports draft custom media. `@codeui/inkstone/layers.css` declares the shared cascade order.

`@codeui/styles` adds component CSS and its local token aliases. `@codeui/kit` loads the theme and styles for Solid components automatically.
