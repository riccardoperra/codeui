---
"@codeui/kit": minor
"@codeui/styles": minor
"@codeui/inkstone": minor
---

Publish the shared Inkstone tokens, light and dark values, and standalone theme CSS in `@codeui/inkstone`. Build component styles from plain CSS and Toghen-resolved aliases in `@codeui/styles`. Solid components automatically import their component CSS and theme without a vanilla-extract plugin. CSS-only applications can load all.css or the theme and individual component files. Kit style helpers return base classes. Custom markup should set variant attributes such as `data-size` and `data-theme` on the element. The styles package also supports HTML consumers without Solid.

Render open and force-mounted Dialog, Popover, Sheet and CommandMenu content on the server. Hydration adopts the existing nodes before moving them through Solid Portal, preserving event bubbling, custom autofocus, target changes and cleanup.
