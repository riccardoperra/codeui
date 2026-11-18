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
    class="cui-button"
    data-size="md"
    data-variant="primary"
  >
    Save changes
  </button>
</div>
```

Add the native `disabled` attribute to disable the button. Native controls also accept the existing `data-disabled` state. CSS styles state and appearance. Your application supplies events, focus management, accessible names, and behavior for custom controls and overlays.

`theme.css` sizes every element with a `cui-` class, and its `::before` and `::after`, with `box-sizing: border-box`. A control's height then includes its padding and border without a page reset, so controls of the same size line up. The rule sits in `@layer cui.base` at zero specificity, so any application style overrides it.

## Use class helpers

Each component has a JavaScript entry with its class helpers. Set the variant attributes on the element that receives the class.

```js
import { button } from "@codeui/styles/button";

const element = document.createElement("button");
element.className = button();
element.dataset.size = "md";
element.dataset.variant = "primary";
```

Parts contracts hold the `data-cui` values. For example, `switchParts.control` is `switch-control`. Non-native state uses the documented `data-*` attributes. Use the class helpers with variant attributes such as `data-size="md"` and `data-variant="primary"`.

## Apply appearance props

Each entry with appearance variants exports a `<component>StyleProps(options)` helper. It returns `class`, a `data-cui` part marker, and the variant attributes for one element. For components with variants on multiple elements, call the named part helpers as well.

```ts
import { applyStyleProps } from "@codeui/styles";
import { buttonStyleProps } from "@codeui/styles/button";
import { switchStyleProps } from "@codeui/styles/switch";

const save = buttonStyleProps({ variant: "primary", block: true, class: "checkout" });
const track = switchStyleProps.control({ size: "sm", class: "preview-track" });

applyStyleProps(document.querySelector("button")!, save);
```

Spread these props in Solid JSX or Svelte and use `v-bind` in Vue. In React, destructure `class` as `className` and spread the remaining attributes. For plain DOM or an Angular directive, call `applyStyleProps(element, props)` again when options change. It replaces the element's class with the returned class string, sets the marker and removes unset variant attributes. Pass any extra classes through `options.class`.

Set `data-cui-density="compact|comfortable|touch"` on a container to set the density of its subtree. Comfortable is the default, and a coarse pointer selects touch density automatically.

When CSS supports a named default, the helper emits that value and bare markup renders the same default with the attribute omitted. For example, Button emits `data-size="sm"`, Switch emits `data-size="md"`, and Sheet emits `data-side="bottom"`. Options without a named default omit the attribute. Boolean options emit an empty attribute when true and omit it otherwise. Stack's `wrap` accepts the strings `"true"` and `"false"` that CSS selects.

<!-- appearance:start -->

<!-- prettier-ignore -->
| Entry | Helper calls | Options |
| --- | --- | --- |
| `@codeui/styles/alert` | `alertStyleProps()` | `tone` `neutral`, `info`, `success`, `warning`, `danger` (default `neutral`) · `fluid` boolean |
| `@codeui/styles/badge` | `badgeStyleProps()` | `size` `sm`, `md` (default `sm`) · `tone` `neutral`, `info`, `success`, `warning`, `danger` (default `neutral`) · `variant` `soft`, `outline` (default `soft`) |
| `@codeui/styles/button` | `buttonStyleProps()` | `size` `xs`, `sm`, `md`, `lg` (default `sm`) · `variant` `primary`, `secondary`, `tertiary`, `negative`, `caution` · `ghost` boolean · `block` boolean · `pill` boolean |
| `@codeui/styles/checkbox` | `checkboxStyleProps()` (root) | `fieldSize` `xs`, `sm`, `md`, `lg`, `xl` (default `md`) |
| `@codeui/styles/checkbox` | `checkboxStyleProps.control()` | `size` `xs`, `sm`, `md`, `lg`, `xl` (default `md`) · `variant` `filled` |
| `@codeui/styles/combobox` | `comboboxStyleProps()` | `size` `sm`, `md` (default `sm`) |
| `@codeui/styles/dialog` | `dialogStyleProps()` (panel) | `size` `auto`, `xs`, `sm`, `md`, `lg`, `xl`, `full`, `settings`, `export` (default `auto`) · `chrome` `inset` |
| `@codeui/styles/dialog` | `dialogStyleProps.positioner()` | `panelSize` `auto`, `export`, `full` (default `auto`) · `chrome` `inset` |
| `@codeui/styles/dialog` | `dialogStyleProps.body()` | `layout` `default`, `split` (default `default`) |
| `@codeui/styles/dialog` | `dialogStyleProps.section()` | `variant` `group`, `well` (default `group`) · `columns` `2` |
| `@codeui/styles/field` | `fieldStyleProps()` | `size` `xs`, `sm`, `md`, `lg` (default `sm`) · `variant` `filled`, `inline` (default `filled`) |
| `@codeui/styles/iconbutton` | `iconButtonStyleProps()` | `size` `xs`, `sm`, `md`, `lg` (default `sm`) · `variant` `primary`, `secondary`, `tertiary`, `negative`, `caution` · `ghost` boolean · `block` boolean · `pill` boolean |
| `@codeui/styles/kbd` | `kbdStyleProps()` | `size` `sm`, `md` (default `sm`) · `variant` `keycap`, `hint` (default `keycap`) |
| `@codeui/styles/link` | `linkStyleProps()` | `variant` `default`, `underline` (default `default`) |
| `@codeui/styles/listbox` | `listboxStyleProps()` (list) | `variant` `primary`, `neutral` (default `neutral`) · `bordered` boolean |
| `@codeui/styles/listbox` | `listboxStyleProps.item()` | `size` `xs`, `sm`, `md` (default `sm`) |
| `@codeui/styles/listbox` | `listboxStyleProps.itemIndicator()` | `size` `xs`, `sm`, `md` (default `sm`) |
| `@codeui/styles/numberfield` | `numberFieldStyleProps()` (root) | `fieldSize` `xs`, `sm`, `md`, `lg` (default `sm`) |
| `@codeui/styles/numberfield` | `numberFieldStyleProps.input()` | `size` `xs`, `sm`, `md`, `lg` (default `sm`) · `variant` `filled`, `inline` (default `filled`) |
| `@codeui/styles/optioncard` | `optionCardStyleProps()` (root) | `orientation` `vertical` |
| `@codeui/styles/optioncard` | `optionCardStyleProps.itemLabel()` | `variant` `tile` |
| `@codeui/styles/optioncard` | `optionCardStyleProps.badge()` | `size` `sm`, `md` (default `sm`) · `tone` `neutral`, `info`, `success`, `warning`, `danger` (default `neutral`) · `variant` `soft`, `outline` (default `soft`) |
| `@codeui/styles/optioncard` | `optionCardStyleProps.item()` | `variant` `tile` |
| `@codeui/styles/popover` | `popoverStyleProps()` | `variant` `default`, `bordered` (default `default`) |
| `@codeui/styles/progress` | `progressStyleProps()` (root) | `size` `sm`, `md` (default `sm`) |
| `@codeui/styles/progress` | `progressStyleProps.track()` | `size` `sm`, `md` (default `sm`) |
| `@codeui/styles/radiolist` | `radioListStyleProps()` (items) | `size` `xs`, `sm`, `md`, `lg`, `xl` (default `md`) · `variant` `filled` · `orientation` `horizontal`, `vertical` (default `horizontal`) |
| `@codeui/styles/radiolist` | `radioListStyleProps.root()` | `fieldSize` `xs`, `sm`, `md`, `lg`, `xl` (default `md`) |
| `@codeui/styles/segmentedcontrol` | `segmentedControlStyleProps()` | `size` `xs`, `sm`, `md`, `lg` (default `sm`) · `accent` boolean · `variant` `solid`, `bordered` (default `solid`) · `fluid` boolean · `pill` boolean · `autoWidth` boolean |
| `@codeui/styles/select` | `selectStyleProps()` (trigger) | `size` `xs`, `sm`, `md`, `lg` (default `sm`) · `variant` `filled`, `inline` (default `filled`) |
| `@codeui/styles/select` | `selectStyleProps.root()` | `fieldSize` `xs`, `sm`, `md`, `lg` (default `sm`) |
| `@codeui/styles/settings` | `settingsStyleProps()` | `layout` `wide` · `compactControl` boolean |
| `@codeui/styles/sheet` | `sheetStyleProps()` | `side` `bottom`, `left`, `right` (default `bottom`) |
| `@codeui/styles/skeleton` | `skeletonStyleProps()` | `circle` boolean · `animate` boolean |
| `@codeui/styles/slider` | `sliderStyleProps()` (track) | `orientation` `horizontal`, `vertical` (default `horizontal`) |
| `@codeui/styles/slider` | `sliderStyleProps.fill()` | `orientation` `horizontal`, `vertical` (default `horizontal`) |
| `@codeui/styles/spinner` | `spinnerStyleProps()` | `size` `sm`, `md`, `lg` (default `md`) |
| `@codeui/styles/stack` | `stackStyleProps()` | `gap` `0`, `0.5`, `1`, `1.5`, `2`, `2.5`, `3`, `4`, `5`, `6`, `8`, `10`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `56`, `64`, `auto`, `px` (default `2`) · `align` `start`, `center`, `end`, `stretch`, `baseline` (default `stretch`) · `justify` `start`, `center`, `end`, `between`, `around`, `evenly` (default `start`) · `direction` `row`, `column` (default `column`) · `wrap` `true`, `false` (default `false`) |
| `@codeui/styles/switch` | `switchStyleProps()` (root) | `size` `sm`, `md` (default `md`) |
| `@codeui/styles/switch` | `switchStyleProps.input()` | `size` `sm`, `md` (default `md`) |
| `@codeui/styles/switch` | `switchStyleProps.control()` | `size` `sm`, `md` (default `md`) |
| `@codeui/styles/switch` | `switchStyleProps.thumb()` | `size` `sm`, `md` (default `md`) |
| `@codeui/styles/switch` | `switchStyleProps.label()` | `size` `sm`, `md` (default `md`) |
| `@codeui/styles/switch` | `switchStyleProps.description()` | `size` `sm`, `md` (default `md`) |
| `@codeui/styles/switch` | `switchStyleProps.errorMessage()` | `size` `sm`, `md` (default `md`) |
| `@codeui/styles/tabs` | `tabsStyleProps()` (root) | `orientation` `horizontal`, `vertical` (default `horizontal`) · `variant` `default`, `inline` (default `default`) |
| `@codeui/styles/tabs` | `tabsStyleProps.list()` | `orientation` `horizontal`, `vertical` (default `horizontal`) |
| `@codeui/styles/tabs` | `tabsStyleProps.indicator()` | `orientation` `horizontal`, `vertical` (default `horizontal`) |
| `@codeui/styles/text` | `textStyleProps()` | `size` `badge`, `caption`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl` (default `sm`) · `tone` `default`, `muted`, `hint`, `label`, `danger`, `success` (default `default`) · `weight` `normal`, `medium`, `semibold` (default `normal`) |
| `@codeui/styles/textarea` | `textAreaStyleProps()` (input) | `size` `xs`, `sm`, `md`, `lg` (default `sm`) · `variant` `filled`, `inline` (default `filled`) |
| `@codeui/styles/textarea` | `textAreaStyleProps.root()` | `fieldSize` `xs`, `sm`, `md`, `lg` (default `sm`) |
| `@codeui/styles/textfield` | `textFieldStyleProps()` (input) | `size` `xs`, `sm`, `md`, `lg` (default `sm`) · `variant` `filled`, `inline` (default `filled`) |
| `@codeui/styles/textfield` | `textFieldStyleProps.root()` | `fieldSize` `xs`, `sm`, `md`, `lg` (default `sm`) |
| `@codeui/styles/toast` | `toastStyleProps()` (root) | `tone` `neutral`, `info`, `success`, `warning`, `danger` (default `neutral`) |
| `@codeui/styles/toast` | `toastStyleProps.region()` | `position` `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right` (default `bottom-center`) |
| `@codeui/styles/tooltip` | `tooltipStyleProps()` | `variant` `primary`, `secondary` |
| `@codeui/styles/accordion` | `accordionStyleProps()` | `density` `default`, `compact`, `comfortable` (default `default`) |
| `@codeui/styles/table` | `tableStyleProps()` | `size` `sm`, `md` (default `md`) · `striped` boolean |

<!-- appearance:end -->

For field labels, descriptions and errors, put `fieldSize` on the enclosing field's root. The field subparts read `data-field-size` from that ancestor.

## Adapter contract

A behavior adapter supplies accessibility, event handlers, keyboard and focus management, and state attributes on the parts that use them. Native controls use `disabled` where applicable. The adapter also supplies the following selectors as needed by the component.

- `data-checked`, `data-selected`, `data-disabled`, `data-invalid`, `data-highlighted`, `data-focus`, and `data-hover` reflect interaction and form state.
- `data-expanded`, `data-open`, `data-opened`, `data-closed`, and `data-visible` reflect visibility and lifecycle. `data-loading` and `data-indeterminate` reflect pending work.
- `data-motion="none"` suppresses overlay motion. `data-cui-replaced` and `data-swipe` (`move`, `cancel`, `end`) reflect toast lifecycle and gesture state.
- Set `html[data-cui-input]` to `keyboard` or `pointer` based on the last input modality so keyboard focus and motion rules apply. When orientation also drives keyboard navigation or ARIA, keep the adapter's orientation in sync with the appearance options.

`@codeui/styles/contract.json` lists public classes, part names, base part classes, variable references, and the `$appearance` schema. `@codeui/styles/manifest.json` lists each CSS entry's component and module dependency closure. The `internal/` exports support `@codeui/kit` and are not application API.

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

The `$appearance` section of `contract.json` defines the options for each entry and part. `enum` lists the CSS attribute values and can specify an emitted `default`. `boolean` selects attribute presence. `use` refers to a canonical option in another entry. A CSS-only base value can name the rule that provides its styling. The build generates the helpers and their TypeScript declarations. Both build and check parse component selectors with Lightning CSS, checking attributes and values in both directions. After editing the schema, regenerate the README table with `node packages/styles/scripts/appearance.mjs --update-docs`.

A build fails if the public CSS contract changes. To accept an intentional contract change, review the names and run `pnpm --filter @codeui/styles build --update-contract`. Commit the updated `contract.json` with the source change.
