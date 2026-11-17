# Stable CSS contract pilot

Button, IconButton, Switch and Dialog use authored part names from
`packages/styles/src/registry.ts`. The package publishes its reviewed snapshot as
`@codeui/styles/public-registry.json`; the build rejects snapshot drift.
Other 36 components retain the extraction branch's emission and debug identifiers.

The emitter consumes the existing vanilla-extract rule objects. Recipe runtime
metadata and string helpers remain available. Effective axis predicates combine
attributes with private classes gated by attribute absence, including compounds.
State selectors are deferred until after variant declarations. IconButton and
Dialog close buttons share Button selectors and square dimensions. No overrides
layer remains. Theme assignments use the tokens layer.

Deviation from #124: the proposed Dialog md default does not exist in #123.
An omitted size retains the existing full available width. Chrome defaults to bar,
and sections to group. Button defaults to md without a theme; Switch to md.
Local Button and Dialog variable names retain #123's explicitly authored strings.

Run after building:
- `node tools/styles/contract-pilot.mjs`: helper, attribute, conflicting and mixed
  compound inputs; six stylesheet permutations; Switch inheritance; utility layers.
- `node tools/styles/contract-parity.mjs`: Storybook on port 6006 versus CSS-only
  HTML. Outputs HTML, paired screenshots, computed styles and browser errors under
  `.artifacts/styles-pilot-parity/`. Both themes and three viewports.
- Existing package, consumer, SSR and hydration checks remain required.

DESIGN §12 review: this changes the styling interface, preserving existing fills,
type, radii, targets and motion. Existing Button md 40px, Dialog bar divider and
Button/Switch hover/motion drift remain; these are not new Inkstone rules.
The static fixtures test visual styling, not focus traps or interactive semantics.
The package's browser/SSR/hydration suites cover those behaviors.
