# S1: the public contract authored as plain CSS

Recommendation: keep #126 for the remaining migration. Plain CSS is viable and
pixel-identical in the controlled fixtures, but this conservative implementation
does not establish a lower total maintenance cost. The compatibility API, not just
the authoring compiler, accounts for much of the complexity. Do not replace the
remaining components on the assumption that CSS alone removes that work.

Compared with `276485e5e44e494dc39bf9ebaf05fb3350cc4d8f` (PR #126).
The requested contract branch is actually `docs/styles-css-contract` (PR #124).

| Entry (dependency closure included) | Pilot raw / gzip bytes | Plain raw / gzip bytes | Selectors, both |
| --- | ---: | ---: | ---: |
| Button | 11,720 / 1,654 | 11,803 / 1,678 | 32 |
| IconButton | 11,945 / 1,662 | 12,007 / 1,687 | 33 |
| Switch | 10,353 / 1,672 | 10,386 / 1,675 | 23 |
| Dialog | 29,448 / 3,762 | 29,572 / 3,783 | 114 |

Counts are UTF-8 bytes, Node `gzipSync` defaults and whole-selector `:where()`
occurrences. Entries overlap; summing them overcounts shared Button declarations.
Differences are formatting/serialization, not a bundle saving. Lightning CSS is
pinned to **1.30.1**, published **2025-05-14**, over two weeks before this spike.

## Implementation and limits

`packages/styles/src/plain/{button,icon-button,switch,dialog}.css` are now the
editable declaration sources. They were seeded from the pilot's emitted scopes;
they are checked in, not generated during build. This deliberately conservative
translation preserves selector order and private aliases rather than attempting
a simultaneous redesign. Switch demonstrates native nested media authoring.
Lightning CSS compiles only these scopes. The existing closure builder writes the
same component CSS paths, all.css, manifest and Solid auto-import dependencies.
All other component modules still use the original vanilla-extract build.

Composition is still explicit: Button's owner list includes IconButton and Dialog
close; IconButton contributes the square modifier. Import order remains irrelevant.
Every whole ordinary selector retains `:where()`. Fixed layers remain tokens,
base, components inside cui. No specification rule or API snapshot is changed.

Tokens retain **one source, `foundation/theme-values.ts`**. The existing generator
creates CSS assignments and the typed `tokens.*` var references from that tree;
both paths share it. This spike does not remove vanilla-extract from token
compilation or from the other components. Component CSS references token colors;
there are no component-side computed colors to translate to `color-mix()`.
The existing shared derived-color support/fallback behavior stays intact.

Private helper aliases are frozen handwritten names, inventoried explicitly.
Regenerating them from property order would recreate the coupling this experiment
is testing. Compatibility modules keep every exported helper, callable signature,
string result, defaults and `.classNames` / `.variants()` metadata. Separate type
contracts preserve the legacy recipe rule shapes, including their readonly and
literal types. Build-time declaration publication keeps the original graph and
paths, rather than accepting an API snapshot update. This is substantial overhead
and an explicit limitation of the spike's approach.

`plain-lint.mjs` checks these four source files against the token source, public
part registry, documented local-variable inventory and private-alias inventory.
It runs in every build and independently from the repository root. Actual mutation
checks produced:

```
button.css: undefined token/component variable --cui-text-defualt
button.css: unregistered public part cui-buton
```

`src/plain/README.md` documents the local variables, including inherited layout
background and icon size slots. The lint inventories are not inferred from CSS
usage: declaring or referencing a new variable does not whitelist it automatically.
This is a narrow contract lint, not a general CSS/property/attribute-value linter.

## Source cost and developer experience

Physical lines include comments and blank lines, following checked-in formatting.
Pilot declaration modules: Button 277, IconButton 16, Switch 189, Dialog 651,
**1,133 total**. Its shared emitter is 247 lines, registry 159, composition helper 2:
**1,541 lines** including the shared contract mechanism, excluding shared tokens.
The emitter remains necessary for Button Loading and Icon, so S1 removes no shared
emitter tooling from the coexistence build.

Plain declaration CSS: Button 314, IconButton 9, Switch 180, Dialog 619,
**1,122 total**. Count compatibility modules, legacy type contracts, runtime recipe,
registry and inventories separately when assessing the total; CSS-only line counts
understate the cost. The build adds 59 net lines (including formatting), plus a
68-line lint; no build tool is removed. The repeatable comparison tool is 103 lines.

An `xs` Switch in #126 requires registry/type updates plus a new dimensions entry;
the emitter generates public and private predicates. In S1 it requires the same
registry update, explicit CSS root/control effective-axis rules, a private alias,
and helper/type metadata. The CSS declaration edit is direct, but the precedence
rules still need care. Adding only `[data-size="xs"]` would break helper-only
consumers. Neither approach can safely skip registry and public API review.

## Visual and behavior validation

The existing pilot suite passes **264 assertions**, both themes and six import
orders. The existing phone/media check preserves 44×26 touch tracks, 20px thumbs,
40px phone navigation, reduced motion and keyboard animation suppression.

`tools/styles/spike-s1-compare.mjs <reference-dist>` loads the existing pilot's
CSS-only static fixture HTML against each dist, using the same reset and browser.
It compares decoded RGBA pixels, not compressed PNG bytes. All **24 pairs** have
**0 differing pixels**: Button, IconButton, Switch and Dialog × dark/light ×
1440×900, 1024×768, 390×844. Reference dist was saved from #126 before edits.
The existing Storybook/contract parity capture also completes with no browser
errors; its panel equality checks pass. Captures and machine reports are under
`.artifacts/styles-spike-s1/` and deliberately not committed.

These comparisons prove the controlled fixture translation, not every possible
consumer markup combination. Existing #126 design drift remains: 40px Button md
rather than 36px desktop, the Dialog bar divider, and older Button/Switch motion
and hover conventions. Per DESIGN §12, this spike changes no visual rule: content
layout, fill/accent roles, typography, radii, targets and motion inherit #126.
Number formatting and truncation are not exercised. The static HTML cannot prove
focus trapping, focus return or Escape semantics; renderer tests remain necessary.
Cross-browser consumer hydration is checked separately from Chromium pixels.

Validation results and build-time measurements are recorded below after the runs.

## Migration estimate and risks

Estimate **4–6 engineer-days** for the other ~36 components with this plain-CSS
approach, versus **3–5 days** for the pilot emitter. This is judgment, not measured
throughput: allow roughly half a day for token/variable inventories and recipe
metadata policy, 2–3 days translating component families and composition, and
1.5–2.5 days for API, state/precedence, packed-consumer and visual checks. The
uncertainty overlaps; this spike does not support a claim of faster migration.

Main risks: CSS/helper metadata divergence; maintaining legacy recipe type shapes;
explicit effective-axis and mixed compound selectors; private alias inventories
being misused to hide typos; Lightning CSS serialization changes on upgrades; and
two authoring systems coexisting during migration. Native nesting reduces some
repetition but cannot remove these compatibility obligations. A later experiment
could generate helper metadata from the registry, but should measure its own total
source cost and preserve the same API gate before changing this recommendation.
