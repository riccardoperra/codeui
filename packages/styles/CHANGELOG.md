# @codeui/styles

## 0.2.0

### Minor Changes

- 84f2526: Align controls at 28px, 36px, 44px and 52px at comfortable density. Controls default to `sm` (36px). Coarse pointers use touch density. Set `data-cui-density` to `compact`, `comfortable`, or `touch` to select a density for a subtree.

  Migrate control `xl` to `lg` (52px). Medium controls grow from 40px to 44px, and medium fields grow from 36px to 44px on desktop. Extra-small controls shrink from 30px to 28px. Buttons without a size shrink from 40px to 36px.

- 120be70: Add `Table` and `TableScrollArea`, a native table styled with Inkstone, with `size` (`sm` or `md`) and `striped` variants. The same styles ship framework-neutral as `@codeui/styles/table` (`tableStyles.root()`, `tableStyles.scrollArea()`) and `@codeui/styles/table.css`.
- 81cb8e9: Use the shared `sm` height for menu, listbox, select, combobox, command menu and navigation rows. Select and Listbox rows drop from 40px to 36px at comfortable density. These rows measure 32px at compact density and 40px at touch density.

  Use 16px text for medium fields to match medium buttons. Fields use at least 16px text at touch density and on touch devices at any density, to avoid focus zoom on iOS.

- 4e11450: Publish the shared Inkstone tokens, light and dark values, and standalone theme CSS in `@codeui/inkstone`. Build component styles from plain CSS and Toghen-resolved aliases in `@codeui/styles`. Solid components automatically import their component CSS and theme without a vanilla-extract plugin. CSS-only applications can load all.css or the theme and individual component files. Kit style helpers return base classes. Custom markup should set variant attributes such as `data-size` and `data-variant` on the element. The styles package also supports HTML consumers without Solid.

  Render open and force-mounted Dialog, Popover, Sheet and CommandMenu content on the server. Hydration adopts the existing nodes before moving them through Solid Portal, preserving event bubbling, custom autofocus, target changes and cleanup.

  Use the Gosfuig grey, blue, red, orange, and green ramps in the default Inkstone theme. The primary action uses `#0076cf` in both modes and reaches 4.7:1 contrast with white text.

- b4ff0ce: Generate framework-neutral appearance props for Inkstone components and parts from the published styles contract. Add DOM application support and check CSS selectors against the contract at build time. Refresh the Kit API snapshot for the expanded styles declarations.

  Unsized fields, Checkbox, and Listbox now use their default size's typography instead of inheriting the page font.

### Patch Changes

- 1d40f9d: Keep the Command Menu centered and inside the viewport when composed with Dialog. Restore the 14px radius of the inset Settings dialog.
- 6408a9f: Center the Checkbox label on the box. The label kept a fixed height equal to the box and placed its shorter text at the top, 1.5px to 6px too high from `sm` to `xl`. It now uses a minimum height and centers its text, so a wrapping label still grows.
- a5c8d4d: Set menu rows and checkbox labels to the 14px Label style from DESIGN.md. `sm` Listbox options go from 16px to 14px. Select options set 14px instead of inheriting the page size. `sm` and `md` Checkbox labels go from 12px to 14px with the snug line height.
- 5fe6072: Size kit elements with `box-sizing: border-box` from `theme.css`. Without a page reset, a TextField was 2px taller and a SegmentedControl 8px taller than a Button of the same size. The rule is in `@layer cui.base` at zero specificity.
- Updated dependencies [84f2526]
- Updated dependencies [4e11450]
  - @codeui/inkstone@0.2.0
