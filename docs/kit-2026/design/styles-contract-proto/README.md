# CSS contract proof

Open index.html directly, or follow the reproduction commands in ../styles-contract.md.
Only emitted CSS, a layered reset and plain captured HTML render the fixtures.

emit.mjs compiles main-line kit sources in an untracked .artifacts scratch copy.
Its post-compile translation is intentionally a feasibility prototype, not a
production emitter. See the contract for helper compatibility and state/default
precedence requirements not implemented here. capture.mjs requires local Storybook
on port 6006 and Playwright from tools/baseline. It normalizes both fonts to Arial
and disables animations for comparison. Static controls do not implement Kobalte
behavior. Do not reuse these fixtures as accessible interactive components.
