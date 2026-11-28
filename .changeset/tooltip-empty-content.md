---
"@codeui/kit": patch
---

Tooltip no longer opens an empty bubble when `content` is `undefined`, `null` or `""`. Hover and focus leave it closed, and the trigger gets no `aria-describedby`, so passing `content={undefined}` turns the tooltip off. The trigger and its children render as before.
