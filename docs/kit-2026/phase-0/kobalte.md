# Phase 0. Kobalte upgrade map and v2 outlook

Goal of the program: make `@codeui/kit` the source of 100% of CodeImage's UI primitives and a kit other Solid apps can adopt without CodeImage's internal choices. This file is raw material for that. It changes no code.

Evidence labels:

- **measured** means output of a command run for this file (`npm view`, `npm pack` + inspection of the tarball, `grep`, `git`).
- **read** means a fetched URL or a repo file read at the cited `path:line`.
- **inferred** means my reasoning from measured or read facts. Treat it as a hypothesis.

Paths are relative to the repo root unless absolute. `kit/` means `packages/kit/`.

Sources fetched:

- [CL0] https://raw.githubusercontent.com/kobaltedev/kobalte/main/packages/core/CHANGELOG.md
- [CL2] https://raw.githubusercontent.com/kobaltedev/kobalte/solid2/packages/core/CHANGELOG.md
- [MIG] https://raw.githubusercontent.com/kobaltedev/kobalte/solid2/MIGRATION.md
- [V2X] https://raw.githubusercontent.com/kobaltedev/kobalte/solid2/apps/docs/src/routes/docs/changelog/2-0-x.mdx
- [PR708] https://patch-diff.githubusercontent.com/raw/kobaltedev/kobalte/pull/708.diff
- [BR] https://api.github.com/repos/kobaltedev/kobalte/branches?per_page=100
- [REL] https://api.github.com/repos/kobaltedev/kobalte/releases?per_page=10
- [VE-SRC] https://raw.githubusercontent.com/kobaltedev/kobalte/main/packages/vanilla-extract/src/index.ts
- [VE-PKG2] https://raw.githubusercontent.com/kobaltedev/kobalte/solid2/packages/vanilla-extract/package.json
- [VE-LOG] https://api.github.com/repos/kobaltedev/kobalte/commits?path=packages/vanilla-extract (main and `sha=solid2`)
- [TAR013] `npm pack @kobalte/core@0.13.14`, [TAR2] `npm pack @kobalte/core@2.0.0-alpha.4`, [TARU2] `npm pack @kobalte/utils@2.0.0-alpha.1`, all unpacked in the session scratchpad, not in the repo.

## 1. Versions on npm

| Package | Kit range (`kit/package.json`) | Locked in `pnpm-lock.yaml` | Latest 0.x | 2.x prerelease | Peer `solid-js` of latest 0.x | Peer of 2.x prerelease |
| --- | --- | --- | --- | --- | --- | --- |
| `@kobalte/core` | `^0.13.6` (`kit/package.json:72`) | `0.13.6(solid-js@1.8.22)` (`pnpm-lock.yaml:71`) | `0.13.14`, 2026-09-07 | `2.0.0-alpha.4` (dist-tag `alpha`), 2026-10-20 | `^1.9.8` | `solid-js 2.0.0-rc.16` + `@solidjs/web 2.0.0-rc.16`, exact pins |
| `@kobalte/utils` | `^0.9.1` (`kit/package.json:73`) | `0.9.1` (`pnpm-lock.yaml:74`) | `0.9.2`, 2026-06-30 | `2.0.0-alpha.1` (dist-tag `alpha`), 2026-10-20 | `^1.8.8` | `solid-js 2.0.0-rc.16` + `@solidjs/web 2.0.0-rc.16` |
| `@kobalte/vanilla-extract` | `^0.5.0` (`kit/package.json:74`) | `0.5.0` | `0.5.0`, 2023-08-25 | none | none (peer is `@vanilla-extract/css ^1.13.0`) | n/a |

All rows are **measured** with `npm view <pkg> versions time dist-tags` and `npm view <pkg>@<v> peerDependencies`.

Peer `solid-js` of `@kobalte/core` over the 0.13 line (**measured**): `^1.8.15` from 0.13.6 through 0.13.12, then `^1.9.8` from 0.13.13. 2.0.0-alpha.0 pinned `2.0.0-rc.0`, alpha.4 pins `2.0.0-rc.16`.

Other facts:

- The 2.x line ships from the `solid2` branch. `main` still carries 0.13.x (**read**, [BR] lists `main`, `solid2`, `v2/chip`, `v2/tags-inputs`; [CL0] tops out at 0.13.14).
- [V2X] states v2.0.0 will peer on `solid-js@^2.0.0`. Today's alpha pins an exact RC (**measured**). Every Solid RC bump forces a Kobalte bump until 2.0 final (**inferred**).
- `packages/storybook/package.json:38` asks for `@kobalte/core ^0.12.6`. The lockfile resolves it to `0.12.6` (`pnpm-lock.yaml:163-165`). The repo therefore installs two Kobalte copies (**measured**).
- CodeImage already runs 0.13.11 (from the brief). That is the version just before the `^1.9.8` peer bump (**measured** above).

## 2. Changelog 0.13.6 to 0.13.14 and kit impact

No entry in [CL0] between 0.13.7 and 0.13.14 is labelled breaking. All are "Patch Changes" (**read**). The table lists every entry that changes behavior or contracts, plus additive entries grouped, and greps the kit for each.

| Ver | Change ([CL0], **read**) | Kit impact |
| --- | --- | --- |
| 0.13.7 | ToggleGroup root value type (#479) | No impact. The kit does not import `toggle-group` (**measured**, grep `@kobalte` in `kit/src`). |
| 0.13.7 | Collapsible close animation on default open (#483) | No impact (**measured**). |
| 0.13.7 | Toast filters dismissed toasts (#489) | No impact (**measured**). |
| 0.13.8 to 0.13.10 | New FileField, Badge, Meter, Color* (6), Search, SegmentedControl | Additive. Kobalte's `SegmentedControl` overlaps the kit's own one built on Tabs (`kit/src/components/SegmentedControl/SegmentedControl.tsx:1`). Migrating to it is a choice, not a break (**inferred**). |
| 0.13.11 | `createInteractOutside` accepts other Element types (#612) | Touches every dismissable layer. `kit/src/components/Dialog/Dialog.tsx:26`, `kit/src/components/Popover/Popover.tsx:48`, `kit/src/components/Dropdown/Dropdown.tsx:19`, `kit/src/components/Select/Select.tsx:144`. Bug fix. Low risk (**inferred**). |
| 0.13.11 | Meter, Progress, Image, ToggleGroup, ColorArea, ColorChannelField, color parsing fixes | No impact (**measured**). |
| 0.13.12 | `preventScroll` when focusing hidden inputs (#647) | `kit/src/components/CheckBox/CheckBox.tsx:58`, `kit/src/components/RadioList/RadioList.tsx:45`, the hidden select inside `kit/src/components/Select/Select.tsx:88`. Focus no longer scrolls the page to the hidden input. Visible improvement in long forms (**inferred**). |
| 0.13.12 | DismissableLayer guards `isTopMostLayer` against empty array (#650) | Same overlay sites as #612. Crash fix (**inferred**). |
| 0.13.12 | NavigationMenu mobile, ContextMenu `onContextMenu` | No impact (**measured**). |
| 0.13.12 | Tooltip exposes `onCurrentPlacementChange`; new Rating, TimeField | Additive. `kit/src/components/Tooltip/Tooltip.tsx:42` spreads `others` into `KTooltip`, so the new prop passes through with no change (**read**). |
| 0.13.12 | `@kobalte/utils` 0.9.2 | Kit range `^0.9.1` already accepts it (`kit/package.json:73`, **read**). |
| 0.13.13 | **Peer `solid-js` becomes `^1.9.8`** | Breaking for the kit's consumers. The kit declares peer `^1.7.0` (`kit/package.json:68`) and develops on `^1.8.22` (`kit/package.json:61`), locked to 1.8.22. A bump to 0.13.13+ means raising both to `^1.9.8` (**measured** + **inferred**). |
| 0.13.13 | Defer `aria-hidden` in `ariaHideOutside` (#700) | Modal Dialog `kit/src/components/Dialog/Dialog.tsx:40` and Popover/Dropdown if modal. Removes a focus warning (**inferred**). |
| 0.13.13 | Tabs indicator skips animation on initial render (#704) | `kit/src/components/Tabs/Tabs.tsx:55` and `:84`, `kit/src/components/SegmentedControl/SegmentedControl.tsx:95`. The kit's SegmentedControl also writes `width`/`transform` on the indicator itself (`SegmentedControl.tsx:66-67`). Check the first-paint indicator position visually after the bump (**inferred**). |
| 0.13.13 | Escape in selectable collections now calls `preventDefault` only when empty selection is allowed ([PR708] `create-selectable-collection.ts`, **read**) | `kit/src/components/Listbox/Listbox.tsx:29` and the listbox inside `kit/src/components/Select/Select.tsx:145`. With `disallowEmptySelection`, Escape now bubbles. A Listbox inside a Dialog or Popover may close the overlay on Escape where it did not before (**inferred**). |
| 0.13.13 | Tooltip trigger gets `type="button"` ([PR708] `tooltip-trigger.tsx`, **read**) | `kit/src/components/Tooltip/Tooltip.tsx:43` renders the trigger `as={"div"}`. The div now carries a meaningless `type="button"` attribute. Harmless, but the polymorphic types now include `type` (**inferred**). |
| 0.13.13 | Select calls `onChange` only when changed ([PR708] `select-root.tsx`: `if (val === value()) return;`, **read**) | `kit/src/components/Select/Select.tsx:88-89` spreads user `onChange` into `KSelect`; `kit/src/components/Select/createSelectValue.ts:88` wraps it. Re-selecting the current option no longer fires. The check is reference equality on the selection array, so it may rarely trigger (**inferred**). |
| 0.13.13 | Form control label `for` attribute set during SSR ([PR708] `createRenderEffect` in `create-form-control-field.tsx`, **read**) | `kit/src/components/TextField/TextFieldLabel.tsx:9`, `kit/src/components/TextArea/TextAreaLabel.tsx:9`, `kit/src/components/NumberField/NumberFieldLabel.tsx:9`, `kit/src/components/Select/Select.tsx:99`, `kit/src/components/CheckBox/CheckBox.tsx:67`, `kit/src/components/RadioList/RadioList.tsx:29`. SSR HTML changes. Kit SSR tests (`test:ssr` script) may need snapshot updates (**inferred**). |
| 0.13.13 | Combobox clears input on blur; Export `Menu`, `DismissableLayer` | No Combobox in the kit (**measured**). New exports are additive. |
| 0.13.14 | Preserve `aria-hidden` during modal handoff (#721) | Dialog opening a Dropdown or Popover, `kit/src/components/Dialog/Dialog.tsx:40` (**inferred**). |
| 0.13.14 | Interact-outside across shadow boundaries (#722) | Same overlay sites as #612. Bug fix (**inferred**). |
| 0.13.14 | Combobox no filter reset on blur | No impact (**measured**). |

Kobalte modules the kit imports today (**measured**, grep `@kobalte/core/` in `kit/src`): `button`, `checkbox`, `dialog`, `dropdown-menu`, `link`, `listbox`, `popover`, `radio-group`, `select`, `tabs`, `text-field`, `tooltip`, plus `polymorphic` and `primitives/create-controllable-signal` (`kit/src/components/NumberField/NumberField.tsx:34`). All exist in 0.13.14 (**measured**, [TAR013] `dist/` and `dist/primitives/`).

Net upgrade cost to 0.13.14 (**inferred**): raise the Solid peer and dev dep, rerun SSR tests, eyeball Tabs and SegmentedControl indicator, test Escape inside overlays. No source edits are forced.

## 3. Kobalte 0.13.14 components the kit does not wrap

Source of the list: [TAR013] `package.json` exports `./*` map to `dist/*/index`, and the `dist/` directories are the public subpaths (**measured**). Non-component helpers (`i18n`, `colors`, `color-mode`, `polymorphic`, `primitives`) are excluded.

Wrapped by the kit (12): Button, Checkbox, Dialog, DropdownMenu, Link, Listbox, Popover, RadioGroup, Select, Tabs, TextField, Tooltip (**measured**).

Not wrapped (35 components, **measured**):

| Group | Components |
| --- | --- |
| Disclosure and layout | Accordion, Collapsible, Separator, Skeleton, Image, Badge, Breadcrumbs |
| Feedback | Alert, AlertDialog, Toast, Progress, Meter |
| Overlays and menus | ContextMenu, HoverCard, Menubar, NavigationMenu |
| Form inputs | Combobox, Search, Switch, Slider, SpinButton, NumberField, TimeField, FileField, Rating, ToggleButton, ToggleGroup, SegmentedControl, Pagination |
| Color | ColorArea, ColorChannelField, ColorField, ColorSlider, ColorSwatch, ColorWheel |

Low-level primitives also exported and not wrapped (3): `menu`, `dismissable-layer` (both exported since 0.13.13 per [CL0]), `popper` (**measured**).

Kit components with the same name built on something else (**read**):

- `NumberField` wraps Kobalte `text-field` plus Maskito (`kit/src/components/NumberField/NumberField.tsx:1-2`) and a Kobalte internal primitive (`:34`), not Kobalte `number-field`.
- `SegmentedControl` wraps Kobalte `tabs` (`kit/src/components/SegmentedControl/SegmentedControl.tsx:1`), not Kobalte `segmented-control`.
- `Pagination` uses `@solid-primitives/pagination` (`kit/package.json` dep), not Kobalte `pagination`.

v2 alpha.4 adds more modules absent from 0.13.14: Calendar, Card, DateField, DatePicker, Divider, Drawer, OTPField, Resizable, Statistic, Steps (**measured**, [TAR2] `dist/`; [V2X] and [CL2] describe them, **read**).

## 4. Kobalte v2 for Solid 2

Kobalte v2 is a port of the same component set to Solid 2.0 ([V2X] "All components ported to the Solid 2.0 API", **read**). It is alpha. The tables below list what changes and whether the kit uses it.

### 4a. What stays

| Pattern | v2 status | Kit usage |
| --- | --- | --- |
| Polymorphic `as` prop | Kept. `PolymorphicAttributes { as?: T \| keyof JSX.HTMLElementTags }`, `PolymorphicProps`, `PolymorphicCallbackProps` still exported from `@kobalte/core/polymorphic`, now typed from `@solidjs/web` (**measured**, [TAR2] `dist/index/CFIwL2Gi.d.ts`). | `as={"div"}` at `kit/src/components/Tooltip/Tooltip.tsx:43`; `as={IconButton}` at `kit/src/components/Dialog/Dialog.tsx:49`; `PolymorphicProps` imported in 12 files (**measured**). |
| `asChild` | Kobalte has never had `asChild`. v2 does not add it (**measured**, no `asChild` in [TAR2] polymorphic types). | Not used (**measured**). |
| Subpath imports `@kobalte/core/<name>` | Kept. Exports map `./*` (**measured**, [TAR2] `package.json`). | All kit imports use subpaths (**measured**). |
| Compound API names (`Tabs.Indicator`, `Select.Item`, `DropdownMenu.SubTrigger`, ...) and exported prop types the kit imports | Every non-aliased name the kit imports from `@kobalte/core/*` appears in [TAR2] `.d.ts` files (**measured**, 36 names checked). | All wrappers. |
| `data-*` state attributes (`data-expanded`, `data-selected`, `data-highlighted`, `data-disabled`, `data-invalid`, `data-checked`, `data-closed`, `data-pressed`, `data-readonly`, `data-orientation`) | Still emitted. Each appears in as many or more JS files in v2 as in 0.13.14 (**measured**, grep over both tarballs). | Basis of all `componentStateStyles` calls (section 5). |

### 4b. What changes or disappears

| Pattern | Solid 2 / Kobalte v2 change | Kit usage today |
| --- | --- | --- |
| `JSX`, `ValidComponent`, `ComponentProps` imports | Move from `solid-js` to `@solidjs/web` ([MIG] "Import paths", **read**). JSX import source becomes `@solidjs/web` ([V2X], **read**). | 22 files import `JSX`/`JSXElement`/`ValidComponent`/`ComponentProps` from `solid-js` (**measured**), e.g. `kit/src/components/Dropdown/Dropdown.tsx:14`, `kit/src/components/Tabs/Tabs.tsx:11`, `kit/src/foundation/text.ts:2`. |
| `splitProps` | Renamed `omit` ([MIG] "Renamed helpers", **read**). | 22 files (**measured**), e.g. `kit/src/components/Tabs/Tabs.tsx:25`, `kit/src/components/Select/Select.tsx:61`, `kit/src/utils/animation.ts:103`. |
| `mergeProps` | Renamed `merge` ([MIG], **read**). | 6 files (**measured**): `kit/src/components/Pagination/Pagination.tsx:18`, `kit/src/components/Tooltip/Tooltip.tsx:16`, `kit/src/components/NumberField/NumberField.tsx:60`, `kit/src/components/Field/FieldLabel/createFieldLabelProps.ts:9`, `kit/src/components/Field/FieldMessage/createFieldMessageProps.ts:10`, `kit/src/components/Field/FieldError/createFieldErrorMessageProps.ts:13`. Two of them reassign `props = mergeProps(...)` (`Pagination.tsx:18`, `Tooltip.tsx:16`). |
| `Context.Provider` | Gone. Use `<Context value>` ([MIG] "Context", [V2X], **read**). | `kit/src/components/Tabs/Tabs.tsx:29`, `kit/src/components/SegmentedControl/SegmentedControl.tsx:79`, `kit/src/utils/animation.ts:106` (via `createComponent(AnimationContext.Provider, ...)`) (**measured**). |
| `createContext`/`useContext` | Still the access path (no change listed in [MIG], **read**). | `kit/src/components/Tabs/Tabs.tsx:18,47`, `kit/src/components/SegmentedControl/SegmentedControlContext.tsx:11,14`, `kit/src/utils/animation.ts:20,104,120` (**measured**). |
| `createEffect(fn)` and `on(...)` | Split form `createEffect(compute, apply)`; cleanup returned from apply instead of `onCleanup` ([MIG] "Effects", **read**). | `kit/src/components/Pagination/Pagination.tsx:35-43` (two `createEffect(on(...))`), `kit/src/utils/animation.ts:67-71` (nested `createEffect(on(...))`), `kit/src/utils/maskito.ts:20-28` (effect with `onCleanup`) (**measured**). |
| Signal writes inside effects, memos, or component bodies | Throw `SIGNAL_WRITE_IN_OWNED_SCOPE` in dev ([MIG] "Signals", **read**). | `kit/src/components/Pagination/Pagination.tsx:38` calls `setPage` inside an effect. `kit/src/components/SegmentedControl/SegmentedControlItem.tsx:18-20` writes the context `items` signal from `onMount`/`onCleanup` (`SegmentedControlContext.tsx:28,31`). Whether `onSettled` counts as owned scope is not stated in [MIG] (**inferred**, needs a Solid 2 test). |
| `onMount` | Renamed `onSettled` ([MIG], **read**). | `kit/src/components/SegmentedControl/SegmentedControlItem.tsx:18`, `kit/src/components/SegmentedControl/SegmentedControl.tsx:70`, `kit/src/components/NumberField/NumberField.tsx:120` (**measured**). |
| `batch` | Removed; writes auto-batch ([MIG], **read**). | `kit/src/components/NumberField/NumberField.tsx:171`, `:216` (**measured**). |
| Store `produce`, `unwrap` | Draft-first setters; `unwrap` becomes `snapshot` ([MIG], **read**). | Not used (**measured**). `statebuilder` is a declared dep (`kit/package.json`) but not imported in `kit/src` (**measured**). |
| `createComputed`, `<Index>`, `classList`, `<Suspense>`, `<ErrorBoundary>` | Removed or replaced ([MIG], [V2X], **read**). | Not used (**measured**). |
| Camel-case HTML attributes (`tabIndex`, `readOnly`, `autoComplete`, `spellCheck`, `inputMode`, `enterKeyHint`, `contentEditable`, `autoCorrect`) | Lowercase only ([MIG] "HTML attributes", **read**). | Not used in `kit/src` (**measured**). |
| `createControllableSignal` from `@kobalte/core/primitives/create-controllable-signal` | Removed. v2 uses `@solid-primitives/controlled-signal` ([V2X], **read**). [TAR2] `dist/primitives/` has no `create-controllable-signal` (**measured**). | `kit/src/components/NumberField/NumberField.tsx:34`, `:76` (**measured**). Hard break. |
| `createTransition` primitive | Removed ([V2X], **read**). | Not used (**measured**). |
| `@kobalte/utils` helpers | v2 exports only 15 symbols: `callHandler`, `composeEventHandlers`, `getScrollParent`, `clamp`, `roundToStepPrecision`, `getPrecision`, `snapValueToStep`, `Point`, `Polygon`, `isPointInPolygon`, `debugPolygon`, `visuallyHiddenStyles`, `ValidationState`, `Orientation`, `RangeValue` (**measured**, [TARU2] `dist/index.d.ts`). `access`, `MaybeAccessor`, `mergeRefs`, `isNumber` are gone. | `access`, `MaybeAccessor` at `kit/src/utils/maskito.ts:1`; `mergeRefs` at `kit/src/components/SegmentedControl/SegmentedControlItem.tsx:5` and `kit/src/components/NumberField/NumberField.tsx:2`; `isNumber` at `kit/src/components/NumberField/formatNumber.ts:15`; `clamp` at `NumberField.tsx:2` survives (**measured**). |

Third-party deps the kit pairs with Kobalte also need Solid 2 builds: `@motionone/solid`, `@tanstack/solid-virtual`, `@solid-primitives/pagination`, `@solid-primitives/scheduled` (`kit/package.json` deps, **read**). Their Solid 2 status was not checked in this lane (**inferred** gap).

### 4c. Write new components this way from now on

These rules keep new code cheap to port and do not need Solid 2 to apply today (**inferred** from 4b).

1. Do not import from `@kobalte/core/primitives/*` or any non-public Kobalte path. Use `@solid-primitives/*` (for example `controlled-signal`) or local code.
2. From `@kobalte/utils`, import only symbols in the v2 list above. Write local `access` and `mergeRefs` helpers, or use `@solid-primitives/refs` and `@solid-primitives/utils`.
3. Do not write signals inside `createEffect`, `createMemo`, `onMount`, or the component body. Derive with `createMemo`, or write from event handlers.
4. Do not use `batch`, `createComputed`, `<Index>`, `classList`, `produce`, or `unwrap` in new code.
5. Keep every effect in compute-then-apply shape. Read in one function, side effect in another, return cleanup. In Solid 1 that is `createEffect(on(source, apply))`, which maps one to one to the split form.
6. Use lowercase HTML attributes (`tabindex`, `readonly`) on native elements and in polymorphic render-prop interfaces.
7. Never reassign `props = mergeProps(...)`. Bind to a new name.
8. Keep `.Provider` usage in one place per context, so the switch to `<Context value>` is a single edit.
9. Keep the wrapper pattern: compound Kobalte parts, `PolymorphicProps<T, ...>`, `as` for element swap. That surface is unchanged in v2.
10. Import `JSX` and `ValidComponent` through one local re-export module, so the `solid-js` to `@solidjs/web` move is one line.

## 5. `@kobalte/vanilla-extract`

Status:

- Last npm publish is 0.5.0 on 2023-08-25. npm `time.modified` is 2024-10-08. No 2.x or alpha tag (**measured**, `npm view @kobalte/vanilla-extract time dist-tags`).
- Source still lives in the monorepo on both `main` and `solid2` at version 0.5.0 ([VE-PKG2], **read**). The last commits touching it on `main` are from 2024-06-18 (formatter, source exports). On `solid2` the last are a 2026-10-14 "new solid compiler" commit and a 2026-07-30 branch merge ([VE-LOG], **read**). None of those changes produced a release (**measured**, npm versions).
- The package has no Solid dependency. Its only peer is `@vanilla-extract/css ^1.13.0` (**measured**). [VE-SRC] shows it builds `&[data-<state>]` selectors for `valid`, `invalid`, `required`, `disabled`, `readonly`, `checked`, `indeterminate`, `selected`, `pressed`, `expanded`, `closed`, `highlighted`, `current`, with `not` and `parentSelector` options (**read**).
- So it works with Kobalte v2 as long as v2 keeps those attributes, which section 4a shows it does (**inferred**). It is unmaintained but small and framework-agnostic.

Kit usage. `componentStateStyles` is the only import, used in 11 style files (**measured**):

- `kit/src/components/Button/Button.css.ts:1`, call at `:83`
- `kit/src/components/Dialog/Dialog.css.ts:7`, call at `:132`
- `kit/src/components/Dropdown/Dropdown.css.ts:3`, calls at `:61`, `:116`
- `kit/src/components/Field/Field.css.ts:4`, calls at `:48`, `:58`, `:123`
- `kit/src/components/Listbox/Listbox.css.ts:4`, call at `:130`
- `kit/src/components/Popover/Popover.css.ts:1`, call at `:60`
- `kit/src/components/RadioList/Radio.css.ts:4`, call at `:125`
- `kit/src/components/Select/Select.css.ts:3`, calls at `:78`, `:132`
- `kit/src/components/SegmentedControl/SegmentedControl.css.ts:5`, calls at `:44`, `:196`
- `kit/src/components/Tabs/Tabs.css.ts:4`, call at `:56`
- `kit/src/components/Tooltip/Tooltip.css.ts:5`, call at `:59`

That is 16 call sites (**measured**). States used include `disabled`, `highlighted`, `expanded`, `selected`, `invalid`, `checked`, plus `not` (**measured**, grep of the call bodies).

Option (**inferred**): vendor the 97 lines of [VE-SRC] (**measured**, `wc -l`) into the kit, or into `packages/vanilla-extract` (the local helper package, `packages/vanilla-extract/package.json`, private, today a Vite plugin and build helpers). That removes a dead external dependency for adopters.

## 6. The `link:` dependency in `@codeui/kit@0.1.5`

`npm view @codeui/kit@0.1.5 dependencies` lists (**measured**):

```
'example-basic': 'link:/Users/riccardoperra/WebstormProjects/pipelineui/packages/app'
```

Where it comes from:

- It is in the repo today at `kit/package.json:87` under `dependencies` (**read**).
- `git log -S example-basic -- packages/kit/package.json` finds one commit: `f6f7056` "fix types", 2024-10-20, which added the line alongside Select type fixes (**measured**).
- `git tag --contains f6f7056` returns `@codeui/kit@0.1.3`, `0.1.4`, `0.1.5`. Every release since 0.1.3 (published 2024-10-20) ships it (**measured**).
- `pnpm-lock.yaml:114-116` records it as `link:../../../pipelineui/packages/app`, a sibling checkout of another project on the author's machine (**read**).
- Nothing in `kit/src` imports `example-basic` (**measured**). The only other hit is the ignored build log `kit/.turbo/turbo-build.log:26`, where it appears in Rollup's list of externals derived from `dependencies` (**read**).

Conclusion (**inferred**): a `pnpm add`/`pnpm link` run from the wrong directory while working on pipelineui leaked into the kit manifest. It is dead weight. Consumers that respect `link:` in published deps get an unresolvable entry. Remove it from `kit/package.json:87` and the lockfile in the first code phase.
