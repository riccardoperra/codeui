---
"@codeui/kit": minor
---

Adopt one token contract as CSS custom properties, with the CodeImage look as the default theme.

- New `tokens` export: every value is `var(--cui-…)` with a stable name, for example `--cui-surface-canvas` and `--cui-action-brand-base`. Override them with plain CSS.
- All kit CSS is in the `cui` cascade layer, so unlayered app CSS always wins. An app CSS reset must be layered below `cui`.
- Without `data-cui-theme`, the kit follows `prefers-color-scheme`.
- `themeVars` and `themeTokens` keep working and point at the new variables. Font sizes follow the new scale: `xs` is 12px, `lg` 18px and `xl` 20px.
- Every component changes appearance. Brand, danger and status colors now meet WCAG AA text contrast. Motion is shorter, with one ease-out curve. The button press takes 120ms.
