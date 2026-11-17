# @codeui/styles

Inkstone CSS for HTML and Solid applications. The package ships standard CSS, pure class helpers, and token references. It has no framework peers or style injection runtime.

## Load CSS

Solid components from `@codeui/kit` load their CSS and theme automatically. For CSS-only consumers, load the theme and the stylesheets you use.

```js
import "@codeui/styles/theme.css";
import "@codeui/styles/button.css";
import { button } from "@codeui/styles/button";
```

`all.css` includes the theme and every component. Use it as a single import when selection by component is unnecessary.

```js
import "@codeui/styles/all.css";
```

The CSS exports work without a bundler. Serve the package's `dist` files as static assets.

```html
<link rel="stylesheet" href="/assets/codeui/theme.css" />
<link rel="stylesheet" href="/assets/codeui/button.css" />

<div data-cui-theme="light">
  <button
    class="cui-button" data-size="md" data-theme="primary"
  >
    Save changes
  </button>
</div>
```

Add the native `disabled` attribute to disable the button. Native controls also accept the existing `data-disabled` state. CSS styles state and appearance. Your application supplies events, focus management, accessible names, and behavior for custom controls and overlays.

## Use class helpers

Each component has a JavaScript entry with its existing raw style exports. Pilot helpers return a stable part class plus private variant classes. Explicit variant attributes take precedence over helper classes.

```js
import { button, buttonVars } from "@codeui/styles/button";
import { switchParts, switchStyles } from "@codeui/styles/switch";

button({ size: "md", theme: "primary" });
switchStyles.control({ size: "sm" });
```

Parts contracts retain existing `data-cui` values. For example, `switchParts.control` is `switch-control`. Non-native state uses the documented `data-*` attributes. Recipe helpers expose their supported groups through `variants()` and their classes through `classNames`.

`@codeui/styles/public-registry.json` defines the stable pilot contract for Button, IconButton, Switch and Dialog: part names, variants, defaults, state placement and local variables. The other 36 components retain legacy emission during migration. `contract.json` records helper output and variable references, including private compiler classes; those private names are not an application contract. `@codeui/styles/manifest.json` lists each CSS entry's component and module dependency closure. The `internal/` exports support `@codeui/kit` and are not application API.

## Customize tokens and geometry

```css
[data-cui-theme="dark"] {
  --cui-action-brand-base: #4f8cff;
  --cui-radius-scale: 1.2;
}
```

Semantic tokens retain their `--cui-*` names. Component variable objects contain CSS `var(--…)` references. Set the corresponding custom property on the component or its ancestor. Defaults assigned by a component class still participate in the cascade.

Custom overlay and progress implementations supply these neutral geometry inputs where needed.

| CSS input                               | Value                             |
| --------------------------------------- | --------------------------------- |
| `--cui-popper-anchor-width`             | Anchor width                      |
| `--cui-popper-content-available-height` | Available overlay height          |
| `--cui-popper-content-transform-origin` | Overlay transform origin          |
| `--cui-progress-fill-width`             | Progress width, such as `50%`     |
| `--cui-toast-progress-fill-width`       | Toast timer width                 |
| `--cui-toast-swipe-move-x`              | Current horizontal swipe distance |
| `--cui-toast-swipe-end-x`               | Final horizontal swipe distance   |

`@codeui/kit` maps its engine geometry to these inputs. A theme scope must contain portal content or its host to pass inherited brand, radius, and component overrides.

All CSS lives under `cui`, with the fixed inner order `cui.tokens`, `cui.base`, `cui.components`. The field label uses `base`. IconButton and Dialog close explicitly compose Button in the component layer. Pilot selectors use whole-selector `:where()` wrappers. Unlayered application CSS overrides normal library rules. With Tailwind, establish `@layer cui, utilities;` before loading styles so utility rules follow the kit.

## Build and verify

```sh
pnpm --filter @codeui/styles build
pnpm --filter @codeui/styles check
pnpm --filter @codeui/styles typecheck
```

The build extracts `.css.ts` sources through the official vanilla-extract integration, gathers CSS by module scope, and emits each component's dependency closure. ESM and CommonJS helpers contain compiled strings and recipe maps. Consumers do not install a vanilla-extract plugin.

`entries.json` owns component modules and dependencies. `compatibility.json` owns the exact private module paths used by the Solid adapter. Package exports, declaration wrappers, and manifests are generated from those files. Named identifiers use explicit source names rather than file paths or extraction order.

A build fails if the public CSS contract changes. To accept an intentional contract change, review the names and run `pnpm --filter @codeui/styles build --update-contract`. Commit the updated `contract.json` with the source change.
