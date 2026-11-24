---
"@codeui/kit": minor
"@codeui/styles": minor
---

Add HoverCard (`@codeui/kit/hover-card`) and Resizable (`@codeui/kit/resizable`), with their styles in `@codeui/styles/hovercard` and `@codeui/styles/resizable`.

- `HoverCard`, `HoverCardTrigger` and `HoverCardContent` show supplementary details on hover or keyboard focus. The card opens after 500ms, closes 150ms after the pointer leaves, closes on Escape, uses the Popover surface with a 320px max width, and does not animate when opened from the keyboard.
- `Resizable`, `ResizablePanel` and `ResizableHandle` split a row or a column into panels sized by fractions or `"240px"` strings, with `minSize`, `maxSize` and `collapsible`. The handle is an 8px hit area with a 1px line that changes colour on hover, drag and focus, and it moves with the arrow keys, Home and End.
