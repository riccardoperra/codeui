# Overlays

Dialog and Popover open from a trigger, move focus inside, trap Tab while modal, close on Escape or the close button, and return focus to the trigger. Both render the same in dark and light themes. Sheet and CommandMenu arrive in later PRs; add them here when their stories land.

## Sub-features

- `dialog-open` opens a modal dialog from its trigger with Enter or Space.
- `dialog-focus` moves focus inside the dialog and traps Tab there.
- `dialog-dismiss` closes on Escape and on `dialog-close-button`, and returns focus to the trigger.
- `dialog-sizes` renders `xs`, `sm`, `md`, `lg`, `xl`, `full` panels.
- `dialog-overflow` scrolls long content inside the panel with a footer.
- `dialog-parts` composes `@codeui/kit/dialog` parts (`Root`, `Trigger`, `Overlay`, `Positioner`, `Content`, `Header`, `Title`, `CloseButton`, `Description`, `Body`, `Footer`).
- `popover-open` opens popover content from its trigger and focuses it.
- `popover-dismiss` closes on Escape and returns focus to the trigger.
- `popover-parts` composes `@codeui/kit/popover` parts with title, description, arrow and close button.

## How to get to it (user POV)

- Dialog: Tab to a trigger button (`Open (xs)` … `Open (full)` in `designsystem-dialog--sizes`; `Open Dialog`, `Open Dialog (full)` in `designsystem-dialog--overflow-content`) and press Enter.
- Dialog parts: `designsystem-dialog--parts` is open on load with title `Export video`.
- Popover: Tab to `Click me` in `designsystem-popover--popover-story` (also `--popover-bordered`, `--custom-position`, `--open-with-block-content`) and press Enter.
- Popover parts: `designsystem-popover--parts` is open on load from trigger `What's new`.

## Driving it with drive.mjs

Preconditions:

- Doctor exits 0.

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
