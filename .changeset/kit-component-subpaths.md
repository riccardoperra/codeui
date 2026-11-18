---
"@codeui/kit": minor
---

Add direct imports for every ready component family, including `@codeui/kit/combobox`, `@codeui/kit/select`, and `@codeui/kit/button`.

Existing styled-parts imports must append `/parts`. For example, change `@codeui/kit/combobox` to `@codeui/kit/combobox/parts` when importing `Root`, `Input`, or other parts. The Select parts are available from `@codeui/kit/select/parts`.

Compose custom primitives from the new parts entry points for Tabs, DropdownMenu, TextField, TextArea, NumberField, Checkbox, RadioList, Listbox, Tooltip, Pagination, and SegmentedControl.
