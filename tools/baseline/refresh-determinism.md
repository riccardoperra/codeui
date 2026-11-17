# Main reference refresh

Source: main at 70796bea98b3562105e28d3108ce7c5c659613ad. Chromium 159.0.8154.6, macOS arm64, 1280×900, scale 1, UTC, en-US.

Two complete Storybook builds produced 442 page/theme pairs each. Each pair was captured twice in independent browser contexts. All 1,768 captures agree within and across runs. No flaky pages were observed. See refresh-determinism.json for counts and cross-run differences.

The first run uses the default output. The isolated second run uses:

```sh
BASELINE_OUT=.artifacts/main-repeat BASELINE_BUILD=.artifacts/main-repeat-static node tools/baseline/run.mjs
```

The standalone configure-your-project docs page passes both themes on main. Its two failures on #126 are caused by the removed global theme import: no component loads theme.css on that MDX-only page, leaving the canvas token undefined. The harness correctly rejects its transparent body background.

Main retains accessibility failures. The first scan has 442 successful renders and 1,133 rule/page/theme findings. Missing main landmarks (416), missing first-level headings (356), and content outside landmarks (290) largely describe iframe/story wrappers. Remaining findings include contrast (31), unnamed Listbox fields (18), duplicate landmark labels (10), heading order (8), and list-item structure in Listbox/Select docs (4). Contrast findings affect Configure, Button, Dialog, DropdownMenu, Listbox, SegmentedControl, Select, and Tooltip. These are recorded, not suppressed. Generated a11y.json contains affected nodes.

The theme-overrides probe also fails on main because nested scopes redeclare derived radius tokens and mask a root radius override. Direct Node import probes fail because the vanilla-extract source distribution requires CSS extraction. These are independent of capture determinism. The pnpm pack invocation was corrected to use --dir rather than the unsupported filtered recursive form.

The committed reference contains hashes and the story index. PNGs, axe details, and tarballs remain ignored in the historical baseline directory. The PR #126 comparison and side-by-side PNGs remain under .artifacts/baseline-126 and are not committed.
