# @codeui/inkstone

## 0.2.0

### Minor Changes

- 84f2526: Align controls at 28px, 36px, 44px and 52px at comfortable density. Controls default to `sm` (36px). Coarse pointers use touch density. Set `data-cui-density` to `compact`, `comfortable`, or `touch` to select a density for a subtree.

  Migrate control `xl` to `lg` (52px). Medium controls grow from 40px to 44px, and medium fields grow from 36px to 44px on desktop. Extra-small controls shrink from 30px to 28px. Buttons without a size shrink from 40px to 36px.

- 4e11450: Publish the shared Inkstone tokens, light and dark values, and standalone theme CSS in `@codeui/inkstone`. Build component styles from plain CSS and Toghen-resolved aliases in `@codeui/styles`. Solid components automatically import their component CSS and theme without a vanilla-extract plugin. CSS-only applications can load all.css or the theme and individual component files. Kit style helpers return base classes. Custom markup should set variant attributes such as `data-size` and `data-variant` on the element. The styles package also supports HTML consumers without Solid.

  Render open and force-mounted Dialog, Popover, Sheet and CommandMenu content on the server. Hydration adopts the existing nodes before moving them through Solid Portal, preserving event bubbling, custom autofocus, target changes and cleanup.

  Use the Gosfuig grey, blue, red, orange, and green ramps in the default Inkstone theme. The primary action uses `#0076cf` in both modes and reaches 4.7:1 contrast with white text.
