# Feedback

Tooltip shows a short label next to its trigger on hover and should also show on keyboard focus. Toast and Alert arrive in later PRs; add them here when their stories land.

## Sub-features

- `tooltip-hover` shows `role=tooltip` content while the pointer is over the trigger.
- `tooltip-focus` shows the tooltip when the trigger receives keyboard focus.
- `tooltip-dismiss` hides it on Escape and when focus or the pointer leaves.
- `tooltip-variants` renders primary, secondary, disabled and custom JSX content.

## How to get to it (user POV)

- Hover or Tab to `Hover me` in `designsystem-tooltip--tooltip-story`; also `--tooltip-secondary`, `--tooltip-disabled`, `--custom-jsx-component`.

## Driving it with drive.mjs

Preconditions:

- Doctor exits 0.

- **Hover.** `page.getByRole('button', { name: 'Hover me' }).hover()`, wait ~1 s for the open delay, then `getByRole('tooltip')` count is 1. Observed in a probe on this base.
- **Focus and Escape.** Run `node .claude/skills/verify-codeui/scripts/drive.mjs designsystem-tooltip--tooltip-story --journey .claude/skills/verify-codeui/journeys/tooltip-keyboard.mjs`. Tab opens the tooltip. Escape closes it and focus stays on `Hover me`.
- **Dismiss.** After hover, press Escape; expect count 0.
- **Theme.** Screenshot the open tooltip in both themes (`step('hovered')`).

## Gotchas

- The tooltip has an open delay; assert after a wait or with `getByRole('tooltip').waitFor()`, not immediately.
- Tooltip content is portaled to `body`.
- `--tooltip-disabled` must not open on hover; assert count 0 there.
