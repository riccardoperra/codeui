# Settings rows

SettingsGroup puts a heading above one island of SettingsRow rows. Each row shows a label and a description on the left and a control on the right, and the row's text names and describes the control. Below 900px an inline row puts its control under the text unless it sets `compactControl`. The look matches CodeImage's Settings dialog.

## Sub-features

- `settings-parity` renders the island, title, row and text with the values measured on CodeImage's Settings dialog.
- `settings-labelling` names each control from its row label and describes it from the row description.
- `settings-keyboard` reaches each control with Tab in reading order; the row adds no tab stop.
- `settings-stacking` stacks segmented and field rows at 390px and keeps compact switches inline.
- `settings-wide` puts option cards under the text at full width.

## How to get to it (user POV)

- `designsystem-settings--dialog`: groups `Interface` (row `Language`, four segments) and `Sidebar` (rows `Panel side`, `Visible` switch, `Padding` number field).
- `designsystem-settings--wide` (`Colour mode` option cards), `--markers-picture-details` (`Takumi`, `On-device model`), `--long-labels`, `--disabled`.

## Driving it with drive.mjs

```sh
node .claude/skills/verify-codeui/scripts/drive.mjs designsystem-settings--dialog --journey .claude/skills/verify-codeui/journeys/settings-row.mjs
```

The journey asserts computed values against CodeImage, the accessible names of the tab list, switch and spinbutton, Tab order to the `Visible` switch, Space toggling it, and the 390px layout.

## Gotchas

- The harness `focus()` name reads `aria-label` and text only. Rows name controls with `aria-labelledby`, so assert names with `getByRole(..., { name })` instead.
- Stacking follows the viewport (Inkstone §9.2), so resize the page; a narrow container alone does not stack rows.
- Islands use `--cui-surface-canvas`, the same colour as the Storybook body. The stories wrap groups in a `--cui-surface-panel` pane, as CodeImage's dialog does.
