# S1 plain CSS authoring

These four stylesheets are the declaration source. They were seeded from #126's
emitted rules, then checked in for direct editing; the build never regenerates
them from TypeScript. Button owns the shared Button/IconButton/Dialog-close
selector list. IconButton owns the square modifier; Dialog still depends on both.
Native nested media rules are compiled by Lightning CSS 1.30.1 (released 2025-05-14).
All normal selectors retain the whole-selector `:where()` boundary.

`themeValues` in `foundation/theme-values.ts` remains the single token source.
The existing theme generator produces both CSS assignments and the typed `tokens`
references, shared by both authoring paths. S1 deliberately retains that generator;
it does not duplicate tokens in CSS or migrate the other 36 components. Computed
colors belong to that shared token/derived-color path; these four component files
only reference them, so no component-side color computation needs `color-mix()`.

Private helper aliases are handwritten/frozen in `private-classes.json`, rather
than regenerated from declaration order. This preserves class-only consumers and
keeps the build independent of a selector rewriting emitter. The `*.css.ts` modules
now contain only typed compatibility metadata. `*.css.contract.ts` preserves the
existing recipe metadata types (including legacy rule shapes); it is not another
style source. The build checks these types then publishes the same declaration
files under their original paths. Adding a variant requires CSS, metadata, and
registry edits. This duplication is a material cost of retaining the exact API.

`component-variables.json` documents the allowed component variables: Button theme
slots, Dialog theme slots, Switch track width/height/thumb size, and the inherited
layout background and icon size slots. These are compatibility names, including
mixed-case spellings. `public-registry.json` separately owns public parts and
public theme variables. Run `node packages/styles/scripts/plain-lint.mjs` at root.
The build also runs it. Unknown token references and unregistered part classes fail;
private aliases require explicit inventory. Never whitelist a typo as a private alias.
