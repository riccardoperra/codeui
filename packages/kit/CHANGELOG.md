# @codeui/kit

## 0.2.0

### Minor Changes

- 1a4397f: Add a component-free `@codeui/kit/tokens` entry for vanilla-extract style files evaluated in Node.
- ed4a051: Add styled Combobox parts at `@codeui/kit/combobox/parts`, `comboboxStyles` and the `createComboboxOptions` helper.
- 98f8d0a: Add the ready `Combobox` with field content, controlled input text, rich option rendering and an empty state.
- 6e75163: Add styled CommandMenu parts at `@codeui/kit/command-menu/parts` and `commandMenuStyles`, with a search field and an inline list that share the combobox highlight.
- 8f0baf7: Add the `CommandMenu` component, a searchable command list in a dialog that previews on highlight and commits on Enter or click.
- 84f2526: Align controls at 28px, 36px, 44px and 52px at comfortable density. Controls default to `sm` (36px). Coarse pointers use touch density. Set `data-cui-density` to `compact`, `comfortable`, or `touch` to select a density for a subtree.

  Migrate control `xl` to `lg` (52px). Medium controls grow from 40px to 44px, and medium fields grow from 36px to 44px on desktop. Extra-small controls shrink from 30px to 28px. Buttons without a size shrink from 40px to 36px.

- c8c69fd: Add `Alert` with its parts at `@codeui/kit/alert/parts`, and the styled toast parts at `@codeui/kit/toast/parts`.
- 618fd9f: Add direct imports for every ready component family, including `@codeui/kit/combobox`, `@codeui/kit/select`, and `@codeui/kit/button`.

  Existing styled-parts imports must append `/parts`. For example, change `@codeui/kit/combobox` to `@codeui/kit/combobox/parts` when importing `Root`, `Input`, or other parts. The Select parts are available from `@codeui/kit/select/parts`.

  Compose custom primitives from the new parts entry points for Tabs, DropdownMenu, TextField, TextArea, NumberField, Checkbox, RadioList, Listbox, Tooltip, Pagination, and SegmentedControl.

- 4738344: Accordion, Switch, OptionCard, SegmentedControl, Slider, Tabs and form fields now match CodeImage's controls: the accordion opens on the first click and transitions its height, keyboard input never animates and pointer clicks show no focus ring, option cards get the inset selection ring and 68px preview well, every control sets its own line height, and part style functions honour their variants.
- bbd3e97: Add dialog layouts for CodeImage's settings and export dialogs: `settings` and `export` sizes, `chrome="inset"`, a split body, the `Sidebar`, `Nav`, `NavItem`, `Main` and `Section` parts, a phone gutter, and Pop motion with a fading scrim that stays still when opened from the keyboard.
- 05ff13a: Add `Kbd`, `Badge`, `Spinner` and `Skeleton`, with styled parts at `@codeui/kit/kbd/parts`, `@codeui/kit/badge/parts`, `@codeui/kit/spinner/parts` and `@codeui/kit/skeleton/parts`.
- be8f154: Add the `@codeui/kit/dialog/parts` and `@codeui/kit/popover/parts` subpaths with styled parts, part tables and part style functions. The ready `Dialog` and `Popover` are built from them and only gain options:

  - `Dialog`: `title` and the new `description` take JSX. New `closeLabel`, `mount`, `classes`, `aria-label` and content focus callbacks. Without a trigger, focus returns to the element that opened the dialog.
  - `PopoverContent`: `title` and the new `description` take JSX. New `mount` and `classes`. Children render in the content without a `<p>` wrapper, so block and grid children lay out as written.
  - `Popover` honors `gutter`. The default stays 6.
  - `Select`: new `classes` prop. `classes.content` styles the portaled list. `slotClasses` is deprecated.

- 51ddc8a: Add drag to dismiss to `Sheet` with the new `draggable` prop and to the `Handle` part of `@codeui/kit/sheet/parts`, for bottom sheets.
- 7b47698: Add the `Sheet` component and the `@codeui/kit/sheet/parts` parts, a dialog attached to the bottom, left or right edge that slides only on pointer opens and closes.
- 65a4260: Add `Toaster` and `createToaster`, a scoped toast controller with tones, actions, promise states and per-app isolation.
- 4b5be61: Adopt one token contract as CSS custom properties, with the CodeImage look as the default theme.

  - New `tokens` export: every value is `var(--cui-…)` with a stable name, for example `--cui-surface-canvas` and `--cui-action-brand-base`. Override them with plain CSS.
  - All kit CSS is in the `cui` cascade layer, so unlayered app CSS always wins. An app CSS reset must be layered below `cui`.
  - Without `data-cui-theme`, the kit follows `prefers-color-scheme`.
  - `themeVars` and `themeTokens` keep working and point at the new variables. Font sizes follow the new scale: `xs` is 12px, `lg` 18px and `xl` 20px.
  - Every component changes appearance. Brand, danger and status colors now meet WCAG AA text contrast. Motion is shorter, with one ease-out curve. The button press takes 120ms.

- c821aea: Upgrade `@kobalte/core` to 0.13.14 and `@kobalte/utils` to 0.9.2, which raises the `solid-js` peer dependency to `^1.9.8`.
- 014542c: Light theme greys come from one 12-step ramp (hue 255), light focus and links reach their contrast targets, and new tokens `surface.fieldHover`, `surface.track`, `text.tertiary` and `text.disabled` are added.
- f368cb0: Rename the appearance `theme` prop to `variant`. This is a breaking change.

  - `theme` is now `variant` on Button, IconButton, Checkbox, RadioList, TextField, TextArea, NumberField, Select, Listbox, Tabs and Tooltip, and the `data-theme` attribute is now `data-variant`. Tabs sets `data-variant` instead of `data-tabs-theme`. "Theme" now means only light and dark: `data-cui-theme` and the Toaster `theme` are unchanged.
  - Button and IconButton `variant="ghost"` is now the boolean `ghost` prop, which sets `data-ghost`.
  - SegmentedControl `theme="primary"` is now the boolean `accent` prop, which sets `data-accent`. `data-autoWidth` is now `data-auto-width`.
  - Compound component names in `data-cui` markers are one lowercase word: `text-field` is `textfield`, `number-field` is `numberfield`, `icon-button` is `iconbutton`, `radio-group-field` is `radiolist`, `dropdown-menu-item` is `dropdownmenu-item`, and `segmentedControlItem` is `segmentedcontrol-item`.
  - Styled classes follow `cui-<component>` and `cui-<component>-<part>`, such as `cui-button` and `cui-textfield-input`, and local variables follow `--cui-<component>-<name>`, such as `--cui-button-background`.

- 120be70: Add `Table` and `TableScrollArea`, a native table styled with Inkstone, with `size` (`sm` or `md`) and `striped` variants. The same styles ship framework-neutral as `@codeui/styles/table` (`tableStyles.root()`, `tableStyles.scrollArea()`) and `@codeui/styles/table.css`.
- a96f06e: Use one brand blue, `#0083e5` in both themes, for filled buttons and every selected or checked control, including the Switch track and the Tabs indicator.
- f69c722: Add accessible OptionCardGroup and OptionCard radio cards with previews, badges, and styled parts.
- 5e48384: Popover, DropdownMenu, Select, Combobox and Tooltip now pop from their trigger and open in place from the keyboard, popovers and menus use CodeImage's floating surface and type, toasts rise in CodeImage's inverted theme 80px above the bottom, Tooltip describes its focusable child, and `TooltipProps`, `--cui-font-line-height-snug` and `--cui-motion-duration-rise` are exported.
- 9ba1566: Add accessible Accordion parts and a ready settings accordion with value summaries and input-aware motion.
- f9a817f: Forward input attributes, link SSR field labels, and accept rich descriptions and part classes. Forward RadioListItem props and preserve RadioList classes. Add Listbox and VirtualizedListbox class hooks. Keep SegmentedControl height intrinsic and release Escape to enclosing layers.
- d8ff784: Add styled Slider and Progress parts and ready components with accessible field content and token-based styles.
- 333f126: Add SettingsRow and SettingsGroup, with styled parts at `@codeui/kit/settings/parts`, that name and describe each row's control from its label and description.
- 4e11450: Publish the shared Inkstone tokens, light and dark values, and standalone theme CSS in `@codeui/inkstone`. Build component styles from plain CSS and Toghen-resolved aliases in `@codeui/styles`. Solid components automatically import their component CSS and theme without a vanilla-extract plugin. CSS-only applications can load all.css or the theme and individual component files. Kit style helpers return base classes. Custom markup should set variant attributes such as `data-size` and `data-variant` on the element. The styles package also supports HTML consumers without Solid.

  Render open and force-mounted Dialog, Popover, Sheet and CommandMenu content on the server. Hydration adopts the existing nodes before moving them through Solid Portal, preserving event bubbling, custom autofocus, target changes and cleanup.

  Use the Gosfuig grey, blue, red, orange, and green ramps in the default Inkstone theme. The primary action uses `#0076cf` in both modes and reaches 4.7:1 contrast with white text.

- 563a3fd: Theme the shape and the brand with two tokens. `--cui-radius-scale` multiplies every radius except `none` and `full`. The brand hover, active, soft, focus and selection colors are now computed from `--cui-action-brand-base` with CSS relative colors, and resolve to the same Inkstone values. Danger, caution and success compute their hover and active from their base the same way. Browsers without relative colors keep the fixed values. The radii and the computed brand colors are now set again on each `[data-cui-theme]` scope, so an override of one of them written only on `:root` stops at the first nested scope. Write `:root, [data-cui-theme]` to reach every scope.
- e253747: Add polymorphic Stack layout and Text typography primitives with token-based styles and public parts.
- aec88c0: Add a Kobalte Switch with styled parts and accessible field content.

### Patch Changes

- 46cb27d: The published manifest no longer carries a local link and build-only dependencies, and types resolve under all module resolutions.
- 333f126: Forward `aria-describedby` from Switch to its input, and `aria-label`, `aria-labelledby` and `aria-describedby` from SegmentedControl to its tab list.
- 4ee63db: Fix NumberField masking without a caller ref, Select option helper types and generated option keys, the PaginationProps export, and custom submenu gutters.
- d543f27: Select submits its value through `name` and no longer requires `aria-label` with a `label`, and `SelectProps` is exported. Token overrides on `:root` reach nested `[data-cui-theme]` scopes for tokens shared by both modes. NumberField is a `spinbutton`, respects `disabled` and `readOnly` in its step buttons and arrow keys, steps up to its bounds, and shows `0`. Clearing a controlled Combobox calls `onChange(null)`. A loading Button sets `aria-busy` and `aria-disabled` and ignores activation while keeping focus.
- 5f40c62: Ship the Inkstone design specification as `DESIGN.md` in the package
- 2f5a49b: Build each JSX content prop once, so server-rendered Alert, Badge, Button, Progress, Switch, Slider, OptionCardGroup and the form fields hydrate without a mismatch, and Select no longer writes an `errorMessage` attribute.
- aa9fdfe: The brand action and selection colors use the CodeImage primary (#09f, hover #08f, active #07f).
- 487e7cb: Open Tooltip when keyboard focus reaches its child trigger, and close it on Escape without moving focus.
- b4ff0ce: Generate framework-neutral appearance props for Inkstone components and parts from the published styles contract. Add DOM application support and check CSS selectors against the contract at build time. Refresh the Kit API snapshot for the expanded styles declarations.

  Unsized fields, Checkbox, and Listbox now use their default size's typography instead of inheriting the page font.

- 1592448: Preserve accordion content through closing transitions, keep Escape inside an open combobox list, and let sheet handle taps tolerate movement within the tap threshold. These fixes are covered by the existing tests running in Chromium.
- Updated dependencies [1d40f9d]
- Updated dependencies [6408a9f]
- Updated dependencies [84f2526]
- Updated dependencies [120be70]
- Updated dependencies [a5c8d4d]
- Updated dependencies [81cb8e9]
- Updated dependencies [4e11450]
- Updated dependencies [b4ff0ce]
- Updated dependencies [5fe6072]
  - @codeui/styles@0.2.0

## 0.1.5

### Patch Changes

- a42d903: support multiple select text value

## 0.1.4

### Patch Changes

- 94cb270: export dropdown and popover styles

## 0.1.3

### Patch Changes

- 3080a88: fix types, build for ssr

## 0.1.2

### Patch Changes

- 0082a8a: Fix build

## 0.1.1

### Patch Changes

- 5fa21bb: Fix build

## 0.1.0

### Minor Changes

- a7f3fd7: Update kobalte version, refactor polymorphic types

## 0.0.38

### Patch Changes

- 41b084edacd2a22fe88b5f1a007e688f40ab2aa5: Update dependencies

## 0.0.37

### Patch Changes

- a01e545: feat: number input

## 0.0.36

### Patch Changes

- 2f3d856: listbox handle focus-visible and classes from outside

## 0.0.35

### Patch Changes

- fea16ba: Add Listbox and ListboxItem components

## 0.0.34

### Patch Changes

- 7223c92: fix: segmented control light theme active bg

## 0.0.33

### Patch Changes

- 96bae68: improve segmented control size

## 0.0.32

### Patch Changes

- 61d8687: improve SegmentedControl

## 0.0.31

### Patch Changes

- 251a766: Add segmented control

## 0.0.30

### Patch Changes

- bc0aedd: dialog panel full fix padding

## 0.0.29

### Patch Changes

- 8078c54: fix dialog max height

## 0.0.28

### Patch Changes

- ce300a3: Dialog improve styles

## 0.0.27

### Patch Changes

- 656ff37: fix select, dialog, popover z-index

## 0.0.26

### Patch Changes

- 6b3361c: add text area

## 0.0.25

### Patch Changes

- 0d2a10b: feat: checkbox
- 46bb9a1: Fix/missing exports
- 8eedf29: export breakpoint and responsive style

## 0.0.24

### Patch Changes

- 6f36ce2: feat: missing exports

## 0.0.23

### Patch Changes

- 56b5d6f: fix tooltip styles
- 71a48f1: fix button disabled styles

## 0.0.22

### Patch Changes

- 54a83f5: Add `tooltip` component
- 98b8fd4: improve button loading style
- f139492: Add support for TextField slot classes
- 6b560d4: feat: add pagination component

## 0.0.21

### Patch Changes

- 57172c2: update select api
- 57172c2: upgrade kobalte to 0.9.0
- 57172c2: kobalte upgrade to 0.9.2

## 0.0.20

### Patch Changes

- 165df6f: add link component and export button styles

## 0.0.19

### Patch Changes

- 2f455bd: improve button tokens, add button loading and ghost state

## 0.0.18

### Patch Changes

- 1fc95b6: fix radio tokens, update styles, rename to RadioListItem

## 0.0.17

### Patch Changes

- f3f710c: add radio component

## 0.0.16

### Patch Changes

- d3f94f8: select improve tokens and error handling when value not present

## 0.0.15

### Patch Changes

- a533324: select improve style with indicator

## 0.0.14

### Patch Changes

- b329edd: select improve tokens and add indicator icon

## 0.0.13

### Patch Changes

- 9a5fd05: select max content dropdown for small devices

## 0.0.12

### Patch Changes

- 7c119b3: support objects value for select component

## 0.0.11

### Patch Changes

- a16ed4c: improve dropdown/select tokens and types

## 0.0.10

### Patch Changes

- 368e8a5: improve tokens

## 0.0.9

### Patch Changes

- b332397: update README

## 0.0.8

### Patch Changes

- f38c771: update dist build

## 0.0.7

### Patch Changes

- 44ca65c: fix button tokens and `block` support

## 0.0.6

### Patch Changes

- 5eee230: fix button tokens and text input ref

## 0.0.5

### Patch Changes

- 1563177: add `ref` support to TextField

## 0.0.4

### Patch Changes

- 7bcef57: fix: build dist fix

## 0.0.3

### Patch Changes

- b4874a1: Add button `block` style support
- e845bdf: update `button` and `dialog` variant token style

## 0.0.2

### Patch Changes

- 948eca4: update styles, add components
