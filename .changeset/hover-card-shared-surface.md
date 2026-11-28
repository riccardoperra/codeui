---
"@codeui/kit": minor
---

Hover cards share one card and move it between triggers.

- All the hover cards of a page share one card. Moving the pointer or keyboard focus to another trigger while a card is open moves that card at once: it slides to the new trigger, resizes to the new content, and fades the new content in. For 400ms after a card closes, the next one opens at once and without the pop. The move lasts 200ms (`--cui-motion-duration-panel`) with the kit's ease-out. While the pointer is on its way to the open card, another trigger it crosses takes the card only after 150ms of rest. A move from the keyboard swaps the content in place with no motion; with reduced motion only the new content fades in.
- `HoverCardGroup` gives the cards inside it a card of their own, with `skipDelayDuration` for the skip window. `shared={false}` gives one `HoverCard` its own surface; `forceMount` implies it.
- `HoverCardContent` is no longer polymorphic. Its `class`, `classes`, `style`, `ref`, `mount` and dismiss handlers go on the card; other attributes and event handlers go on a `display: contents` element around the children.
- `HoverCard` drops the Kobalte root options it never used (`id`). The trigger renders without a Kobalte popover anchor and still sets `data-expanded` and `data-closed`.
- Overlays opened by hover tell pointer from keyboard more reliably: the input tracker also records `pointerover`, which the browser fires before the `pointermove` that crosses into an element.
