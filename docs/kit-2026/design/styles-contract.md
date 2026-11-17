# Public CSS contract for @codeui/styles

Status: design proposal, not a package migration. Reviewed against PR #123 at
`4f543641cfa4a45cefa0086bb1d5de497675de1b`; prototype sources are this checkout's
main-line kit. No changes to the refactor branch or shipped API.

## Recommendation

Publish an authored part registry, independent of TypeScript symbol names. Handwritten
HTML uses one class per part and attributes for variants. Keep vanilla-extract as
the compiler and preserve string-returning recipe helpers with private variant
classes. Ship a single component layer, without `cui.overrides`.

```html
<button class="cui-button" data-size="md" data-theme="primary">Export</button>
<button class="cui-icon-button" data-size="md" data-theme="secondary" aria-label="Export">
  …
</button>
```

The exact naming equation is **`cui-` + existing `data-cui` value**. Values today
do not contain the prefix. Do not rename parts to match TS variables. In particular,
Dialog header is `dialog-panel-title`, not `dialog-header`; body is
`dialog-panel-content`, not `dialog-body`.

## Parts and ownership

Authoritative sources: `packages/kit/src/components/Button/Button.tsx`,
`IconButton/IconButton.tsx`, `parts/switch.tsx`, and `parts/dialog.tsx`.

| Component  | Existing data-cui values (class adds cui-)                                                                                                                                                                                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button     | button                                                                                                                                                                                                                                                                                                                                                |
| IconButton | icon-button                                                                                                                                                                                                                                                                                                                                           |
| Switch     | switch-root, switch-input, switch-control, switch-thumb, switch-label, switch-description, switch-error-message                                                                                                                                                                                                                                       |
| Dialog     | dialog-trigger, dialog-overlay, dialog-positioner, dialog-panel, dialog-panel-title, dialog-title, dialog-description, dialog-close-button, dialog-panel-content, dialog-panel-footer, dialog-sidebar, dialog-sidebar-search, dialog-nav, dialog-nav-item, dialog-nav-icon, dialog-main, dialog-section, dialog-section-title, dialog-section-content |

Every part gets a class, including currently unstyled parts; a class need not have
an emitted declaration. Button's internal `buttonIcon`/`buttonText` styles do not
establish new public parts. The prototype keeps their compiler classes private;
production must scope internal descendants or explicitly add parts in a separate API change.

`data-cui` remains an inspection, testing and composition hook. It alone does not
activate styles. Stable classes activate styles. Preserve existing attribute-based
structural selectors (e.g. Switch root sizes its control), but scope them to the
owning component. `classes` per-part overrides and `class` merge additively; they
do not replace the stable class or remove `data-cui`. Their order in the HTML class
string never establishes CSS precedence.

Composition is explicit: `cui-icon-button` includes Button base, variants and states,
then square dimensions and zero padding. `cui-dialog-close-button` composes that
same contract. Consumers do not need three classes for this. Generated selector
lists share declarations; no component-specific layer or stylesheet import ordering
is required. Nested parts must not accidentally inherit variant attributes from
an unrelated parent.

## Variants, defaults and states

Use exact lowercase values from the existing recipe types; do not broaden them.
Button supports size xs/sm/md/lg/xl, theme primary/secondary/tertiary/negative/caution,
variant ghost, and boolean block/pill/loading. Boolean variant attributes use
`="true"`; false and absence disable that variant. Kobalte state attributes are
presence-based, so `data-disabled="false"` still means disabled and is invalid markup.
Button loading is an existing presence-based state too: production should normalize
its CSS to `[data-loading]`, not require a serialized true value. The prototype
keeps the source recipe's true spelling for its compound selector.

Switch size is sm/md. Set it on the root for composition, or directly on control
for a standalone helper. A part's explicit value wins over root inheritance.
Dialog size is xs/sm/md/lg/xl/full/settings/export; chrome bar/inset, body layout
split, section variant group/well, columns 2, motion auto/none are existing hooks.
The positioner already exposes `data-panel-size`; retain that hook, and also stamp
resolved size on the panel. These attributes serve different layout scopes.

Resolve defaults once from a shared descriptor, used by both CSS and helpers:
Button recipe defaults to md size **and has no theme default**; do not quietly add
primary. Switch defaults to md. Dialog wrapper resolves its panel defaults; section
is group. An absent attribute selects the documented default using `:not([data-size])`
(or equivalent base declarations). An unknown value is unsupported and must not
silently select a valid value. Changing defaults is a breaking change.

Preserve Kobalte's actual placement of `data-checked`, `data-disabled`,
`data-expanded`, `data-invalid`, `data-readonly` and other states; inventory per part
before migration. Do not promise every state on every part. `data-highlighted`
is a future menu/list part hook, not a new state for these three components.
Keep `:hover`, `:active`, `:focus-visible`, ARIA attributes, and
`html[data-cui-input]` modality selectors. State attributes provide visuals; plain
CSS does not implement focus traps, Escape, keyboard switching, form semantics or
ARIA. Static examples are visual fixtures, not accessible component replacements.

## Helpers and recipes

Keep every existing helper signature and return type. `switchStyles.control({size:
"sm"})` returns `cui-switch-control` plus private recipe classes, so existing
class-only usage keeps its variant without attributes. Do not change it to return
an object or silently ignore size. The low-level Button namespace currently exports
`buttonStyles.button`, not `buttonStyles.root`; root can be an additive alias.

Production selector generation uses this precedence, all at specificity zero:
base/defaults → private helper variants → explicit attribute variants → compound
variants → states → composition modifiers. Private variant selectors include
`:not([data-size])` (respectively each variant axis), so an explicit attribute
wins even against a conflicting helper. Compound selectors must support mixed
attribute/private-class inputs, through a shared effective-axis predicate, not
only the all-attribute case. Do not emit the Cartesian product of every variant.
Keep recipe objects (including variant metadata) working; moving recipe functions
across package boundaries must preserve their types and serializability.

The prototype demonstrates the public attribute path only. It is deliberately not
a production compatibility adapter for helper classes. That adapter and precedence
fixtures are a merge gate for #123, not an assertion this proof makes.

## Compiler, cascade and specificity

Declare the fixed order in every independently importable entry:

```css
@layer cui;
@layer cui.tokens, cui.base, cui.components;
```

Themes assign variables in tokens; resets/base primitives in base; all component
rules, variants, states and compositions in components. No overrides sublayer.
No `!important` in kit CSS. Document app ordering: Tailwind's utilities must follow
cui in the app's layer prelude. Layered Tailwind does not automatically beat cui
if the app establishes the reverse order. Unlayered normal app CSS always wins.

Wrap the **whole selector** in `:where()`, including ancestors, states, relational
selectors and negations. A pseudo-element stays outside: `:where(... )::before`
has specificity 0-0-1; ordinary selectors are 0-0-0. Never wrap only the root class
and leave `[data-checked]` outside. Equal specificity makes source ordering an
explicit compiler responsibility. Test disabled vs hover, checked vs invalid,
compound variants, root sizing, media rules and composition, rather than relying
on incidental stylesheet order. Consumer `!important` follows normal CSS rules.

PR #123's `identOption` receives debug IDs derived from symbols. It cannot infer
parts, defaults or compounds and is not a public registry. Use explicit descriptors
and `globalStyle(':where(.cui-button...)', rule)` for authored public selectors,
with `createGlobalThemeContract` for documented local variables. Keep ordinary
`style` and recipe generated identifiers private. Build both paths from the same
rule objects; do not maintain duplicate declarations by hand. An adapter must
flatten recipe arrays and preserve media/container queries and keyframes.
The scratch proof uses a post-compile selector translation to establish feasibility;
that translation's symbol mapping is not the recommended production architecture.

## Theming and Tailwind

Keep `--cui-*` semantic tokens and `data-cui-theme="dark"|"light"`. Scope theme
variables on roots and copy theme context to portals as today. Preserve public
`dialogThemeVars` keys and `var(...)` exports; migrating their emitted variable
names must retain aliases where those strings were public. Component-local variables
need an authored registry too: changing a TS variable must not change a documented
custom property. Private compiler variables have no stability promise.

Tailwind can operate directly on the same markup:

```html
<button class="cui-button data-[size=md]:px-4" data-size="md" data-theme="primary">
  Export
</button>
```

An app token bridge can map `--color-cui-text: var(--cui-text-default)` and
`--color-cui-field: var(--cui-surface-input)` in Tailwind's theme configuration;
keep existing semantic names even where Inkstone proposes future renames. CSS-only
users require no Tailwind or JS runtime. A future plugin reads the public registry,
not emitted selectors or debug IDs. This proposal does not specify plugin packaging.
SSR emits deterministic classes and attributes with no runtime CSS generation;
server and client must use the same descriptor version. Hydration remains a
renderer responsibility; #123's portal/hydration work should stay.

## Alternatives and cost

| Option                                         | Benefit                                                     | Cost / decision                                                                                        |
| ---------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Authored attributes + private helper variants  | Fits Kobalte and existing DOM hooks; readable CSS-only HTML | Two selector paths; recommended to preserve class-only callers                                         |
| BEM modifiers such as cui-button--primary      | Naturally fits string helpers, stable if authored           | More public class names, duplicates state vocabulary; viable if maintainer prefers one variant channel |
| Attributes only, change helper to return props | Single CSS path                                             | Breaks string callers and spreads API shape changes across renderers; reject before 1.0                |
| Freeze current debug IDs                       | Smallest change in #123                                     | Internal rename becomes public API review; recipes still leak compiler structure; reject               |

BEM is not intrinsically worse for specificity: `:where(.cui-button--primary)` is
also zero. The choice is vocabulary and compatibility. Attributes reduce public
class count, not necessarily compressed CSS bytes. Shared selector lists and gated
private selectors add bytes; do not claim a bundle saving without production build
measurements. Keep per-component CSS and dependency deduplication from #123.

## Versioning and API snapshot

A removed/renamed part, variant value, state placement, default, public variable,
layer order, supported composition, or specificity guarantee is breaking. Adding
a part/value is additive unless it changes existing matching/appearance. Pure TS
renames and private identifier changes are not breaking. Token value tuning can
remain a visual fix; token deletion or changed meaning is breaking. Publish the
registry with the package and snapshot it separately from TS declarations.

`packages/kit/api/kit.api.md` stays unchanged in this design PR. Implementation
should preserve all current exports and signatures, including low-level namespace
exports and `DialogStyles`, `SwitchStyles`, classes maps and theme var keys.
Add stable part/variant descriptors and optionally `buttonStyles.root` without
removing `buttonStyles.button`. Snapshot regenerated additions must be reviewed;
#123's large re-export diff must not be accepted as evidence of compatibility.
If old raw CSS identifiers have shipped, retain deprecated aliases for a release;
if #123 is unpublished, replace its new debug-name contract before publishing.
Pre-1.0 is not justification for silently removing existing TS API.

## Migration plan for #123

Keep package extraction, build-time vanilla-extract compilation, per-component
CSS exports, automatic Solid CSS imports, no consumer plugin, CSS side effects,
manifest dependency closure, SSR fixes and consumer smoke tests.

Replace debug-name public contracts with a descriptor registry; implement shared
attribute/private recipe emission and explicit local variable names; remove
`cui.overrides`; update helpers and renderer attribute stamping together. Rewrite
contract/check scripts to verify semantic selectors and public registry snapshots,
not debug identifiers. Add import-order permutations for Button/IconButton/Dialog
close button, helper-only and conflicting attribute fixtures, SSR equality and
Tailwind layer ordering. Preserve existing consumer and hydration tests.

Rough scope: one emitter/descriptor mechanism, roughly forty component style
modules plus part helpers/renderers, registry/check scripts, docs and snapshots.
This is a second substantial pass over #123, not a one-line `identOption` fix.
Start with these three components as a mergeable unit before expanding coverage.

## Proof and screenshot comparison

Run from repository root:

```sh
pnpm install
pnpm build:kit
npm ci --prefix tools/baseline --workspaces=false
node docs/kit-2026/design/styles-contract-proto/emit.mjs
pnpm --filter @codeui/storybook-playground dev --ci
# In another terminal:
node docs/kit-2026/design/styles-contract-proto/capture.mjs
node docs/kit-2026/design/styles-contract-proto/pixels.mjs
```

Open `styles-contract-proto/index.html` directly. No framework, consumer compiler
plugin or server is needed for the emitted fixtures. The script copies source into
`.artifacts/styles-contract-source`, injects debug labels only there, compiles it
with the installed vanilla-extract integration, and emits original and translated
CSS. It never changes package sources. Reset CSS is copied from Storybook; demo
layout and animation suppression are explicit fixture styles. Captures normalize
fonts to Arial on both sides, since Storybook loads Manrope while DESIGN §3 specifies
Inter. This is a controlled selector comparison, not a typography redesign.

`comparison.json` records measured bounds/styles and browser errors for Button
Primary, IconButton Primary, Switch States' first root and Dialog Sizes' md panel.
Paired screenshots are in `styles-contract-proto/screenshots/`, named
`storybook-{component}-{theme}.png` and `contract-{component}-{theme}.png`.
Additional static screenshots cover 1024×768 and 390×844; primary paired captures
are 1440×900 in both themes. Switch's story stretches its root to 1408px via Stack;
the isolated fixture places all eight Switch states in its own grid. This is parent layout, not a
track style difference. Button is 88.265625×40 and IconButton is 40×40 in both paths.
The comparison script asserts equal track and panel geometry/colors against the
source story. Dialog panel is 512×200 in both themes; its cropped panel screenshot
differs by 170 pixels in dark and 208 in light out of 102,400 pixels. The mismatch
reaches the rounded panel edges, where the surrounding background affects edge
antialiasing/shadow; this explanation is an inference, not proven pixel attribution.
`pixels.mjs` records decoded pixel counts in `pixel-comparison.json`. Whole-dialog
captures differ in background content: the static page omits Storybook’s row of launch buttons.

Limitations: these screenshots do not verify all variants, interactions, helper
compatibility, hover/state ordering, Safari/Firefox, or accessibility behavior.
The static Dialog retains captured semantic/focus-guard markup but implements no
focus trap. Existing source design drift remains: Button md is 40px rather than
§6's 36px desktop; Dialog bar retains a divider despite §2.5, and motion/hover
rules in Button/Switch still differ from §7. This proposal must not normalize that
drift into a new visual rule.

## DESIGN.md review and proposed text

§12 review: layout remains overlay-based; tokens/fills, accent uses, typography,
radii and target sizes inherit current sources, with drift above explicitly recorded.
No new product borders or motion added. Static fixtures suppress motion to compare
selectors; that is not validation of keyboard/reduced-motion behavior. Both themes
and all three viewport sizes are captured. Number formatting/truncation are not
exercised. Keyboard, focus return and cross-browser checks remain implementation
merge gates; a static visual fixture cannot satisfy them.

No normative DESIGN.md change is applied here, as requested. On adoption, add to
its opening contract section and matching `apps/docs/content/docs/design/index.mdx`:

> Public part classes are `cui-` followed by the existing `data-cui` value. Variant
> attributes and Kobalte state attributes are the CSS-only styling interface.
> Public names are authored and versioned independently of compiler identifiers.
> Kit CSS declares `cui.tokens`, `cui.base`, `cui.components` in that order. Every
> ordinary selector has zero specificity; pseudo-elements add only their type
> specificity. Composition never adds a cascade layer. App utilities declare their
> layer after `cui`, or use unlayered CSS, to override the kit.

This extends the styling contract without changing Inkstone's visual rules.
