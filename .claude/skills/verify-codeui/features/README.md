# @codeui/kit verification map

This directory is the maintained source for verifying what a user of @codeui/kit components sees and does. Read this index, then use the matching feature file as the recipe. All recipes drive Storybook stories through `scripts/drive.mjs`.

## Baseline preconditions

- `node .claude/skills/verify-codeui/scripts/launch.mjs` printed `"ready":true` in this worktree.
- `node .claude/skills/verify-codeui/scripts/doctor.mjs` exits 0 (`portOwnedByRun`, `indexReachable`, `buildFresh` all true).
- The story id you drive appears in `<url>/index.json`. Ids below were read from the `fix/baseline-determinism` build.
- Never drive an instance this run did not launch.

## Driving conventions

- Every recipe runs in both themes (`--theme both`, the default) unless it says otherwise.
- Reach controls with Tab and operate them with Enter, Space, Escape and arrow keys. Use the pointer only for pointer-only behavior (hover tooltips).
- Prefer roles and accessible names, then `[data-cui=<part>]`, then computed style. Never use coordinates or DOM position.
- Overlays portal outside `#storybook-root`; query them from `page`.
- Stories reset on every `open()`; journeys need no data cleanup.

## Proof and skip reporting

- Evidence goes to `.verify-codeui/evidence/<stamp>-<story-id>[-label]/` (transcript, per-step screenshots per theme, axe JSON).
- Assert the state after each action: focus location, open/closed, selected value, computed style.
- Report axe violations other than the canvas-level `landmark-one-main` and `page-has-heading-one`.
- Report an entry point you did not drive as skipped. Do not claim it through another path.
- A journey that cannot reach its precondition fails; write the reason in that feature's Gotchas instead of weakening the journey.

## Feature entry contract

Each feature file has an H1, one paragraph of user-visible behavior, and exactly four H2s in order: `Sub-features`, `How to get to it (user POV)`, `Driving it with drive.mjs`, `Gotchas`.

## Features

- [Overlays](./overlays.md): Dialog and Popover open, focus, dismiss and focus return. Proven journey: `journeys/dialog-keyboard.mjs`.
- [Form fields](./form-fields.md): TextField, Select, Listbox, NumberField, SegmentedControl, RadioList, Checkbox input by keyboard, validation states.
- [Theming](./theming.md): `data-cui-theme` modes, `--cui-*` tokens, and the `@layer cui` override contract.
- [Feedback](./feedback.md): Tooltip on hover and focus.
