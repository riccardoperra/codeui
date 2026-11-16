# K0 verification

`pnpm test` now reaches Jest. It exits 1 because the starter tests import `Hello` and `createHello`, which the kit does not export. The client suite fails before the sequential SSR command runs.

`pnpm typecheck` now reaches TypeScript. It exits 2 with errors in FieldMessage's generic props, VirtualizedListbox's possibly undefined element, Maskito's asynchronous element type, and both starter tests' missing exports. K0 leaves library source and tests unchanged.

`pnpm api:update` generated the reachable emitted declaration graph. `pnpm api:check` passed. A temporary Rollup emitter change appended `export type K0SnapshotProbe = string` to the entry declaration. `pnpm api:check` exited 1 with "Public API differs". After restoring the config, it passed. This probe changed no library source.

`node tools/baseline/run.mjs` rebuilt Storybook with the scoped Node 26 hook. The original unmodified command still fails because both Solid packages publish CommonJS `.js` files under `type=module`. A config path change cannot change those package scopes. K0 retains the hook and makes no dependency bump.

The rerun's 226 story/theme screenshot hashes match all 226 original Phase 0 hashes. The comparison joined the saved original and rerun `screenshots.json` records by theme and story ID, then compared the first SHA-256 hash. Documentation pages are outside this claim. Thirteen documentation/theme pairs differed between the two fresh captures. The screenshot step exits nonzero for those docs pages.

Build the Lever shaped the committed API script. Prove It Works required the mutation rejection, restored passing check, and direct screenshot hash comparison.
