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
    class="cui-button-button"
    data-size="md"
    data-theme="primary"
  >
    Save changes
  </button>
</div>
```

Add the native `disabled` attribute to disable the button. Native controls also accept the existing `data-disabled` state. CSS styles state and appearance. Your application supplies events, focus management, accessible names, and behavior for custom controls and overlays.

## Use class helpers

Each component has a JavaScript entry with its class helpers. Set the variant attributes on the element that receives the class.

```js
import { button } from "@codeui/styles/button";

const element = document.createElement("button");
element.className = button();
element.dataset.size = "md";
element.dataset.theme = "primary";
```

Parts contracts retain existing `data-cui` values. For example, `switchParts.control` is `switch-control`. Non-native state uses the documented `data-*` attributes. Use the class helpers with variant attributes such as `data-size="md"` and `data-theme="primary"`.

`@codeui/styles/contract.json` lists public classes, part names, base part classes, and variable references. `@codeui/styles/manifest.json` lists each CSS entry's component and module dependency closure. The `internal/` exports support `@codeui/kit` and are not application API.

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

All component rules live under `cui`. The build puts the shared order `cui.base`, `cui.components`, and `cui.overrides` at the start of every CSS entry, so any entry can load first. In source, wrap rules in the appropriate layer block. The field label uses `base`. IconButton uses `overrides`, so its padding wins over Button in either import order. Unlayered application CSS can override normal library rules.

## Build and verify

```sh
pnpm --filter @codeui/styles... build
pnpm --filter @codeui/styles check
pnpm --filter @codeui/styles typecheck
```

Component rules live in `css/`. Write variant selectors as `:where(.part)[data-size="sm"]` and compound selectors as `.part:where([data-tone="info"][data-variant="outline"])`. TypeScript files in `src/` export the class helpers, variant types, and token references.

The build bundles each entry and its dependencies. Lightning CSS lowers nesting and media query ranges, and expands `@custom-media` aliases from the breakpoint tokens and `css/media.css`. Use `@media (--cui-md)` for a shared width and `@media (--cui-reduced-motion)` for the reduced-motion preference.

The shared foundation comes from `@codeui/inkstone`. The build bundles its theme into the existing `theme.css` entry. `tokens/components.resolver.json` lists the local aliases, which Toghen resolves against the Inkstone foundation. The virtual `<component>-tokens.generated.css` import identifies the token set and loads the shared media aliases. The build inserts each custom property into the rule that reads it before passing the stylesheet to Lightning CSS.

Build with Node 24 or later and the workspace pnpm version. Run `pnpm --filter @codeui/styles... build` to build Inkstone first.

`entries.json` declares component entries and dependencies. `style-sources.json` maps helper modules to their stylesheet sources. `compatibility.json` lists the private paths used by the Solid adapter.

A build fails if the public CSS contract changes. To accept an intentional contract change, review the names and run `pnpm --filter @codeui/styles... build --update-contract`. Commit the updated `contract.json` with the source change.
