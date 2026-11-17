---
name: verify-codeui
description: Prove @codeui/kit component behavior in the browser the way a user meets it - launch Storybook (packages/storybook) on a free port, drive a story with Playwright using keyboard, roles and data-cui parts in dark and light themes, and save screenshots, a JSON transcript and axe results. Use before claiming a kit component, part, token or theme change works, when reviewing a kit PR, or when a story looks wrong.
---

# verify-codeui

@codeui/kit is a Solid component library on Kobalte. Users meet it as rendered components, so proofs run in **Storybook in a real browser**: `packages/storybook` (storybook-solidjs-vite 10), one story per URL at `iframe.html?id=<story-id>&viewMode=story`. Storybook imports kit **source** (`packages/kit/src`) through tsconfig paths, so a kit build is not needed to prove a component.

Other surfaces, not driven by this skill: the packed kit consumed by example apps (PR #79) and the Fumadocs docs site (PR #85). Neither is on `fix/baseline-determinism`.

All commands run from the repo root of your worktree. `K=.claude/skills/verify-codeui`.

## Launch

```sh
node $K/scripts/launch.mjs            # static build + server on a free port (use for proofs)
node $K/scripts/launch.mjs --rebuild  # force a fresh Storybook build
node $K/scripts/launch.mjs --dev      # storybook dev on a free port (iteration with HMR)
```

- Static mode builds Storybook into `.verify-codeui/storybook-static/` only when the build is missing or older than any file in `packages/kit/src`, `packages/storybook/src` or `packages/storybook/.storybook` (about 70 s), then serves it with `scripts/serve.mjs`, which binds port 0 like `tools/baseline/run.mjs`.
- First run installs `tools/baseline` (Playwright 1.65, @axe-core/playwright) with `npm ci` if missing.
- **Ready** means: `index.json` lists stories **and** `designsystem-button--primary` renders through `tools/baseline/browser.mjs` `open()` (rendered root, no page errors, `data-cui-theme` and body background match the theme). Launch prints one JSON line: `{"ready":true,"runId":…,"url":"http://127.0.0.1:<port>",…}`. Anything else is a failed launch; it prints the cleanup command.
- Run state lives in `.verify-codeui/runs/<runId>.json` (+ `.log`). `.verify-codeui/` ignores itself through its own `.gitignore`, so nothing there is ever staged.

## Doctor

```sh
node $K/scripts/doctor.mjs [--run <runId>]
```

Read-only. Exit 0 and `"ok": true` only when: the run's process is alive, every listener on its port belongs to the run's process group (`portOwnedByRun`), `index.json` answers with stories (`storyCount`, `docsCount`), and in static mode the build is not older than source (`buildFresh`). `info.kitDist` reports whether `packages/kit/dist` is `fresh`, `stale` or `missing`; it matters only for the packed-kit surface. Run doctor first whenever a drive misbehaves. If `buildFresh` is false, clean up and relaunch.

## Drive

```sh
node $K/scripts/drive.mjs <story-id> [--theme dark|light|both] [--journey <file.mjs>] [--label <name>] [--run <runId>]
# proven example:
node $K/scripts/drive.mjs designsystem-dialog--sizes --journey $K/journeys/dialog-keyboard.mjs
```

- Default `--theme both`: each theme gets a fresh browser context via `tools/baseline/browser.mjs` `open()` (1280x900, reduced motion, animations off, theme forced through `data-cui-theme`, the dark-mode addon store and the `DARK_MODE` channel event).
- Without `--journey`: checks the story rendered without page errors, screenshots it, runs axe. Use this for "does it render in both themes".
- With `--journey`: the file default-exports `async ({ page, step, check, focus, axe, theme, backgrounds }) => {}`. That is the page handle; write ad-hoc journeys in your scratchpad and keep reusable ones in `$K/journeys/`.
  - `step(name, fn)` runs a user action, then records focus and a screenshot. A throw stops the theme.
  - `check(name, fn)` records an assertion; `fn` returns `true` or `{ pass, ...details }`. A failing check marks the run failed and continues.
  - `focus()` returns `{ tag, role, dataCui, name, inDialog }` of `document.activeElement`.
  - `axe(name)` saves `axe-<name>.json` for the current state.
  - `backgrounds[theme]` is the expected body background (`rgb(15, 15, 16)` dark, `rgb(247, 249, 251)` light).
- Exit 0 only when every check passed in every theme. Stdout is a JSON summary with the evidence path.
- Story ids: `curl -s <url>/index.json` or `.verify-codeui/storybook-static/index.json`. Pattern: `designsystem-<component>--<story-kebab>`.

Handles, in order of preference:

1. Keyboard: `page.keyboard.press('Tab' | 'Enter' | 'Space' | 'Escape' | 'ArrowDown' …)`. Reach controls with Tab like a user; never `.click()` what a keyboard user would press.
2. Roles and accessible names: `page.getByRole('dialog')`, `getByRole('button', { name: 'Open (sm)' })`, `getByRole('option')`, `getByRole('tab', { selected: true })`.
3. Kit parts: `[data-cui=<part>]`, e.g. `dialog-panel`, `dialog-close-button`, `popover-content`, `select-trigger`, `select-value`, `listbox-item`, `text-field-input`, `segmentedControlItem`. Part names live in `packages/kit/src/parts/*.tsx` and component sources.
4. Computed style for theming: `getComputedStyle(el).colorScheme`, `backgroundColor`, and `--cui-*` custom properties on `document.documentElement`.

Overlays (Dialog, Popover, Select content, Tooltip) render in a portal outside `#storybook-root`: query from `page`, not from the root.

## Evidence

Every drive writes to the stable folder **`.verify-codeui/evidence/<UTCstamp>-<story-id>[-label]/`**:

- `transcript.json`: story URL, run id, mode, journey path, and per theme an ordered list of `action` (name, focus after, screenshot), `assert` (name, pass, actual values) and `axe` (violation ids, impact, node count) entries.
- `<theme>/NN-<step>.png`: a screenshot after every step, both themes.
- `<theme>/axe-<state>.json`: full axe results; `axe-rendered.json` always, more when the journey calls `axe()`.

Proof standards:

- Drive the real user path: keyboard and pointer on the rendered story. Never call component setters, Solid signals or Storybook args to reach a state the user reaches by input.
- Capture the action and the result: assert focus location and visible state after each step, not only a final screenshot.
- Prove both themes for anything visual or token-related; assert computed values, not just pixels.
- Axe on the story canvas always reports `landmark-one-main` and `page-has-heading-one` (Storybook's isolated iframe has no main/h1). Report other violation ids as findings; do not suppress them.
- A proof that covers one entry point of a feature is partial when its `features/` file lists others. Say which you skipped.

## Cleanup

```sh
node $K/scripts/cleanup.mjs [--run <runId>]   # default: newest run in this worktree
node $K/scripts/cleanup.mjs --all              # every run in this worktree
node $K/scripts/cleanup.mjs --all --purge-build  # also delete .verify-codeui/storybook-static
```

Cleanup signals the run's own process group (launch spawns detached, so `pid` is the group id), confirms the port no longer listens, and deletes the run's state and log. It never kills by name and never touches `.verify-codeui/evidence/`; it prints how many evidence folders remain. Run it after every failed iteration too.

## Isolation

Several agents work in parallel worktrees. Each worktree has its own `.verify-codeui/`; each launch binds a port the OS hands out; doctor and cleanup act only on processes in the run's group. Do not drive a URL your own `launch.mjs` did not print. Inside one worktree, pass `--run <runId>` to doctor, drive and cleanup when more than one run exists (the default is the newest), and never run two static rebuilds at once: they write the same `storybook-static/`.

## Gotchas

- Storybook disables the Solid framework's inferred prop docgen. Its transform analyzes virtual modules and dependencies with this Vite version, which blocks preview requests. Explicit story controls still work.
- `tools/baseline/browser.mjs` aborts every cross-origin request and serves empty CSS for remote stylesheets, so captures use local fallback fonts. That is deliberate (determinism), not a broken story.
- The preview starts dark. Always pass `--theme`; do not toggle the theme mid-journey.
- `transition` and `animation` are disabled and `reducedMotion` is `reduce`. A journey cannot prove motion; say so instead of claiming it.

## Feature map

`features/README.md` indexes one file per user-facing feature group with sub-features, entry points, harness recipes and gotchas. Read the matching file before driving; update it in the same PR when a story id, label or behavior changes. Maintain it with `/maintain-verification-skill`.
