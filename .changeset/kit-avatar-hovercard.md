---
"@codeui/kit": minor
"@codeui/styles": minor
---

Add Avatar (`@codeui/kit/avatar`, styles in `@codeui/styles/avatar`) and bring HoverCard in line with the Inkstone guide.

- `Avatar` shows a person's picture, or one or two initials on a fill whose hue comes from a stable `identifier` (never the name). It has a full radius with a neutral 20% ring, sizes `xs` to `lg` from the shared control scale and density, the name as its accessible name and in the kit Tooltip, and a dashed `unassigned` state. `avatarHue` and `avatarInitials` are exported.
- `HoverCard` opens at once on click as well as on hover and focus. On a touch screen the first tap on a link opens the card instead of following it. The default placement is `right-start` (it was `bottom`), and the card wraps long words.
- `HoverCardList` and `HoverCardItem` render a list inside a hover card: one line per entry with a state icon, an identifier and a truncated title, nesting by `depth`, capped at 24rem with its own scroll.
