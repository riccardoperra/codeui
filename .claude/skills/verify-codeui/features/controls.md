# Sidebar and settings controls

The controls CodeImage's sidebar and Settings dialog are built from: the accordion of sections, the switch, and option cards. A user opens a section with one click, toggles a switch with the mouse or Space, and picks a card with arrow keys. The keyboard path is instant and shows the focus ring; the pointer path animates and shows no ring.

## Sub-features

- `accordion-first-click` opens a closed section on the first click while another is open; the header is 36px with a 14px/600 title and the chevron turns 90°.
- `accordion-keyboard` toggles the focused header with Enter and writes `data-cui-input="keyboard"` on `<html>`.
- `switch-pointer` toggles on click with no focus ring.
- `switch-keyboard` toggles with Space and shows the 2px ring; Tab focus shows it too.
- `option-card-keyboard` enters the group with Tab, selects with arrows, draws one ring outside the focused card and the inset accent ring on the selected one.
- `resizable-keyboard` focuses the `separator` handle with Tab, moves it with the arrow keys and stops at the panel's `minSize`/`maxSize` (Home 200px, End 360px). Journey: `journeys/resizable-keyboard.mjs` on `designsystem-resizable--sidebar`; `--vertical` and `--collapsible` render-only.

## How to get to it (user POV)

- Accordion: `designsystem-accordion--settings` (headers `Size 64`, `Window macOS`, `Language Typescript`, disabled `Unavailable`; `Size` starts open).
- Switch: `designsystem-switch--states` (first switch `Notifications`).
- OptionCard: `designsystem-optioncard--cards` (`Dark` selected with a `Default` badge, `Light`, `System`, disabled `Unavailable`).

## Driving it with drive.mjs

- `node $K/scripts/drive.mjs designsystem-accordion--settings --journey $K/journeys/accordion-first-click.mjs`
- `node $K/scripts/drive.mjs designsystem-switch--states --journey $K/journeys/switch-focus.mjs`
- `node $K/scripts/drive.mjs designsystem-optioncard--cards --journey $K/journeys/option-card-keyboard.mjs`

## Gotchas

- The harness forces reduced motion and turns transitions off, so these journeys prove state, focus and rings, not motion. Sample motion with a separate Playwright page that keeps transitions (rAF sampling of the body height and the thumb transform).
- The accordion's dropped click only showed when the open body restarted its animation and moved the next header from under the pointer; with motion off it cannot reproduce. The jsdom test asserts the cause instead: a press changes no attribute of the open section.
- `data-cui-input` lives on `document.documentElement` and persists across steps of one theme; it is `pointer` after any click, `keyboard` after any non-modifier key.
