---
"@codeui/kit": patch
---

Select submits its value through `name` and no longer requires `aria-label` with a `label`, and `SelectProps` is exported. Token overrides on `:root` reach nested `[data-cui-theme]` scopes for tokens shared by both modes. NumberField is a `spinbutton`, respects `disabled` and `readOnly` in its step buttons and arrow keys, steps up to its bounds, and shows `0`. Clearing a controlled Combobox calls `onChange(null)`. A loading Button sets `aria-busy` and `aria-disabled` and ignores activation while keeping focus.
