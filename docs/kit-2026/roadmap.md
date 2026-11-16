# @codeui/kit 2026 roadmap

`@codeui/kit` should supply every UI primitive CodeImage uses, and another Solid app should be able to install it without adopting CodeImage's build setup. This page proposes the PR sequence that gets there. It is built on the Phase 0 evidence in [`phase-0/`](./phase-0/). The PRs with an open decision wait for the maintainer.

## Phase 0 findings that set the order

| Finding | Evidence | Consequence |
| --- | --- | --- |
| The kit ships no CSS. Its `dist` holds 52 `.css.js` modules that still call `style()` and `recipe()`. A consumer must run vanilla-extract in its own build, and a plain Node import fails | [`baseline.md`](./phase-0/baseline.md), package health section. Measured | This is why CodeImage compiles styles in the browser (CodeImage audit UI-01). It is the main blocker for other apps, and the styling spike has to answer it |
| The published manifest carries `example-basic: link:<your machine>` and `@vanilla-extract/vite-plugin` as runtime dependencies. attw reports 46 type resolution errors | [`kobalte.md`](./phase-0/kobalte.md) section 6, `baseline.md`. Measured | Fix before any feature. The plugin is how a Vite advisory reaches CodeImage |
| `pnpm test` and `pnpm typecheck` fail at the root because `turbo` filters on a missing `playgrounds` folder. Storybook 8 needs a load hook under Node 26 | `baseline.md` commands table. Measured | No later PR can show green checks until this is fixed |
| Six kit API gaps explain every CodeImage workaround. They are Dialog title as string only, Popover parts not exported and the `<p>` wrapper, `RadioListItem` forwarding only `value`, TextField `aria-*` on the root, no class hook on the Select list, and SegmentedControl height and Escape | [`census.md`](./phase-0/census.md) finding 1. Read in source | In the last 64 hours CodeImage added 12 direct Kobalte dialog and popover imports against 3 kit ones. Closing the gaps stops the drift |
| The kit lacks 15 generic controls that `DESIGN.md` asks for | `census.md` finding 3 | New components come after the gaps are closed |
| Kobalte 0.13.6 to 0.13.14 has no labelled break, but six behavior changes touch kit files. `@kobalte/utils` 0.9.1 and 0.9.2 freeze when a menu trigger sits in a scrollable panel | `kobalte.md` section 2, [`threads.md`](./phase-0/threads.md) | The upgrade is its own PR, verified by keyboard tests |
| The preview and the kit agree on 2 semantic token roles and differ on 21. The accent is `#0099ff` in the preview and `#0072f5` in the kit | [`tokens.md`](./phase-0/tokens.md). Values measured, role mapping inferred | Token alignment changes how every component looks, so it is review-gated |
| Axe finds 816 violations, most of them Storybook page rules (`region`, `landmark-one-main`, `page-has-heading-one`). The component-level rules are `color-contrast`, `aria-allowed-attr`, `aria-input-field-name`, `select-name` and `label-content-name-mismatch` | `baseline.md` accessibility section. Measured | Gate on component rules only and track the page rules separately |

## Architecture

The kit has three layers. Each layer imports only the one below it.

| Layer | Import path | Contents | Who uses it |
| --- | --- | --- | --- |
| Engine | `@kobalte/core` | Behavior, focus, keyboard and ARIA | The kit only |
| Styled parts | `@codeui/kit/<component>`, e.g. `@codeui/kit/dialog` | Every Kobalte part with kit styles, a `data-cui` attribute and a `class` slot. Content is passed as children | An app that needs a layout the ready component does not offer |
| Ready components | `@codeui/kit` | Today's components with today's signatures, rebuilt from the styled parts. They keep the guardrails | Most callers, CodeImage included |

The styled-parts layer has two more exports per component.

- **Styles.** `<component>Styles`, one class function per part, as `buttonStyles` and six others already do. The shape is `part(variants) => className` with a stable `data-cui` attribute, so the API survives a change of styling engine. This lets an app put kit styles on its own elements or on raw Kobalte parts.
- **Props helpers.** Functions like the existing `createBaseFieldProps`, `createFieldLabelProps` and `createSelectOptions`. They wire kit concerns such as label, description, error and option lists. They do not reimplement focus, keyboard or ARIA behavior, which stays in Kobalte.

Ready components get two customization points before a caller needs the parts.

- **Content props accept JSX.** `title`, `description` and similar props take `JSX.Element`, not `string`. A string still works, so this is not a break.
- **`classes` per part.** Keys match the `data-cui` part names, e.g. `classes={{ panel, title, overlay }}`. This closes the portaled-part gap without `getElementById` or `:has()` overrides.

Anything beyond these two, such as a different structure, uses the styled parts. The kit has no generic `slots` or `slotProps` API, because it would double the surface of every component.

The kit ships as a package. It is never copied into an app.

Existing signatures stay. A ready component may gain a prop or accept a wider type, such as a `title` that accepts JSX. It does not lose a prop or narrow a type. A change that breaks a signature needs its own PR with a migration note and a codemod for CodeImage. The six gaps in the census can all be closed without breaking a signature. That was inferred from source and is checked by the API snapshot in K0.

Code the Kobalte v2 migration removes (`access`, `mergeRefs`, `createControllableSignal`) moves into one internal `utils` module, so v2 breaks one file.

## PR sequence

Each PR is one change with its own evidence. Every PR reruns `node tools/baseline/run.mjs` and diffs screenshots, axe, publint, attw and size against the PR below it.

| Id | Branch | Change | Depends on | Visible change | Waits for a decision |
| --- | --- | --- | --- | --- | --- |
| K0 | `chore/kit-baseline` | Commit the baseline harness and Phase 0 docs. Fix the turbo `playgrounds` filter and the Storybook Node 26 load issue in config, not in a hook. Add a public API snapshot of the emitted `.d.ts` that every later PR diffs, so a signature change cannot land unnoticed | None | No | No |
| K1 | `fix/kit-manifest` | Remove `example-basic`. Move `@vanilla-extract/vite-plugin` to dev dependencies. Use one Kobalte across the workspace. Fix the 46 attw errors | K0 | No | No |
| K2 | `chore/kobalte-0.13.14` | `@kobalte/core` 0.13.14, `solid-js` peer `^1.9.8`, and the utils scroll freeze fix. Keyboard and focus tests on Select, Combobox, Dialog, Popover and Menu. Check the Tooltip trigger, Escape in Listbox and Select, Select `onChange`, the Tabs indicator and SSR label snapshots | K1 | Maybe the Tabs and SegmentedControl indicator | No |
| K3 | `feat/kit-overlay-parts` | Pilot of the styled-parts layer. `@codeui/kit/dialog` and `@codeui/kit/popover`, with the ready Dialog and Popover rebuilt from them and their signatures unchanged. Dialog `title` accepts JSX. Popover drops the `<p>` wrapper. Select list takes a class. On a scratch CodeImage branch, rewrite the callers that use Kobalte directly (`SettingsDialog`, the What's new popover, `ShortcutHelp`, `Sheet`) and count the remaining Kobalte imports with `census.mjs`. The pattern spreads to other components only if that count reaches zero | K2 | Popover layout | Version policy (decision 3) |
| K4 | `fix/kit-field-gaps` | TextField puts `aria-*` on the input. `RadioListItem` forwards its props. SegmentedControl gets a stable height and Escape handling. Remove the three kit type errors CodeImage works around | K2 | SegmentedControl height | No |
| K5 | `feat/kit-tokens` | Theme values as CSS custom properties, aligned to the measured CodeImage tokens. Fix the component contrast violations | K3, K4 | Yes, every component | Brand (decision 2) |
| K6 | `feat/kit-form-controls` | Switch, Slider, Progress, Kbd, Badge, Spinner, Skeleton | K5 | New only | No |
| K7 | `feat/kit-feedback-overlays` | Toast, Alert, Sheet, Accordion | K5 | New only | No |
| K8 | `feat/kit-composites` | Combobox, command menu, option card, settings row and group | K6, K7 | New only | Scope (decision 1) |
| K9 | `test/kit-consumer` | A Vite + Solid consumer app with no vanilla-extract plugin, plus an SSR render, both installing the packed tarball | K1 | No | No. It fails today by design and records the gap the spike must close |
| C0 | CodeImage branch | Delete the `packages/ui` exports with no importer: Button, IconButton, TextField, Dropdown, SegmentedField, Toggle, PortalHost, SnackBar, LoadingOverlay, the unused transitions and `floating`. Rerun `census.mjs` before and after | None | No | No |
| C1 | CodeImage branch | Link CodeImage to the new kit and replace the forks the census lists. Typecheck, build, the app's tests and a screenshot diff against the preview | K8 | Yes | No |
| S1 | Scratch, no PR | Styling spike with four variants: vanilla-extract as today, vanilla-extract emitted as static CSS, StyleX, and plain CSS with custom properties. Measured in the K9 consumer | K9 | No | Timing (decision 5) |
| D1 | `feat/docs-site` | A documentation site that renders the kit live. Pick the stack by prototype (see below) | K5 | New | No |

Fumadocs needs React. `fumadocs-core` and `fumadocs-ui` 16.19.3 declare `react ^19.2.0` as a peer, and their router adapters are Next, React Router and `@tanstack/react-router` (`npm view`, measured). TanStack Start has a Solid build, `@tanstack/solid-start` 1.169.5 (measured). Fumadocs on Solid is therefore not possible, and Fumadocs with Solid demos means two runtimes on every page. D1 prototypes three options and keeps the one that renders kit demos with SSR and the least glue code. The options are a Fumadocs shell with Solid demo islands, Astro Starlight with its Solid integration, and TanStack Solid Start with MDX. The third one also makes the docs site a real SSR consumer of the kit, which K9 needs anyway.

K3 and K4 touch different components and can run in parallel. K6 and K7 can too. Every other PR is sequential. Two worktrees at once is the ceiling, because the disk is 91% full.

## Where `@codeimage/ui` goes

`packages/ui` is the 2022 generation of CodeImage's components. The kit repository started in January 2023 and became a submodule in April 2023. Since then `packages/ui` has received lint and type fixes only (`git log` on each primitive folder, read). The move to the kit stopped halfway. Its live exports fall into three groups (importer counts from `census.json`, measured).

| Group | Exports and importing files | Where it goes |
| --- | --- | --- |
| Foundation | `themeVars` 69, `backgroundColorVar` 19, `withThemeMode` 17, `darkGrayScale` 11, `colorVar` 3, `textStyles` 2, `CodeImageThemeProvider` 2 | A second token system on `data-theme-mode`, beside the kit's `data-cui-theme`. Some app styles target both. K5 makes the kit's tokens the only set, and CodeImage maps onto them |
| Layout and text | `Box` 38, `Text` 19, `HStack`/`VStack` 17, `FlexField` 7, `Group` 1 | Generic. Whether the kit ships them as components or as style functions is decision 6 |
| Controls | `SvgIcon` 24, `toast` 13, `LoadingCircle`/`Loading` 7, `Link` 5, `RangeField` 3, `Badge` 2, `FieldLabel` 3, `RadioBlock` 1 | The kit equivalents in K6 and K7 replace them. `RadioBlock` has no keyboard support (CodeImage audit UI-07) and is replaced by the option card |

The end state is no `packages/ui`. Updating it in place would keep two libraries for the same patterns.

### One token system

CodeImage styles target three theme attributes today. `data-theme-mode` appears in 14 files, `data-codeimage-theme` (written by `withThemeMode`) in 5, and the kit's `data-cui-theme` in 5 (`git grep -l`, measured). K5 makes the kit's contract the only one. Every semantic token that `packages/ui` `themeColors` defines and CodeImage uses moves into the kit contract under a kit name. Tokens only CodeImage needs, such as the editor frame, stay in the app and are defined against the kit contract. One attribute remains. A codemod in CodeImage rewrites `themeVars.*` and the old attributes.

### Layout primitives

`Box` is a wrapper over vanilla-extract sprinkles (`packages/ui/src/lib/theme/sprinkles.css.ts`). Sprinkles emits one class per property and value in its config, whether or not anything uses it. That is about 220 classes here, 168 of them for padding and margin over a 21-step spacing scale (counted from the config, inferred). The size is modest. The problem is that `Box`'s API is the sprinkles API, so it only works with vanilla-extract, and it depends on `@solid-aria/types`, which has had no release since 2023 (CodeImage audit UI-03).

The kit does not port `Box`. It ships `Stack`, with `gap`, `align` and `direction` set through data attributes and a CSS variable. That is a fixed, small amount of CSS that works with any styling engine. `Text` becomes a component with size, weight and tone variants mapped to tokens. A codemod in CodeImage turns 66 `<Box>` uses into a `Stack` or a plain element with a class, and moves 37 `<Text>` uses to the kit's `Text` (usage counts from `git grep`, measured).

## Decisions for the maintainer

1. **Which patterns enter the kit.** Recommended for the kit, because they are generic: option card, settings row and group, command menu, accordion, sheet. Recommended to stay in CodeImage, built on kit parts: theme card, window style tiles, export panel, the What's new card and onboarding carousel, the timeline.
2. **CodeImage brand or neutral.** Recommended. The kit ships the CodeImage look as its default theme, with every value as a CSS custom property that another app can override. A neutral default would make CodeImage carry an override layer.
3. **Version policy.** The kit is 0.x, so a minor bump may break. Recommended. Release K1 to K5 as 0.2.0 with a changelog section per break, and keep 1.0 for after the styling decision.
4. **Verification scale.** The pstack default is ten live lanes per PR. Recommended instead. The baseline harness rerun, keyboard tests for the touched components, and one CodeImage smoke check per release. This keeps reasoning at medium and avoids extra worktrees.
5. **When to run the styling spike.** Your order puts it last. K9 already shows the kit is not usable without vanilla-extract. Running S1 right after K9 would tell K6 to K8 how to write their styles, and it still changes nothing in the kit.
6. **Layout primitives.** `Box`, `Text` and `Stack` as kit components, or only as style functions applied to plain elements. Both work. It is a question of API taste.
