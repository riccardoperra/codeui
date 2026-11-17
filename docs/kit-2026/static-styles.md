# Static styles and the Solid adapter

The supported component framework remains Solid. `@codeui/styles` owns plain CSS and builds the Inkstone theme from DTCG JSON through Toghen. `@codeui/kit` owns rendering and behavior through Kobalte. The CSS package has no framework peers, style injection or runtime dependency on vanilla-extract.

Solid renderer modules import their component CSS and theme automatically. Their JavaScript remains removable through package side-effect metadata, while CSS assets are marked as side effects. CSS-only consumers load `@codeui/styles/all.css`, or `theme.css` and individual component files. A component file includes shared styles reachable through its declared dependency closure. All variants and runtime states remain available inside that file.

## Public contracts

`contract.json` records public classes, variants, variables and part names. The build checks it against the class and token helper exports. An intentional contract change requires reviewing and regenerating that file. CSS and contracts were compared across different checkout paths. Private JavaScript chunk filenames remain bundler-managed.

`manifest.json` records CSS entry closures. The renderer-import guard independently checks these declarations against Solid source imports. It also checks that renderer imports load the required CSS and theme automatically. Its traversal is conservative, so styles used by shared renderer helpers can remain in the closure even when a specific caller uses only another helper result.

All original raw style export names remain available through the kit. Its emitted style modules forward to compiled styles, including under the `solid` export condition. The API snapshot follows the style declarations across this package boundary. Public `responsiveStyle` still accepts pseudo-classes, CSS variable references, fallbacks and query blocks.

The CSS exposes neutral geometry inputs for positioning, progress and toast gestures. The Solid adapter maps Kobalte variables locally on the elements that receive them. CSS-only callers supply behavior and geometry for custom controls.

## Cascade and design

Styles remain under the parent `cui` layer. The inner order is `base`, `components`, then `overrides`. FieldLabel and IconButton use the priorities required for their known composition cases. The CSS-only consumer checks forward, reverse and duplicate stylesheet orders.

This migration preserves Inkstone rendering in the checked baseline cases. Existing size labels are retained. For example, Button `md` remains 40px even though the design table describes 36px standard desktop controls. Changing that default is a separate visual change under DESIGN.md, rather than a side effect of packaging.

## Verification

The implementation was checked with workspace tests and typechecks, the public API snapshot, docs lint and export coverage, and production builds of Storybook and docs demos.

The packed consumer renders with no vanilla-extract plugin. The CSS-only fixture installs styles without Solid and runs with browser JavaScript disabled. Real Vite and webpack builds check unused imports, selective Button CSS and lazy Dialog splitting. The rendering comparison covers both themes, three viewports and Switch off/on states on Chromium, Firefox and WebKit. Computed styles and screenshots match their pre-migration captures. The harness detects an intentional opacity change and uses the repository's software-rasterization flags for deterministic Chromium captures.

Commands and reproduction details are in [consumer.md](consumer.md), [the styles package](../../packages/styles/README.md) and [the verification tools](../../tools/styles/README.md).

## Server portals

Dialog, Popover, Sheet and CommandMenu now render open or force-mounted content in server HTML. The private HydratablePortal adopts the same subtree during hydration. A transparent source placeholder keeps the native portal marker connected to its logical parent, so delegated events still bubble there. The native portal relocation effect is queued before eager child effects, preserving synchronous autofocus. Native Portal still owns movement, target changes, refs and cleanup. Client-only portals keep the existing path.

A server-only branch that simply returns children was rejected because the client Portal would skip their hydration. Manual DOM relocation was also rejected because it would have to duplicate Solid's event ancestry and cleanup behavior. The implementation uses no private Solid DOM properties. The two design candidates and the subsequent hydration regressions determined the final source-placeholder and effect-order requirements.

The packed consumer now verifies both server bodies and exact-node adoption in a real browser. Its previous portal assertion is preserved and passes. Other Kobalte overlay families retain their current portal behavior; this change covers the Dialog and Popover primitives and the kit's derived dialog portals.
