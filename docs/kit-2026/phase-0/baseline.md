# Storybook baseline

Reference refreshed from main. The historical phase-0 path is retained for existing tooling.

## Reproduce

Run `node tools/baseline/run.mjs`. Dependencies are locked in tools/baseline/package-lock.json. Set BASELINE_OUT and BASELINE_BUILD to isolate a repeat run. The harness builds Storybook, serves it on an OS-assigned loopback port, and captures every indexed story and docs page in light and dark, twice in independent browser contexts. It waits for Storybook render events, inline docs, themes, fonts and images. Remote assets are blocked; animations are disabled.

## Reference storage

Committed: baseline/screenshots.json (SHA-256 PNG hashes), baseline/story-index.json, command logs and commands.json. Generated PNGs are ignored under baseline/shots/<theme>/<id>.png; axe details and kit.tgz are also ignored. Run the same browser/OS for meaningful exact comparison.

## Capture result

442 page/theme pairs; 442 identical within-run pairs; 0 failed or unstable pairs. Chromium 159.0.8154.6; 1280×900, scale 1, UTC, en-US, reduced motion.

No capture failures.

## Checks

| Check | Result | First failure |
| --- | --- | --- |
| node | PASS |  |
| pnpm | PASS |  |
| install | PASS |  |
| build-kit | PASS |  |
| test | PASS |  |
| typecheck | PASS |  |
| pack | PASS |  |
| extract | PASS |  |
| publint | PASS |  |
| attw | PASS |  |
| attw-json | PASS |  |
| consumer-import | FAIL | Error: Styles were unable to be assigned to a file. This is generally caused by one of the following: |
| consumer-browser-import | FAIL | Error: Styles were unable to be assigned to a file. This is generally caused by one of the following: |
| sizes | PASS |  |
| storybook-build | PASS |  |
| screenshots | PASS |  |
| a11y | FAIL | configure-your-project--docs dark: color-contrast, heading-order, landmark-one-main, region |
| layer | PASS |  |
| option-card | PASS |  |
| theme-overrides | FAIL | AssertionError [ERR_ASSERTION]: dark page, light scope: :root radius override reaches the button   code: 'ERR_ASSERTION', |

## Accessibility

442 scans; 0 render/scan failures; 1133 rule/page/theme violations. These include Storybook wrappers and are retained as failures, not suppressed. Detailed nodes are in the generated baseline/a11y.json. Hidden interaction states are outside this baseline.

| Rule | Page/theme occurrences |
| --- | --- |
| color-contrast | 31 |
| heading-order | 8 |
| landmark-one-main | 416 |
| region | 290 |
| page-has-heading-one | 356 |
| landmark-unique | 10 |
| aria-input-field-name | 18 |
| listitem | 4 |

The theme-overrides probe currently fails on main: nested theme scopes redeclare derived radius tokens, so an app override of --cui-radius-md on :root does not reach the nested button. The assertion remains enabled.

Direct Node imports of the current vanilla-extract source distribution require extraction and fail without it. These probes are kept visible independently of screenshot results.
