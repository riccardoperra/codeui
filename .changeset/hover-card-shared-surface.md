---
"@codeui/kit": minor
"@codeui/styles": minor
---

Hover cards share one card and move it between triggers.

- All the hover cards of a page share one card. Moving the pointer or keyboard focus to another trigger while a card is open moves that card at once: it slides to the new trigger, resizes to the new content, and fades the new content in. For 400ms after a card closes, the next one opens at once and without the pop. The move lasts 200ms (`--cui-motion-duration-panel`) with the kit's ease-out. While the pointer is on its way to the open card, another trigger it crosses takes the card only after 150ms of rest. A move from the keyboard swaps the content in place with no motion; with reduced motion only the new content fades in.
- `HoverCardGroup` gives the cards inside it a card of their own, with `skipDelayDuration` for the skip window. `shared={false}` gives one `HoverCard` its own surface; `forceMount` implies it.
- `HoverCardContent` is no longer polymorphic. Its props (`class`, `classes`, `style`, `ref`, `mount`, dismiss handlers, and any other attribute or event handler) go on the shared card while that card shows it, and come off when another card takes it over.
- `HoverCard` drops the Kobalte root options it never used (`id`). The trigger renders without a Kobalte popover anchor and still sets `data-expanded` and `data-closed`.
- Overlays opened by hover tell pointer from keyboard more reliably: the input tracker also records `pointerover`, which the browser fires before the `pointermove` that crosses into an element.
- A hover card opened from inside another card's content gets a surface of its own. The outer card stays open while the pointer is on the inner card and until it closes, and a press on the inner card does not close it.
- An `a` trigger (alone or `as={Link}`) has a dotted underline in the hint tone (`--cui-hovercard-trigger-decoration-color`) that takes the text colour on hover and while the card is open.
