# Static styles and the Solid adapter

The supported component framework remains Solid. `@codeui/styles` owns the vanilla-extract sources and compiles them before publishing. `@codeui/kit` owns rendering and behavior through Kobalte. The CSS package has no framework peers, style injection or runtime dependency on vanilla-extract.

Load `@codeui/styles/all.css` for the theme and all components. For selection, load `theme.css` and the individual component files. JavaScript component imports do not load CSS automatically. A component file includes shared styles reachable through its declared dependency closure. All variants and runtime states remain available inside that file.

## Public contracts

`contract.json` records public classes, variants, variables and part names. Unnamed vanilla-extract identifiers fail the build. An intentional contract change requires reviewing and regenerating that file. CSS and contracts were compared across different checkout paths. Private JavaScript chunk filenames remain bundler-managed.

`manifest.json` records CSS entry closures. The renderer-import guard independently checks these declarations against Solid source imports. Its traversal is conservative, so styles used by shared renderer helpers can remain in the closure even when a specific caller uses only another helper result.

All original raw style export names remain available through the kit. Its emitted style modules forward to compiled styles, including under the `solid` export condition. The API snapshot follows the style declarations across this package boundary. Public `responsiveStyle` still accepts pseudo-classes, CSS variable references, fallbacks and query blocks.

The CSS exposes neutral geometry inputs for positioning, progress and toast gestures. The Solid adapter maps Kobalte variables locally on the elements that receive them. CSS-only callers supply behavior and geometry for custom controls.

## Cascade and design

Styles remain under the parent `cui` layer. The inner order is `base`, `components`, then `overrides`. FieldLabel and IconButton use the priorities required for their known composition cases. The CSS-only consumer checks forward, reverse and duplicate stylesheet orders.

This migration preserves Inkstone rendering in the checked baseline cases. Existing size labels are retained. For example, Button `md` remains 40px even though the design table describes 36px standard desktop controls. Changing that default is a separate visual change under DESIGN.md, rather than a side effect of packaging.

## Verification

The implementation was checked with workspace tests and typechecks, the public API snapshot, docs lint and export coverage, and production builds of Storybook and docs demos.

The packed consumer renders with no vanilla-extract plugin. The CSS-only fixture installs styles without Solid and runs with browser JavaScript disabled. Real Vite and webpack builds check unused imports, selective Button CSS and lazy Dialog splitting. The rendering comparison covers both themes, three viewports and Switch off/on states on Chromium, Firefox and WebKit. Computed styles and screenshots match their pre-migration captures. The harness detects an intentional opacity change and uses the repository's software-rasterization flags for deterministic Chromium captures.

Commands and reproduction details are in [consumer.md](consumer.md), [the styles package](../../packages/styles/README.md) and [the verification tools](../../tools/styles/README.md).

## Existing SSR limitation

The packed consumer command still exits nonzero because it requires Dialog and Popover portal bodies in server HTML. Those bodies were also absent before this migration. Browser rendering, CSS-only rendering, overrides and SSR compilation pass independently. The existing portal-body assertion remains visible and has not been weakened. This change does not alter portal rendering or introduce another framework adapter.
