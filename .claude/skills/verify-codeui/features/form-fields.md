# Form fields

Form fields take keyboard input, show a label, description and error message, and expose variants, sizes, disabled, read-only and required states. Each field also has a `FieldApi` story for the shared field props.

## Sub-features

- `textfield-input` types into a labeled textbox.
- `textfield-states` renders filled, outline, inline variants and disabled, read-only, required states.
- `textfield-validation` marks the textbox invalid and shows `text-field-error-message`.
- `select-pick` opens the options and picks one with arrows and Enter.
- `listbox-select` selects options with arrows and Enter, single and multiple.
- `numberfield-step` increments and decrements with arrow keys within min and max.
- `numberfield-locked` keeps a disabled or read-only value from the step buttons and the arrow keys.
- `combobox-clear` clears a controlled value with a second Escape or by deleting the text.
- `select-form` submits the selected value through `name`.
- `segmented-select` moves between segments with arrows and selects one.
- `radiolist-select` checks a radio with arrow keys.
- `checkbox-toggle` toggles with Space.

## How to get to it (user POV)

- TextField: `designsystem-textfield--text-field-story` (label `Input label`), plus `--text-field-filled-variant`, `--text-field-outline-variant`, `--text-field-inline-variant`, `--text-field-disabled`, `--text-field-readonly`, `--text-field-required`, `--sizes`, `--validation`, `--text-field-custom-classes`, `--field-api`.
- Select: `designsystem-select--select-story` (label `Input label`, placeholder `Insert a value...`), plus `--select-disabled`, `--select-readonly`, `--select-required`, `--sizes`, `--validation`, `--select-custom-object`.
- Listbox: `designsystem-listbox--listbox-story` (options `Item1`…`Item3`), `--listbox-multiple`, `--listbox-virtualized`, `--field-api`.
- NumberField: `designsystem-numberfield--min-max` (value `60`), `--step`, `--precision`, `--prefix`, `--postfix`, `--validation`, `--number-field-disabled`, `--number-field-readonly`. The input is a `spinbutton`.
- Combobox: `designsystem-combobox--controlled` (label `Language`, value `Rust`, an `output` reads `Selected: rs`). Journey: `journeys/combobox-controlled-clear.mjs`.
- Select in a form: `designsystem-select--select-form` (label `Export format`, a Submit button writes `Submitted format=…` in an `output`). Journey: `journeys/select-form-submit.mjs`.
- SegmentedControl: `designsystem-segmentedcontrol--segmented-control-story` (tabs `Left`, `Center`, `Right`), `--disabled-segmented-item`, `--fluid-width`.
- RadioList: `designsystem-radiolist--default` (radios `Apple`, `Fruit`, `Garden`), `--validation`.
- Checkbox: `designsystem-checkbox--checkbox-story` (checkbox `My label`), `--sizes`, `--validation`.

## Driving it with drive.mjs

Preconditions:

- Doctor exits 0. Write a journey file per field (scratchpad for one-offs, `journeys/` to keep) and run `node .claude/skills/verify-codeui/scripts/drive.mjs <story-id> --journey <file>`.

The results below were observed in a probe on this base. No journey file ships for them yet.

- **TextField.** Tab, then `page.keyboard.type('hello')`. `getByRole('textbox', { name: 'Input label' })` has value `hello`; focus is on `[data-cui=text-field-input]`.
- **TextField validation.** Drive `--validation` without a journey. Each `textbox` is `[aria-invalid=true]` and a `[data-cui=text-field-error-message]` reads `Value is required.`
- **Select.** Tab focuses `[data-cui=select-trigger]`; Enter opens `getByRole('listbox')` with options `Apple`, `Banana`, `Blueberry`, `Grapes`, `Pineapple` and focus on `Apple`; ArrowDown, Enter closes the listbox, `[data-cui=select-value]` reads `Banana`, focus returns to the trigger.
- **Listbox.** Tab focuses option `Item1`; ArrowDown, Enter makes `Item2` the only `[aria-selected=true]` option.
- **NumberField.** Tab into `--min-max`; ArrowUp changes the spinbutton from `60` to `61`. The next Tab leaves the field: the step buttons have `tabindex=-1`.
- **SegmentedControl.** Tab focuses tab `Left`; ArrowRight moves focus to `Center` while `getByRole('tab', { selected: true })` stays `Left`; press Enter or Space to select it.
- **RadioList.** Tab focuses the checked radio `Apple`; ArrowDown checks `Fruit`.
- **Checkbox.** Tab, Space. `getByRole('checkbox', { name: 'My label' })` is checked.

## Gotchas

- Select's trigger accessible name concatenates label, value and placeholder (`Input label Fruit Insert a value...`); match by `[data-cui=select-trigger]` or a name regex.
- SegmentedControl uses manual activation: arrows move focus only. Asserting selection after ArrowRight alone fails.
- NumberField `End` and `Home` move the caret, not the value.
- NumberField step buttons are `display: none` until hover or focus inside the field. Hover the input before querying them by role.
- Radio inputs have no `aria-label`; `focus().name` is empty. Assert with `getByRole('radio', { name })` and `checked`.
- The Select options list portals outside `#storybook-root`.
