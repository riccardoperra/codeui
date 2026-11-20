# Packed kit and CSS consumers

The kit builds its styles from plain CSS and DTCG JSON before publishing. Consumers install the packed `@codeui/kit` and `@codeui/styles` artifacts without a vanilla-extract plugin.

## Run the consumer check

Use the Node and pnpm versions required by the repository. From its root, run:

```sh
pnpm install --frozen-lockfile
node examples/run-consumer-check.mjs
```

The runner builds both packages, packs them, and installs the tarballs into three independent temporary npm dependency trees. No workspace alias can hide a missing published file.

- The Vite consumer imports no kit CSS manually and renders Button, Switch, TextField, Select, Dialog, Popover and SegmentedControl.
- The SSR consumer compiles the same components with the Solid 2 Vite plugin.
- The CSS-only consumer installs only styles and renders a native button with JavaScript disabled. No Solid package or browser script is required.

The browser checks component markers, rendering errors, the Button fill against the current theme token, and a plain CSS brand override. The CSS-only check also loads composed FieldLabel and SwitchLabel classes, and Button and IconButton classes, in forward, reverse and duplicate stylesheet orders.

`@codeui/styles/all.css` includes the theme and every component. Solid components import their CSS and theme automatically. CSS-only selective consumers load `theme.css` and the files for the components they use. Each file contains its shared dependency closure. All variants and runtime states remain in that file.

Add `--keep` to retain the installed fixtures and production builds. The runner prints their directory. It closes its browser and servers before exiting.

## Server portals and hydration

The command checks that Dialog and Popover bodies exist in server HTML. It also writes a server-rendered page with Solid's hydration script and the browser build. The browser check delays module loading to capture the server nodes, then starts hydration. The same two nodes must survive, appear exactly once and move outside the app container into their portal targets. Browser errors fail this check.

Open or force-mounted Dialog, Popover, Sheet and CommandMenu portals render inline at their declaration on the server. Hydration adopts the server nodes and moves them into the portal target. Closed content stays absent unless force-mounted. Place these portals in a valid flow-content context. The native client-only path still handles portals opened after hydration.

Focused SSR and hydration tests cover open and closed states, defaultOpen, forceMount, nested portals, typed input preservation, delegated events, autofocus, target changes, close/reopen, Escape, focus return and disposal.

## Check production CSS selection

Install the isolated verification tools and use the retained CSS-only fixture:

```sh
npm ci --prefix tools/styles --ignore-scripts --no-audit --no-fund
node tools/styles/bundle-check.mjs <consumer-artifacts>/css
```

Both Vite and webpack compile three cases for CSS-only imports and three for Solid component imports without manual CSS. An unused class-helper import emits no CSS. A Button consumer includes Button and its shared styles, without Dialog, Switch or Combobox. A lazy Dialog import produces a separate CSS chunk and keeps Dialog rules out of the initial CSS.

The component source-import guard in `packages/styles/scripts/renderers.mjs` checks the registry against Solid renderer imports. It catches missing styles for rendered labels, errors, icons and nested components rather than trusting only the declared registry.

## Compare rendering before and after a change

`tools/styles/parity.mjs` serves an already built fixture and records computed styles, pseudo-elements and screenshots. It covers both themes, three Inkstone viewports and Switch off/on states. Build the same App against both package versions before comparing.

```sh
node tools/styles/parity.mjs <base-fixture> <baseline-output>
node tools/styles/parity.mjs <head-fixture> <head-output> <baseline-output>
```

The fixture supplies Vite and Playwright. `CODEUI_PLAYWRIGHT` can point to another installed Playwright entry. Set `CODEUI_PARITY_MUTATION=1` for a sensitivity check. The deliberate button opacity change must fail comparison with the unmodified baseline.

## Historical baseline

The original check on 2026-11-16 found that unpacked style modules threw `Styles were unable to be assigned to a file` without a consumer plugin. Adding the plugin enabled browser rendering but still omitted the two portal bodies in SSR. The previous `--with-vanilla-extract` workaround is no longer a runner mode. The default fixtures now consume precompiled CSS directly.
