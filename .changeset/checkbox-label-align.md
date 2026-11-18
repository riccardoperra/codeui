---
"@codeui/styles": patch
---

Center the Checkbox label on the box. The label kept a fixed height equal to the box and placed its shorter text at the top, 1.5px to 6px too high from `sm` to `xl`. It now uses a minimum height and centers its text, so a wrapping label still grows.
