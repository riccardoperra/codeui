# Kit findings from the 2026 docs pass

The agents that wrote the documentation in November 2026 read every component's source and recorded what they found. This page lists those findings and serves as the checklist for the kit fix PR that follows the docs PR. Each finding gives the source location as `path:line` under `packages/kit/src` unless the path says otherwise. Read-only review produced every entry. An entry marked **Check in browser** has not been reproduced.

Severity follows this order.

- **High.** A user or a consumer app gets wrong behavior or broken accessibility.
- **Medium.** An API gap or a mismatch that forces a workaround.
- **Spec.** The component differs from the Inkstone design docs (`apps/docs/content/docs/design/*`, `DESIGN.md`).

## Decided

- [x] **Primary fill color.** Decided again in `feat/kit-one-brand-blue`: one brand blue for every fill, the same in both themes. `action.brand` is `#0083e5` (hover `#0076cf`, active `#0069b8`; white text 3.9:1). Filled buttons, the switch "on" track, the tab indicator, checks, slider, progress and the primary segment all use it, where before they used `#09f`, `#63b3ed` and `#07f`. The focus ring stays `accent.focus`. It replaces CodeImage's `#09f`; CodeImage picks it up when it moves to the kit. `DESIGN.md` §2.3 and the Color page say so. Earlier decision: filled buttons kept CodeImage's `#09f` (3.0:1). Previous note: `DESIGN.md` §2.3 says filled buttons use `#0070f0` (4.6:1 with white text). `foundation/theme-values.ts:57` ships `#09f` (3.0:1), which the maintainer chose as "the CodeImage primary". One of the two must change. The K5 design doc's "implementation amendments" also describe values the code no longer has. `action.brandSoft.text` (`#09f`) is 3.0:1 on white too.

## High

- [ ] **JSX props read twice break hydration.** Fixed in `fix/kit-jsx-props-once` for every component except Dialog and Sheet, which still read `title`, `description` and `footer` twice (`Dialog.tsx:57,63`, `Sheet.tsx:81,83,94,98`). `pnpm test:hydration` hydrates every ready component with an element in each content prop and fails on a mismatch. `<Show when={local.action}>{local.action}</Show>` runs the prop getter once for the condition and once for the children. On the client the first run claims a hydration key that the server never wrote to the page. A plain element falls back to a fresh node, which leaves a detached duplicate. A polymorphic part (Kobalte `Dynamic`) calls `getNextElement()` with no template and throws `TypeError: t is not a function`. The docs `alert/actions` demo (a Button as `action`) dies on every load. Reproduced in the docs build. Resolving the prop once with `children(() => local.action)` and using that accessor in both places removes the error, and the demo's button then updates the description. Same pattern: `Alert.tsx:44,50`, `Badge.tsx:24`, `Dialog.tsx:57,63`, `Popover.tsx:40,43`, `Sheet.tsx:81,83,94`, `OptionCard.tsx:107`, `Combobox.tsx:143`, and the `description` Show in TextField, TextArea, CheckBox, RadioList, Select and NumberField.
- [x] **Select** submits nothing in a form. It renders no hidden input, so `name` has no effect (`components/Select/Select.tsx:162`). The docs show a hidden-input workaround. Fixed in `fix/kit-high-findings`: one hidden input per selected value. Kobalte's `HiddenSelect` was rejected because axe reports `aria-hidden-focus` on its autofill input. `aria-label` is optional when `label` is set.
- [x] **Token overrides** written only on `:root` do not reach nested `[data-cui-theme]` scopes, because `foundation/cui.css.ts:78-79` sets every token again on each scope. `packages/kit/README.md:18` shows the `:root`-only form. Fixed in `fix/kit-high-findings`: scopes set again only tokens that differ by mode (and `--cui-focus-color`). Overrides of those still go on `:root, [data-cui-theme]`, as the README and Theming page now show. `tools/baseline/theme-overrides.mjs` checks it in Chromium.
- [x] **Tooltip** puts `aria-describedby` on the wrapper `div` instead of the focusable child, so screen readers do not read it (`components/Tooltip/Tooltip.tsx:15-37`).
- [x] **Button** `loading` sets neither `disabled` nor `aria-busy`, so a loading button stays clickable (`components/Button/Button.tsx:41`). Fixed in `fix/kit-high-findings`: `aria-busy` and `aria-disabled`, activation ignored, focus kept.
- [ ] **Focus rings are missing or not visible.** Tabs, RadioList, Checkbox and fields fixed in `fix/kit-controls-parity`; Link remains.
  - Link removes the outline with no replacement (`components/Link/Link.css.ts:10`).
  - Tabs does the same (`components/Tabs/Tabs.css.ts:48`).
  - RadioList has no focus style.
  - Fields show focus as a border color on `:focus` (`components/Field/Field.css.ts:49`) instead of the 2px `:focus-visible` ring.
- [x] **NumberField** ignores `disabled` and `readOnly` in its controls. Fixed in `fix/kit-high-findings`.
  - The step buttons ignore `disabled` (`components/NumberField/NumberFieldControls.tsx:16`).
  - The buttons and the arrow keys ignore `readOnly` (`NumberField.tsx:178`).
  - `canIncrement` and `canDecrement` check ±1 instead of `step` (`NumberField.tsx:312`).
- [x] **Combobox with a controlled value.** A second Escape or clearing the text keeps the selection and does not call `onChange`, because Kobalte clears only when `value` is `undefined`. `createComboboxOptions().controlled()` always passes a value or `null` (`createComboboxOptions.ts:94`), so it always has this gap. Fixed in `fix/kit-high-findings`: the parts `Root` calls `onChange(null)` on empty text for a controlled single value.

## Medium

### Behavior

- [ ] **NumberField.**
  - [x] The step buttons show only on hover or input focus (`NumberField.css.ts:52`). Tabbing to them may hide them and drop focus. Reproduced in Chromium: Tab from the input dropped focus to `body`. Fixed: the buttons have `tabindex="-1"` (spinbutton pattern) and stay shown with `:focus-within`.
  - [x] `sanitizedValue || null` may show an empty input for `0` (`NumberField.tsx:116`). Fixed.
  - The separators are fixed and ignore the locale (`options.ts:65`), and the form submits the formatted text.
  - [x] The input has no `spinbutton` role. Fixed, with `aria-valuenow`, `aria-valuetext`, `aria-valuemin` and `aria-valuemax`.
- [ ] **TextArea** stays at the control height and ignores `rows` unless `autoResize` is set (`TextArea.css.ts`, `Field.css.ts:80`).
- [ ] **TextField and TextArea** set `data-field-size` only when `size` is passed, so the label and message sizes do not apply at the default size (`TextField.tsx:77`, `TextArea.tsx:79`).
- [ ] **`createSelectOptions`.**
  - `controlled` treats `0` and `""` as no selection (`Select/createSelectValue.ts:96`).
  - It has no disabled mapping (`:52`).
  - `props()` leaves out `options`, while `createComboboxOptions` includes it.
- [ ] **Combobox.**
  - The ready component accepts `multiple` but cannot show more than one value.
  - The empty message has no `data-cui` and no `classes` key (`Combobox.tsx:62`).
- [ ] **CommandMenu.**
  - An uncontrolled query is never reported as cleared on close (`CommandMenu.tsx:164`).
  - Group headings render `role="presentation"`, so options are not announced as belonging to a named group.
  - Escape closing the menu depends on `disallowEmptySelection`, because Kobalte calls `preventDefault`. **Check in browser.**
- [ ] **Escape on a Tooltip inside a Dialog** must not close the Dialog. **Check in browser.**
- [ ] **Toast.**
  - `ToastOptions` has no `priority`, so only the `Root` part can choose an assertive announcement (`components/Toast/Toaster.tsx:31`).
  - The toast parts need a Kobalte `toastId` (`parts/toast.tsx:110`), and the kit does not re-export the toaster engine. Apps that use the parts must depend on `@kobalte/core`.
- [x] **Checkbox and RadioList** discard the `theme` prop (`components/CheckBox/CheckBox.tsx:30`, `components/RadioList/RadioList.tsx:127`).
- [ ] **Progress** leaves the inherited `ValueLabel` empty while indeterminate.
- [ ] **Sheet** dismisses a drag at 35% of its height (`parts/sheet-drag.ts:21`), where the design said one third. The docs document 35%.

### API gaps

- [x] **Part style functions ignore their variant arguments.** `stackStyles.root(variants)`, `textStyles.root(variants)` and the OptionCard part styles return only the base class (`parts/stack.tsx:39`, `parts/text.tsx:15`, `parts/option-card.tsx:32-44`). Fix this once for every part.
- [x] **Stack.**
  - The `Gap` type leaves out the space keys `2.5` and `5` (`parts/stack.tsx:7`).
  - The inline `--cui-stack-gap` beats any value set in a class (`parts/stack.tsx:72`).
- [ ] **Exported names and types.**
  - Two different exports are named `popoverStyles`: the raw namespace at the root (`index.tsx:57`) and the part functions at `@codeui/kit/popover`.
  - `SelectProps` (`index.tsx:62`) and the `IconButton` props type are not exported. `TooltipProps` is exported. `SelectProps` is exported since `fix/kit-high-findings`.
  - `<Select multiple>` needs an explicit generic.
- [ ] **No public hint style.** `createFieldMessageProps` and the field message styles are not exported, so a custom field cannot match the hint.
- [ ] **DropdownMenu.**
  - SubTrigger, SubContent and Separator replace a caller's `class` and have no `data-cui` (`components/Dropdown/Dropdown.tsx:76,85,89`).
  - `rightSlot` is declared but never used (`:50`).
  - There are no checkbox or radio items.
- [ ] **Pagination** does not forward a navigation label or styling hooks (`components/Pagination/Pagination.tsx:57`).
- [ ] **Pagination accessible names.** Found on the docs homepage. The current page is announced through its label, "Page 3 active" (`Pagination.tsx:45-51`), instead of `aria-current="page"`. The next and previous items get the name of the page they lead to, so "Page 4" names two buttons. The homepage Playwright check reports it.
- [ ] **Accordion** keeps a closed section's content mounted at height 0 after hydration, while the server render leaves it out. The docs `accordion/basic` demo does the same. The content is not tabbable, but the client and server DOM differ. **Check in browser** whether a screen reader reaches it.
- [ ] **VirtualizedListbox** omits DOM styling props such as `style` (`components/Listbox/VirtualizedListbox.tsx:11`).
- [ ] **SvgIcon** drops the given `style` when `size` is absent (`icons/SvgIcon.tsx:14`).
- [ ] **Tokens consumer fixture.** The `...responsiveStyle()` spread replaces the `@media` key written before it (`packages/kit/fixtures/tokens-consumer/consumer.css.ts:17-20`).

## Spec drift from Inkstone

- [ ] **Motion.**
  - Dialog animates when opened from the keyboard (`foundation/motion.css.ts:10`). Popover, Select, Combobox, Dropdown and Tooltip are fixed (`utils/open-source.ts`).
  - The Tabs and SegmentedControl indicators slide on arrow keys (`Tabs.css.ts:71`, `SegmentedControl.css.ts:200`). Fixed in `fix/kit-controls-parity`.
  - Button press `scale(0.97)` ignores reduced motion (`Button.css.ts:73`).
  - Accordion uses keyframes instead of interruptible transitions (`Accordion.css.ts:5`). Fixed in `fix/kit-controls-parity`.
  - The loading indicators loop keyframes, against §7.3.
- [ ] **Sizes.**
  - Field and Select `md` controls are 40px, where the spec says 36px. Fixed in `fix/kit-controls-parity`.
  - The CommandMenu search row is 36px, where §6 says 44px on desktop (`CommandMenu.css.ts:59`).
  - The OptionCard preview minimum is 64px, where the spec says 68px (`OptionCard.css.ts:67`). Fixed in `fix/kit-controls-parity`.
  - The Kbd `sm` minimum width is 16px, where the spec says 20px.
  - Button defaults to `md` (`Button.css.ts:209`), 40px with 16px text. §6 and §3 ask for 36px controls with 14px labels, which is `sm`. The homepage passes `size="sm"` on every button.
  - The Popover maximum width is 276px, where §9.5 says 360px (`Popover.css.ts:10`).
  - The Dialog `md` size (32rem) is wider than a 390px phone (`Dialog.css.ts:162`).
- [ ] **Surfaces and color.**
  - Sheet adds divider borders, against "islands, not borders" (`Sheet.css.ts:108,193`).
  - Kbd uses the neutral action fill and a divider border, where §9.8 asks for a field fill and no new border (`Kbd.css.ts:17,36`).
  - The selected OptionCard changes its border but not the fill (`OptionCard.css.ts:37-44`). Fixed in `fix/kit-controls-parity`.
  - The highlighted Combobox row uses the accent fill, where §2 says selected rows are neutral (`Combobox.css.ts:142`). Fixed in `feat/kit-light-palette`: Combobox and Listbox highlight with `surface.menuHover` and `text.menu`, like Select and Dropdown; `feat/kit-one-brand-blue` checks it.
  - The default Tooltip theme uses the brand accent, against §2.3.
  - Alert uses `radius.sm` (`Alert.css.ts:24`). Check it against the radius scale.
  - Alert fills success, warning and danger with the solid status colour (`Alert.css.ts:7-9`). §2.4 says status never decorates, and danger fills only the confirm button of a destructive dialog. Three alerts side by side are the loudest thing on the docs homepage.
  - Pagination marks the current page with the filled `primary` theme (`Pagination.tsx:62`). §2.3 asks for a neutral selected item and one filled accent per surface.
  - Button `tertiary` is a soft accent wash on a button (`Button.css.ts:143`), which is not one of §2.3's five accent uses.
  - Link sets `color: inherit` with no underline (`Link.css.ts:15`). §2.2 keeps accent text for links. The homepage Text tile works around it with a local class.
- [ ] **Typography.** Text defaults to `sm` (14px), where the base is 13px, and its line height is a fixed 1.5 instead of one per step (`parts/text.tsx:41`).
- [ ] **Storybook.** The stories list a field theme `outline` that the source does not have (only `filled` and `inline` exist).

## Docs follow-ups (not kit bugs)

- [ ] The Toast styled-parts section can get a real example, now that `packages/docs-demos` depends on `@kobalte/core`.
- [ ] The Fumadocs header ships a bottom border, a backdrop blur and a translucent fill, against §4 "the header has no bar" and §7.3 "no materials". `apps/docs/src/styles/home.css` removes them on the homepage only. Decide whether the docs pages drop them too.
- [ ] `apps/docs/src/styles/inkstone.css` sets `text-transform: uppercase` on `.ink-fig__title`, against §3 "no uppercase labels".
- [ ] Delete the old single-file demos that no page uses any more: `demos/{text-field,text-area,number-field,select,select-options,dialog,dialog-parts,popover,popover-parts,tooltip,dropdown-menu,theme-scope}.tsx`.
