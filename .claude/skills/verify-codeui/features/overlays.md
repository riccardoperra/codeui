# Overlays

Dialog and Popover open from a trigger, move focus inside, trap Tab while modal, close on Escape or the close button, and return focus to the trigger. Both render the same in dark and light themes. Sheet and CommandMenu arrive in later PRs; add them here when their stories land.

## Sub-features

- `dialog-open` opens a modal dialog from its trigger with Enter or Space.
- `dialog-focus` moves focus inside the dialog and traps Tab there.
- `dialog-dismiss` closes on Escape and on `dialog-close-button`, and returns focus to the trigger.
- `dialog-sizes` renders `xs`, `sm`, `md`, `lg`, `xl`, `full` panels.
- `dialog-overflow` scrolls long content inside the panel with a footer.
- `dialog-parts` composes `@codeui/kit/dialog/parts` parts (`Root`, `Trigger`, `Overlay`, `Positioner`, `Content`, `Header`, `Title`, `CloseButton`, `Description`, `Body`, `Footer`).
- `dialog-settings-layout` composes `size="settings"`, `chrome="inset"`, `Sidebar`, `Nav`, `NavItem`, `Main` and `Section`: arrow keys, Home and End move focus in the nav, Enter selects, `aria-current="page"` marks the current section.
- `dialog-export-layout` composes `size="export"`, `chrome="inset"`, a `layout="split"` body, an actions `Footer` and a two-column `Section` well; both stack at 768px and below.
- `dialog-motion` sets `data-motion="none"` on the panel and positioner after a keyboard open or close. A journey cannot prove the animation itself (the harness disables animations).
- `popover-open` opens popover content from its trigger and focuses it.
- `popover-dismiss` closes on Escape and returns focus to the trigger.
- `popover-pop` opens with `data-motion="none"` from the keyboard and pops from the trigger side with a pointer; surface `--cui-surface-dialog`, radius 18, 14px / 1.3 text. Journey: `journeys/popover-pop.mjs` on `designsystem-popover--popover-story`.
- `menu-pop` the same for DropdownMenu, with 36px rows at 14px. Journey: `journeys/menu-pop.mjs` on `designsystem-dropdownmenu--dropdown-menu-story`.
- `hovercard-open` opens `[data-cui=hovercard-content]` on trigger focus (no motion, focus stays on the trigger) and on a resting pointer; Escape and moving away close it; surface `--cui-surface-dialog`, radius 16, max width 320. Journey: `journeys/hovercard-open.mjs` on `designsystem-hovercard--hover-card-story`.
- `hovercard-touch` opens the card on a touch tap without following the link, places it on the right of the trigger by default, keeps the floating surface (dialog fill, shadow with the dark inset ring, radius 16, max width 320), closes on an outside press, and opens at once on a mouse click. Journey: `journeys/hovercard-touch.mjs` on `designsystem-hovercard--hover-card-story`.
- `hovercard-edge` flips the card to the left when there is no room on the right. Journey: `journeys/hovercard-edge.mjs` on `designsystem-hovercard--edge-placement`.
- `hovercard-list` renders `HoverCardList`: one 28px line per entry, 16px indent per depth, truncated titles, named state icons, capped at 24rem with its own scroll. Journey: `journeys/hovercard-list.mjs` on `designsystem-hovercard--task-list`.
- `popover-parts` composes `@codeui/kit/popover/parts` parts with title, description, arrow and close button.

## How to get to it (user POV)

- Dialog: Tab to a trigger button (`Open (xs)` … `Open (full)` in `designsystem-dialog--sizes`; `Open Dialog`, `Open Dialog (full)` in `designsystem-dialog--overflow-content`) and press Enter.
- Dialog parts: `designsystem-dialog--parts` is open on load with title `Export video`.
- Dialog layouts: `designsystem-dialog--settings-layout` (trigger `Open settings`) and `designsystem-dialog--export-layout` (trigger `Export…`) are open on load.
- Popover: Tab to `Click me` in `designsystem-popover--popover-story` (also `--popover-bordered`, `--custom-position`, `--open-with-block-content`) and press Enter.
- Popover parts: `designsystem-popover--parts` is open on load from trigger `What's new`.

## Driving it with drive.mjs

Preconditions:

- Doctor exits 0.

- **Dialog layout journeys (proven).** `node .claude/skills/verify-codeui/scripts/drive.mjs designsystem-dialog--settings-layout --journey .claude/skills/verify-codeui/journeys/dialog-layouts.mjs` checks the 1000×680 panel, the six-item list, arrow keys and wrapping, Enter selecting Export with the breadcrumb following, Escape returning focus to `Open settings`, `data-motion=none` after an Enter reopen, and at 390×844 the 8px gutter, header on top and three nav columns. `designsystem-dialog--export-layout` with `journeys/dialog-export.mjs` checks the 800px inset panel (24px corners, 20px padding, no divider), the 36px ghost close button, two split columns and a two-column More well on desktop, and one column each with a 16px gutter at 390×844. Both have no axe violations in either theme.
- **Dialog keyboard journey (proven).** Run `node .claude/skills/verify-codeui/scripts/drive.mjs designsystem-dialog--sizes --journey .claude/skills/verify-codeui/journeys/dialog-keyboard.mjs`. In both themes: Tab reaches `Open (sm)`; Enter shows `getByRole('dialog')` with heading `Dialog title sm`; focus lands on `[data-cui=dialog-close-button]` (`inDialog: true`); the dialog's computed `colorScheme` equals the theme and the body background equals `backgrounds[theme]`; Tab keeps focus inside; Escape removes the dialog and focus is back on `Open (sm)`. `axe-dialog-open.json` has no violations.
`Close button`, `Overflow` and `Parts` are not driven yet; the first run that drives them confirms or corrects them here.

- **Close button.** Same story; after Enter, press Enter again while focus is on `dialog-close-button`. Expect the dialog gone and focus on the trigger.
- **Overflow.** Drive `designsystem-dialog--overflow-content`, Tab to `Open Dialog`, Enter. Expect `[data-cui=dialog-panel-content]` scrollable (`scrollHeight > clientHeight`) and `[data-cui=dialog-panel-footer]` buttons `Close`, `Confirm` visible.
- **Popover (probe-verified).** Drive `designsystem-popover--popover-story`. Tab focuses `[data-cui=popover-trigger]` `Click me`; Enter shows `[data-cui=popover-content]` (role `dialog`) with focus on it; Escape removes it and focus returns to `Click me` (observed in a probe; no shipped journey yet).
- **Parts.** Drive `designsystem-dialog--parts` and `designsystem-popover--parts` without a journey. Expect the open overlay in both themes' screenshots and `[data-cui=dialog-title]` / `[data-cui=popover-title]` present.

## Gotchas

- Overlay content is portaled to `body`; `#storybook-root` only holds the trigger.
- The `Sizes` dialog contains a single focusable element (the close button), so the Tab-trap check passes by staying on it. Use `overflow-content` to prove trapping across several focusables.
- Both `overflow-content` dialogs share one signal; either trigger opens both.
- `--parts` stories are open on load and tagged `!autodocs`; they do not appear on the Docs page.
