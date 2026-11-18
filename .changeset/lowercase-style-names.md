---
"@codeui/kit": minor
---

Rename the appearance `theme` prop to `variant`. This is a breaking change.

- `theme` is now `variant` on Button, IconButton, Checkbox, RadioList, TextField, TextArea, NumberField, Select, Listbox, Tabs and Tooltip, and the `data-theme` attribute is now `data-variant`. Tabs sets `data-variant` instead of `data-tabs-theme`. "Theme" now means only light and dark: `data-cui-theme` and the Toaster `theme` are unchanged.
- Button and IconButton `variant="ghost"` is now the boolean `ghost` prop, which sets `data-ghost`.
- SegmentedControl `theme="primary"` is now the boolean `accent` prop, which sets `data-accent`. `data-autoWidth` is now `data-auto-width`.
- Compound component names in `data-cui` markers are one lowercase word: `text-field` is `textfield`, `number-field` is `numberfield`, `icon-button` is `iconbutton`, `radio-group-field` is `radiolist`, `dropdown-menu-item` is `dropdownmenu-item`, and `segmentedControlItem` is `segmentedcontrol-item`.
- Styled classes follow `cui-<component>` and `cui-<component>-<part>`, such as `cui-button` and `cui-textfield-input`, and local variables follow `--cui-<component>-<name>`, such as `--cui-button-background`.
