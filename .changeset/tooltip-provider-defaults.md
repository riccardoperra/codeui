---
"@codeui/kit": minor
---

Add `TooltipProvider` (`Provider` in `@codeui/kit/tooltip/parts`) to set `openDelay`, `closeDelay`, `skipDelayDuration`, `gutter`, `shift` and `variant` for every tooltip below it. A prop on one tooltip still wins.

Tooltips are calmer by default: they open 700ms after hover (was 200ms), the next one opens at once for 400ms after one closes (was 300ms), and they use the neutral `secondary` fill (was the brand `primary`). Pass `openDelay`, `skipDelayDuration` or `variant` to keep the old behaviour.
