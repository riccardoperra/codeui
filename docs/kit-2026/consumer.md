# Packed kit consumer check

K9 checks whether another Solid app can use the packed kit without CodeImage's build setup. S1 must make the default command pass.

## Run the check

Run these commands from the repository root with Node 20.19 or a supported newer Node version, pnpm 9.5, and npm available.

```sh
pnpm install --frozen-lockfile
node examples/run-consumer-check.mjs
```

The runner builds the kit, runs `pnpm --dir packages/kit pack`, and installs the tarball into fresh copies of both fixtures under the system temporary directory. These copies have independent npm dependency trees. Neither fixture is in the pnpm workspace. The runner removes its temporary files and stops its server after the check. Chromium installation requires network access on the first run.

The Vite fixture uses Solid's browser compiler. The SSR fixture uses Solid's server compiler, bundles the kit through Vite's `solid` condition, and executes `renderToString` in Node. Neither default configuration includes vanilla-extract. Both render Button, TextField, Select, an open Dialog, an open Popover, and SegmentedControl. The theme attribute is also on the document root so portaled browser content inherits the theme.

The browser check serves the production build on port 6126. It requires all six component markers and no browser errors. It compares the primary Button background with the K5 brand token, `#0070f0`, then adds plain CSS that sets `--cui-action-brand-base` to `rgb(17, 34, 51)`. The second comparison must see that exact color. The SSR check requires form component markers and both overlay bodies in the rendered string. A blocked assertion is a FAIL, and any FAIL makes the command exit nonzero.

## Verify the consumer workaround

```sh
node examples/run-consumer-check.mjs --with-vanilla-extract
```

This command installs `@vanilla-extract/vite-plugin@4.0.15` into temporary copies only. It adds `vanillaExtractPlugin()` before `solid()` in each Vite configuration and uses port 6127. The committed fixtures remain free of the plugin.

## CI

The separate `consumer.yml` workflow runs only through `workflow_dispatch`. Its failures remain visible and do not participate in the push workflow. It has no `continue-on-error` setting. Dispatch it against this branch to reproduce the expected failure, and against S1 to check the replacement styling output.

## Results on 2026-11-16

Measured against K5 commit `4b5be61c96b1602145634ee7b38cf1de969d0e4b` with Node 26.5.0 and pnpm 9.5.0.

The plugin copy builds and executes SSR, but its output omits `Dialog body` and `Popover body`. Kobalte portals do not emit their contents in this server render. The assertion deliberately keeps that gap visible. Adding the plugin alone does not make the full SSR assertion pass. S1 must address the styling failure and account for this overlay markup requirement rather than weakening the check.

| Assertion                   | Without plugin                                             | With plugin                                                                |
| --------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| Vite build                  | PASS                                                       | PASS                                                                       |
| SSR build                   | PASS                                                       | PASS                                                                       |
| Page renders without errors | FAIL, style evaluation throws before any component renders | PASS, all six markers present and no browser errors                        |
| Button background           | FAIL, Button absent after page load                        | PASS, `rgb(0, 112, 240)`                                                   |
| Plain CSS token override    | FAIL, Button absent after page load                        | PASS, `rgb(0, 112, 240)` changes to `rgb(17, 34, 51)` after its transition |
| SSR markup                  | FAIL, style evaluation throws in Node                      | FAIL, `missing Dialog body, Popover body`                                  |

Both default runtime paths report this exact error:

```text
Styles were unable to be assigned to a file. This is generally caused by one of the following:

- You may have created styles outside of a '.css.ts' context
- You may have incorrect configuration. See https://vanilla-extract.style/documentation/getting-started
```

The Node stack starts in `@vanilla-extract/css/fileScope` at `getFileScope`, called by `globalLayer`. The browser has none of the six required component markers after this exception. Both commands exit 1. The plugin is the verified minimum addition for this browser fixture. It fixes SSR style evaluation too, but the full SSR check still fails on portaled content. No fully passing SSR setup is claimed here.
