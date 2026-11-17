---
"@codeui/kit": minor
---

Theme the shape and the brand with two tokens. `--cui-radius-scale` multiplies every radius except `none` and `full`. The brand hover, active, soft, focus and selection colors are now computed from `--cui-action-brand-base` with CSS relative colors, and resolve to the same Inkstone values. Danger, caution and success compute their hover and active from their base the same way. Browsers without relative colors keep the fixed values. The radii and the computed brand colors are now set again on each `[data-cui-theme]` scope, so an override of one of them written only on `:root` stops at the first nested scope. Write `:root, [data-cui-theme]` to reach every scope.
