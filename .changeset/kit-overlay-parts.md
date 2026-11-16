---
"@codeui/kit": minor
---

Add the `@codeui/kit/dialog` and `@codeui/kit/popover` subpaths with styled parts, part tables and part style functions. The ready `Dialog` and `Popover` are built from them and only gain options:

- `Dialog`: `title` and the new `description` take JSX. New `closeLabel`, `mount`, `classes`, `aria-label` and content focus callbacks. Without a trigger, focus returns to the element that opened the dialog.
- `PopoverContent`: `title` and the new `description` take JSX. New `mount` and `classes`. Children render in the content without a `<p>` wrapper, so block and grid children lay out as written.
- `Popover` honors `gutter`. The default stays 6.
- `Select`: new `classes` prop. `classes.content` styles the portaled list. `slotClasses` is deprecated.
