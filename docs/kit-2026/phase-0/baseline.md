# UI kit Phase 0 baseline

This baseline records the current kit for later modernization comparisons. No library source or dependency versions were changed. K0 corrects the root check filters and adds an API snapshot. Model the Domain shaped the indexed page/theme result records. Build the Lever shaped the single rerun command. Prove It Works required two independent captures and direct inspection of the packed modules.

## Rerun

Install the isolated tools with `npm ci --prefix tools/baseline --workspaces=false`. Run `node tools/baseline/run.mjs` from the repository root. The tools folder is outside the pnpm workspace. Existing Chromium builds are used. Logs and JSON reports are in `baseline/`. A failed check produces a nonzero exit code while later checks continue.

## Environment

Recorded 2026-11-16T14:42:59.646Z. darwin arm64. Node v26.5.0. pnpm 9.5.0. playwright 1.65.1, @axe-core/playwright 4.14.0, publint 0.3.25, @arethetypeswrong/cli 0.18.5, size-limit 14.3.0. Chromium 159.0.8154.6. Viewport 1280 by 900, device scale 1, UTC, en-US, reduced motion, animations and transitions disabled.

## Commands

| Check | Command | Result | Seconds | First error |
| --- | --- | --- | --- | --- |
| node | `node --version` | PASS | 0.02 |  |
| pnpm | `pnpm --version` | PASS | 0.11 |  |
| install | `pnpm install --frozen-lockfile` | PASS | 1.04 |  |
| build-kit | `pnpm build:kit` | PASS | 1.15 |  |
| test | `pnpm test` | FAIL | 3.71 | @codeui/vanilla-extract:build: (!) Plugin typescript: @rollup/plugin-typescript TS2688: Cannot find type definition file for '@testing-library/jest-dom'. @codeui/kit:test: FAIL test/index.test.tsx |
| typecheck | `pnpm typecheck` | FAIL | 1.99 | @codeui/vanilla-extract:build: (!) Plugin typescript: @rollup/plugin-typescript TS2688: Cannot find type definition file for '@testing-library/jest-dom'. @codeui/kit:typecheck: src/components/Field/FieldMessage/createFieldMessageProps.ts(9,37): error TS2322: Type '"children"' is not assignable to type '"as" / Exclude<keyof ComponentProps<TComponent>, "as">'. |
| pack | `pnpm --filter @codeui/kit pack --pack-destination /var/folders/fl/zcmyh0g16cn9zycd8sv440400000gn/T/codeui-baseline-Ftnr4D` | FAIL | 0.11 |  ERROR  Unknown option: 'recursive' |
| pack-compatible | `pnpm --dir /Users/riccardoperra/.t3/worktrees/codeui/t3-6fbe4be0-b9b5556357ab428d/packages/kit pack --pack-destination /var/folders/fl/zcmyh0g16cn9zycd8sv440400000gn/T/codeui-baseline-Ftnr4D` | PASS | 0.18 |  |
| extract | `tar -xzf /var/folders/fl/zcmyh0g16cn9zycd8sv440400000gn/T/codeui-baseline-Ftnr4D/codeui-kit-0.1.5.tgz -C /var/folders/fl/zcmyh0g16cn9zycd8sv440400000gn/T/codeui-baseline-Ftnr4D` | PASS | 0.03 |  |
| publint | `/Users/riccardoperra/.t3/worktrees/codeui/t3-6fbe4be0-b9b5556357ab428d/tools/baseline/node_modules/.bin/publint /var/folders/fl/zcmyh0g16cn9zycd8sv440400000gn/T/codeui-baseline-Ftnr4D/package` | FAIL | 0.5 | 1. The "example-basic" dependency references "link:/Users/riccardoperra/WebstormProjects/pipelineui/packages/app" that will likely not work when installed by end-users. |
| attw | `/Users/riccardoperra/.t3/worktrees/codeui/t3-6fbe4be0-b9b5556357ab428d/tools/baseline/node_modules/.bin/attw /var/folders/fl/zcmyh0g16cn9zycd8sv440400000gn/T/codeui-baseline-Ftnr4D/codeui-kit-0.1.5.tgz` | FAIL | 0.39 | 🥴 Import found in a type declaration file failed to resolve. Either this indicates that runtime resolution errors will occur, or (more likely) the types misrepresent the contents of the JavaScript files. Use -f json to see the imports that failed to resolve. https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/InternalResolutionError.md ⚠️ A require call resolved to an ESM JavaScript file, which is an error in Node and some bundlers. CommonJS consumers will need to use a dynamic import. https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/CJSResolvesToESM.md |
| attw-json | `/Users/riccardoperra/.t3/worktrees/codeui/t3-6fbe4be0-b9b5556357ab428d/tools/baseline/node_modules/.bin/attw /var/folders/fl/zcmyh0g16cn9zycd8sv440400000gn/T/codeui-baseline-Ftnr4D/codeui-kit-0.1.5.tgz --format json` | FAIL | 0.31 | InternalResolutionError, CJSResolvesToESM |
| consumer-import | `node -e "import('./packages/kit/dist/esm/index.js')"` | FAIL | 0.1 | SyntaxError: The requested module 'solid-js/web' does not provide an export named 'className' |
| consumer-browser-import | `node --conditions=browser -e "import('./packages/kit/dist/esm/index.js')"` | FAIL | 0.1 | Error: Styles were unable to be assigned to a file. This is generally caused by one of the following: |
| sizes | `node tools/baseline/sizes.mjs /var/folders/fl/zcmyh0g16cn9zycd8sv440400000gn/T/codeui-baseline-Ftnr4D/package` | PASS | 0.21 |  |
| storybook-build | `pnpm --filter @codeui/storybook-playground exec storybook build --output-dir /Users/riccardoperra/.t3/worktrees/codeui/t3-6fbe4be0-b9b5556357ab428d/tools/baseline/storybook-static --disable-telemetry` | FAIL | 0.88 | SB_CORE-SERVER_0002 (CriticalPresetLoadError): Storybook failed to load the following preset: /Users/riccardoperra/.t3/worktrees/codeui/t3-6fbe4be0-b9b5556357ab428d/node_modules/.pnpm/storybook-solidjs-vite@1.0.0-beta.2_storybook@8.3.0_typescript@5.6.2_vite@5.4.4_@types+node@2_z7fts7wwrrihd4dshr5rqdsnbi/node_modules/storybook-solidjs-vite/preset. ReferenceError: module is not defined in ES module scope |
| storybook-build-compatible | `NODE_OPTIONS=--require=/Users/riccardoperra/.t3/worktrees/codeui/t3-6fbe4be0-b9b5556357ab428d/tools/baseline/compat.cjs pnpm --filter @codeui/storybook-playground exec storybook build --output-dir /Users/riccardoperra/.t3/worktrees/codeui/t3-6fbe4be0-b9b5556357ab428d/tools/baseline/storybook-static --disable-telemetry` | PASS | 5.24 |  |
| screenshots | `node tools/baseline/screenshots.mjs` | FAIL | 316.2 | designsystem-button--docs dark: Hashes differ |
| a11y | `node tools/baseline/a11y.mjs` | FAIL | 373.39 | configure-your-project--docs dark: color-contrast, heading-order, landmark-one-main, region |

## Runtime compatibility and limits

The unmodified Storybook command fails under Node 26 because the Solid framework publishes CommonJS .js presets inside a type=module package. The harness-only compat.cjs load hook treats only those renderer/framework .js files as CommonJS. The installed Solid framework and renderer both publish CommonJS .js files under type=module. Changing the configured framework path does not repair the renderer preset or those package scopes. A dependency packaging fix is required, so K0 retains the hook without a dependency bump. This preserves the original Storybook config and story sources. Its command result is recorded separately. pnpm 9 rejects filtered pack as recursive, so the harness retries pack with --dir packages/kit. Turbo build results may be cached. A successful build can still contain TypeScript warnings, retained in build-kit.log.

## Story inventory and screenshots

Storybook 8 uses storybook-solidjs-vite, not the unused vanilla Vite starter in src/main.ts. The static Storybook build index is the authoritative inventory, including documentation pages. 113 stories and 19 docs pages. Each page is captured in both themes twice in fresh browser contexts. Remote stylesheets receive empty CSS and other remote requests are blocked so Google Fonts and other remote assets cannot vary between captures. Aborting the Google CSS import initially broke Vite CSS preloading. A single-story probe verified the corrected handling before the full run. Only the corrected full-run results are retained. The screenshots use the local system font fallback. SHA-256 hashes are in baseline/screenshots.json. The first capture is saved under baseline/shots/<theme>/<id>.png. ThemeWrapper sets data-cui-theme on html. The scripts set that same attribute after rendering and emulate the corresponding color scheme. No menus or dialogs are opened beyond their default story state. Full-page screenshots use a fixed viewport but can have different document heights.

264 theme/page pairs. 251 identical pairs. 14 flaky, failed, or errored pairs. 225 story/theme pairs passed both rendering and hash comparison. Documentation hash mismatches remain baseline findings rather than library-source fixes.

- designsystem-button--docs / dark. Hashes differ
- designsystem-checkbox--docs / dark. Hashes differ
- designsystem-iconbutton--docs / dark. Hashes differ
- designsystem-numberfield--docs / dark. Hashes differ
- designsystem-select--docs / dark. Hashes differ
- designsystem-textarea--docs / dark. No rendered content
- designsystem-textfield--text-field-story / dark. No rendered content
- designsystem-iconbutton--docs / light. Hashes differ
- designsystem-listbox--docs / light. Hashes differ
- designsystem-numberfield--docs / light. Hashes differ
- designsystem-pagination--docs / light. Hashes differ
- designsystem-segmentedcontrol--docs / light. Hashes differ
- designsystem-textarea--docs / light. Hashes differ
- designsystem-tooltip--docs / light. Hashes differ

## Accessibility

Axe scans each rendered iframe document in both themes, including default Storybook wrapper content. Violations include page-level rules and do not prove every violation originates in the component. Hidden interaction states are outside this baseline. Full violations, affected nodes, incomplete checks, and passing rules are in baseline/a11y.json. The title of each indexed page groups its component. Documentation pages are included in those groups. Counts are occurrences, not distinct underlying defects.

264 scans. 1 failed or errored scans. 816 rule/page/theme violations. 2574 affected-node occurrences.

| Rule | Page/theme occurrences | Nodes | Components |
| --- | --- | --- | --- |
| color-contrast | 80 | 500 | Configure your project, DesignSystem/Button, DesignSystem/Checkbox, DesignSystem/Dialog, DesignSystem/DropdownMenu, DesignSystem/IconButton, DesignSystem/Listbox, DesignSystem/NumberField, DesignSystem/RadioList, DesignSystem/SegmentedControl, DesignSystem/Select, DesignSystem/Tabs, DesignSystem/TextArea, DesignSystem/TextField, DesignSystem/Tooltip |
| heading-order | 4 | 6 | Configure your project, DesignSystem/Icons |
| landmark-one-main | 262 | 262 | Configure your project, DesignSystem/Button, DesignSystem/Checkbox, DesignSystem/Dialog, DesignSystem/DropdownMenu, DesignSystem/IconButton, DesignSystem/Icons, DesignSystem/Link, DesignSystem/Listbox, DesignSystem/NumberField, DesignSystem/Pagination, DesignSystem/Popover, DesignSystem/RadioList, DesignSystem/SegmentedControl, DesignSystem/Select, DesignSystem/Tabs, DesignSystem/TextArea, DesignSystem/TextField, DesignSystem/Tooltip |
| region | 196 | 1480 | Configure your project, DesignSystem/Button, DesignSystem/Checkbox, DesignSystem/Dialog, DesignSystem/DropdownMenu, DesignSystem/IconButton, DesignSystem/Icons, DesignSystem/Link, DesignSystem/Listbox, DesignSystem/NumberField, DesignSystem/Pagination, DesignSystem/Popover, DesignSystem/RadioList, DesignSystem/SegmentedControl, DesignSystem/Select, DesignSystem/Tabs, DesignSystem/TextArea, DesignSystem/TextField, DesignSystem/Tooltip |
| page-has-heading-one | 224 | 224 | DesignSystem/Button, DesignSystem/Checkbox, DesignSystem/Dialog, DesignSystem/DropdownMenu, DesignSystem/IconButton, DesignSystem/Icons, DesignSystem/Link, DesignSystem/Listbox, DesignSystem/NumberField, DesignSystem/Pagination, DesignSystem/Popover, DesignSystem/RadioList, DesignSystem/SegmentedControl, DesignSystem/Select, DesignSystem/Tabs, DesignSystem/TextArea, DesignSystem/TextField, DesignSystem/Tooltip |
| aria-allowed-attr | 22 | 58 | DesignSystem/Button, DesignSystem/Checkbox, DesignSystem/IconButton, DesignSystem/Listbox, DesignSystem/NumberField, DesignSystem/RadioList, DesignSystem/SegmentedControl, DesignSystem/Select, DesignSystem/TextArea, DesignSystem/TextField, DesignSystem/Tooltip |
| aria-input-field-name | 18 | 34 | DesignSystem/Listbox |
| landmark-unique | 4 | 4 | DesignSystem/Pagination |
| select-name | 4 | 4 | DesignSystem/SegmentedControl, DesignSystem/Tooltip |
| label-content-name-mismatch | 2 | 2 | DesignSystem/Select |

| Component | Scans | Rule occurrences | Nodes | Rules |
| --- | --- | --- | --- | --- |
| Configure your project | 2 | 8 | 40 | color-contrast, heading-order, landmark-one-main, region |
| DesignSystem/Button | 24 | 60 | 169 | color-contrast, landmark-one-main, page-has-heading-one, aria-allowed-attr, region |
| DesignSystem/Checkbox | 8 | 27 | 143 | landmark-one-main, page-has-heading-one, region, aria-allowed-attr, color-contrast |
| DesignSystem/Dialog | 6 | 16 | 54 | color-contrast, landmark-one-main, region, page-has-heading-one |
| DesignSystem/DropdownMenu | 6 | 16 | 24 | color-contrast, landmark-one-main, region, page-has-heading-one |
| DesignSystem/IconButton | 20 | 44 | 84 | landmark-one-main, page-has-heading-one, aria-allowed-attr, color-contrast, region |
| DesignSystem/Icons | 6 | 16 | 62 | landmark-one-main, page-has-heading-one, region, heading-order |
| DesignSystem/Link | 8 | 22 | 40 | landmark-one-main, region, page-has-heading-one |
| DesignSystem/Listbox | 18 | 75 | 217 | aria-allowed-attr, aria-input-field-name, color-contrast, landmark-one-main, region, page-has-heading-one |
| DesignSystem/NumberField | 30 | 100 | 542 | aria-allowed-attr, color-contrast, landmark-one-main, region, page-has-heading-one |
| DesignSystem/Pagination | 8 | 22 | 50 | landmark-one-main, landmark-unique, region, page-has-heading-one |
| DesignSystem/Popover | 8 | 16 | 24 | landmark-one-main, page-has-heading-one, region |
| DesignSystem/RadioList | 12 | 39 | 91 | landmark-one-main, page-has-heading-one, region, aria-allowed-attr, color-contrast |
| DesignSystem/SegmentedControl | 20 | 66 | 132 | landmark-one-main, page-has-heading-one, region, aria-allowed-attr, color-contrast, select-name |
| DesignSystem/Select | 24 | 75 | 370 | aria-allowed-attr, color-contrast, landmark-one-main, region, page-has-heading-one, label-content-name-mismatch |
| DesignSystem/Tabs | 10 | 32 | 52 | landmark-one-main, region, color-contrast, page-has-heading-one |
| DesignSystem/TextArea | 22 | 77 | 223 | aria-allowed-attr, color-contrast, landmark-one-main, region, page-has-heading-one |
| DesignSystem/TextField | 22 | 77 | 201 | aria-allowed-attr, color-contrast, landmark-one-main, region, page-has-heading-one |
| DesignSystem/Tooltip | 10 | 28 | 56 | landmark-one-main, page-has-heading-one, aria-allowed-attr, color-contrast, region, select-name |

## Package health and consumer requirements

The tarball is retained as baseline/kit.tgz. Attw reports InternalResolutionError (46 instances), CJSResolvesToESM (1 instances). Full resolution traces are in baseline/attw.json. publint and attw run on its extracted contents or tarball. The packed manifest contains example-basic = `link:/Users/riccardoperra/WebstormProjects/pipelineui/packages/app`. This is a machine-local dependency, unsuitable for consumers.

0 emitted .css files, 0 CSS bytes. 52 emitted .css.js/.css.jsx/.css.ts modules. The packed module inventory and sample implementation are in baseline/package.json. The sample Button.css.js calls style, createVar, and recipe. foundation/themes.css.js calls createGlobalTheme. These calls remain in dist/esm and dist/source, with no file-scope wrapper. A browser-conditioned direct import fails with "Styles were unable to be assigned to a file", recorded in consumer-browser-import.log. A plain Node import also fails on Solid DOM exports, recorded in consumer-import.log.

The following consumer requirements are inferred from the emitted code and package exports, rather than a validated packed-consumer setup. Consumers must supply solid-js matching the peer range ^1.7.0 and a Solid-aware build that selects the solid export for JSX. They also need vanilla-extract build-time extraction of the shipped .css.js modules, for example the Vite plugin, and data-cui-theme=light or dark. There is no ready-made stylesheet to import. The existing playground instead aliases @codeui/kit to source and runs vanillaExtractPlugin with unstable_mode=transform, so its successful rendering does not validate a packed consumer setup. The tarball is currently blocked for normal adoption by its local link dependency and unprocessed styles. The package declares the vanilla-extract runtime and Vite plugin as regular dependencies, but installation alone does not extract its CSS. Size-limit output follows.

```json
[
  {
    "name": "ESM entry with reachable bundled modules, minified and gzipped",
    "size": 106068
  }
]

```

The ESM entry measurement includes reachable modules bundled by size-limit's small-lib preset, minified and gzipped. It is a whole-entry import, not the cost of one tree-shaken component. The extracted tarball temporarily links to the installed kit dependency graph for resolution. Dependencies included by the bundler affect the number. The measurement includes unprocessed vanilla-extract JavaScript, not an extracted consumer CSS bundle. CSS bytes count only literal emitted .css files, not CSS represented by JavaScript modules.

## K0 checks

The corrected root filters reach the kit. Tests fail on the starter tests’ missing Hello and createHello exports. Typecheck also reports errors in FieldMessage, VirtualizedListbox, and Maskito. Library source remains unchanged. See [K0 verification](./k0-verification.md) for the API mutation proof and screenshot comparison.
