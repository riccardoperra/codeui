---
"@codeui/styles": patch
---

Size kit elements with `box-sizing: border-box` from `theme.css`. Without a page reset, a TextField was 2px taller and a SegmentedControl 8px taller than a Button of the same size. The rule is in `@layer cui.base` at zero specificity.
