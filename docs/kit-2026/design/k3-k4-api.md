# K3 and K4 API design

Goal. CodeImage builds every dialog, popover, select, text field, radio list and segmented control from `@codeui/kit` with no direct Kobalte import, and another Solid app can do the same. K3 (`feat/kit-overlay-parts`) ships the styled-parts layer for Dialog and Popover and the Select list class. K4 (`fix/kit-field-gaps`) closes the TextField, RadioList and SegmentedControl gaps and the three type errors.

Labels. *measured* means a command output. *read* means I read the cited line. *inferred* means a judgment from reading. Kobalte references are `@kobalte/core@0.13.6` in this workspace. CodeImage references are `origin/main` at `dfdeda77`.

Result. No signature in this design narrows. Every change widens a type, adds an optional prop, or changes DOM and behavior. Four changes are visible, and they are listed under each component.

## 1. Shared conventions

### One part table per component

Each component has one `const` table that maps a part name to its `data-cui` value. The parts set `data-cui` from it. The `classes` prop type is derived from its keys. Tests and docs read it too.

```ts
export const dialogParts = {
  overlay: "dialog-overlay",
  panel: "dialog-panel",
  title: "dialog-title",
  // ...
} as const;
export type DialogPart = keyof typeof dialogParts;
export type DialogClasses = Partial<Record<DialogPart, string>>;
```

- **New values** use `<component>-<part>` in kebab case.
- **Values that exist today keep their spelling.** CodeImage selects `segmentedControl`, `segmentedControlItem`, `segmentedControlIndicator`, `button`, `icon-button` and `dropdown-menu-content` (measured, `git grep data-cui`). Renaming one would break app CSS with no type error. The legacy values below are marked *legacy*.
- **The `classes` key is the part name**, for example `classes.panel`, which maps to `data-cui="dialog-panel"`.

### `classes` and the existing `slotClasses`

Select, TextField and SegmentedControl already take `slotClasses` (`utils/component.ts`, read). `classes` is the new prop. `slotClasses` stays as a typed alias, is merged into `classes`, and is marked `@deprecated`. Removing it later is a break and goes in its own PR.

| Component | `slotClasses` key | Maps to `classes` key |
| --- | --- | --- |
| TextField | `root`, `input`, `label`, `errorLabel` | `root`, `input`, `label`, `errorMessage` |
| Select | `root`, `input`, `label`, `errorLabel`, `itemValue` | `root`, `trigger`, `label`, `errorMessage`, `value` |
| SegmentedControl | `root`, `list`, `indicator` | `root`, `list`, `indicator` |

Select declares `slotClasses.input` but never applies it (`Select.tsx:21-37,101-104`, read). The alias makes it work.

### `<component>Styles` shape

```ts
type PartStyle<V = undefined> = V extends undefined ? () => string : (variants?: V) => string;
export type DialogStyles = { [P in DialogPart]: PartStyle<P extends "panel" | "positioner" ? { size?: DialogSize } : undefined> };
```

Each function returns a class string, and the part adds its `data-cui`. Variant types are written by hand, for example `DialogSize = "xs" | "sm" | "md" | "lg" | "xl" | "full"`. Today `RecipeVariants<typeof panel>` from vanilla-extract leaks into the public `.d.ts` (`Dialog.css.ts`, read). The hand-written union is the same set, so this is not a narrowing, and the public types no longer depend on the styling engine.

The root namespaces `popoverStyles` and `textFieldStyles` (`index.tsx`, read) stay as they are. They expose raw vanilla-extract exports: `title` is a string, `content` is a recipe and `popoverThemeVars` is a theme contract. Turning them into part functions would change the type of `title`. CodeImage uses `textFieldStyles.baseField` 3 times and `popoverStyles` 0 times (measured). The new part-function objects ship from the subpath. Their names are decision D1 below.

### Where things are exported

| Export | K3 | K4 |
| --- | --- | --- |
| `@codeui/kit/dialog`, `@codeui/kit/popover` (parts, `xxxParts`, `xxxStyles`) | yes | |
| `@codeui/kit` ready components with `classes` and JSX content props | Dialog, Popover, Select | TextField, RadioList, SegmentedControl |
| `@codeui/kit/select`, `/text-field`, `/radio-list`, `/segmented-control` | no. The parts tables are fixed here so the ready `classes` keys do not change later | no |

The roadmap says the subpath pattern spreads only after the K3 pilot. Select, TextField, RadioList and SegmentedControl get the part table and `classes` now. Their subpaths come later.

## 2. Dialog (K3)

### Parts, `@codeui/kit/dialog`

Usage is `import * as Dialog from "@codeui/kit/dialog"`, which mirrors `import {Dialog} from "@kobalte/core/dialog"` in the CodeImage callers.

| Export | Wraps | Part key | `data-cui` |
| --- | --- | --- | --- |
| `Root` | `KDialog` (renders no element) | none | none |
| `Trigger` | `KDialog.Trigger` | `trigger` | `dialog-trigger` |
| `Portal` | `KDialog.Portal` (`mount` passes through) | none | none |
| `Overlay` | `KDialog.Overlay` | `overlay` | `dialog-overlay` |
| `Positioner` | kit `div`, centers the panel, `data-panel-size` | `positioner` | `dialog-positioner` |
| `Content` | `KDialog.Content` (today's `DialogPanel`) | `panel` | `dialog-panel` |
| `Header` | kit `div`, title row | `header` | `dialog-panel-title` *legacy* |
| `Title` | `KDialog.Title` | `title` | `dialog-title` |
| `Description` | `KDialog.Description` | `description` | `dialog-description` |
| `CloseButton` | `KDialog.CloseButton as={IconButton}` with a close icon | `closeButton` | `dialog-close-button` |
| `Body` | today's `DialogPanelContent` | `body` | `dialog-panel-content` *legacy* |
| `Footer` | today's `DialogPanelFooter` | `footer` | `dialog-panel-footer` *legacy* |
| `dialogParts`, `dialogStyles` | | | |

Each part takes `class`, which is merged after the kit class, plus every prop of the Kobalte part it wraps. `DialogPanel`, `DialogPanelContent` and `DialogPanelFooter` stay at the root as the same functions as `Content`, `Body` and `Footer`.

### Ready component, `@codeui/kit`

```ts
export type DialogProps = KDialogRootOptions & {
  size?: DialogSize;
  title?: JSX.Element;             // was string
  description?: JSX.Element;       // new
  closeLabel?: string;             // new, default "close", today's hardcoded value
  mount?: Node;                    // new, the Portal mount
  classes?: DialogClasses;         // new
  "aria-label"?: string;           // new, goes to Content
} & Pick<DialogContentOptions,     // new, all go to Content
  "onOpenAutoFocus" | "onCloseAutoFocus" | "onEscapeKeyDown" |
  "onPointerDownOutside" | "onFocusOutside" | "onInteractOutside">;
```

Its structure is unchanged. It renders Portal, Overlay, Positioner and Content, then a Header with Title and CloseButton when `title` is set, then `children`.

### Old and new signatures

| Change | Old | New | Why it only widens or adds |
| --- | --- | --- | --- |
| `title` | `string` | `JSX.Element` | `string` is a member of `JSX.Element` |
| `size` | `RecipeVariants<typeof panel>["size"]` | `DialogSize` | The same union, written by hand |
| `description`, `closeLabel`, `mount`, `classes`, `aria-label`, Content callbacks | none | optional | Added and optional |
| Statics | none | none. Parts live in the subpath | No change |

### Behavior fixes

- **Focus return without a trigger.** Kobalte's modal `onCloseAutoFocus` always calls `preventDefault()` and then `focusWithoutScrolling(context.triggerRef())` (`chunk/3HJ5K5AL.jsx:143-147`, read). With no `Trigger` the ref is `undefined`, and `focusWithoutScrolling` returns early (`@kobalte/utils` `index.js:196-198`, read), so focus goes to `body`. The kit `Content` records `document.activeElement` when it is created. On close, the kit runs the caller's `onCloseAutoFocus` first. If the caller did not call `preventDefault()` and the opener is still connected, the kit focuses the opener. When a `Trigger` exists, Kobalte focuses it next, so trigger dialogs behave as before. This is the root cause behind the hand-written `restoreFocus` in 6 CodeImage files (`git grep restoreFocus`, measured) and `settings-state.ts:51`.
- **Title accepts JSX.** This removes the `KDialog.Title` workaround in `SettingsDialog.tsx:241` and `Showcase.tsx:161` when the default header layout fits.
- **Close label.** The kit's close button has the hardcoded label `'close'` (`Dialog.tsx:50`, read), so every localized caller builds its own close button. `closeLabel` fixes that.
- **Width override.** `classes.panel` replaces `globalStyle('div:has(> ...)')` in `settings.css.ts:51-56`.

## 3. Popover (K3)

### Parts, `@codeui/kit/popover`

| Export | Wraps | Part key | `data-cui` |
| --- | --- | --- | --- |
| `Root` | `KPopover`, default `gutter` 6 that the caller can override | none | none |
| `Trigger` | `KPopover.Trigger` | `trigger` | `popover-trigger` |
| `Anchor` | `KPopover.Anchor` | `anchor` | `popover-anchor` |
| `Portal` | `KPopover.Portal` (`mount`) | none | none |
| `Content` | `KPopover.Content` with a `variant` | `content` | `popover-content` |
| `Arrow` | `KPopover.Arrow` | `arrow` | `popover-arrow` |
| `Title` | `KPopover.Title` | `title` | `popover-title` |
| `Description` | `KPopover.Description` (renders a `p`) | `description` | `popover-description` |
| `CloseButton` | `KPopover.CloseButton as={IconButton}` | `closeButton` | `popover-close-button` |
| `popoverParts`, `popoverStyles` (part functions, see D1) | | | |

### Ready components

```ts
export type PopoverProps = KPopoverRootOptions;                // unchanged; gutter now reaches Kobalte
export type PopoverContentProps<T extends ValidComponent = "div"> =
  KPopoverContentProps<T> & { variant?: "bordered" } & {
    title?: JSX.Element;          // was string
    description?: JSX.Element;    // new, rendered in Popover.Description
    mount?: Node;                 // new, the Portal mount
    classes?: PopoverClasses;     // new
  };
```

### Old and new signatures

| Change | Old | New | Why it only widens or adds |
| --- | --- | --- | --- |
| `PopoverContent.title` | `string` | `JSX.Element` | `string` is a member of `JSX.Element` |
| `description`, `mount`, `classes` | none | optional | Added and optional |
| `Popover` `gutter` | accepted by the type and ignored, because `gutter={6}` comes after the spread (`Popover.tsx:24`, read) | honored, default 6 | The type is unchanged. Behavior now matches the type. Neither kit Popover caller in CodeImage passes `gutter` (read) |

### Behavior fix: no `<p>` wrapper

Today `children` render inside `KPopover.Description`, which is a `<p>` (`Popover.tsx:54-56`, read). Threads decision 6 bans that wrapper. The new `PopoverContent` renders `children` directly in `Content`. The description styles (color and font size) move onto `content`, so plain text looks the same. Short descriptive text goes in the new `description` prop, which keeps `aria-describedby`.

Visible change. A popover whose children are block or grid content no longer stretches. Two callers use the kit Popover. `SidebarPopover` passes block children, and `EasingField` passes a `SegmentedField` that grew to about 200 px (threads, read). Both get the intended layout. Rerun the screenshot diff on both.

## 4. Select and its list (K3)

### Parts table (ready `classes` keys now, subpath later)

| Part key | `data-cui` | Element |
| --- | --- | --- |
| `root` | `select` | `KSelect` root |
| `label` | `select-label` | `KSelect.Label` |
| `trigger` | `select-trigger` | `KSelect.Trigger` |
| `value` | `select-value` | `KSelect.Value` |
| `icon` | `select-icon` | `KSelect.Icon` |
| `description` | `select-description` | `KSelect.Description` |
| `errorMessage` | `select-error-message` | `KSelect.ErrorMessage` |
| `content` | `select-content` | `KSelect.Content`, the portaled popover |
| `listbox` | `select-listbox` | `KSelect.Listbox` |
| `item`, `itemLabel`, `itemIndicator` | `select-item`, `select-item-label`, `select-item-indicator` | item parts |

`selectStyles` uses the same keys. The `trigger` style takes `{ size?: FieldSize; theme?: FieldTheme }`.

### Ready props

```ts
export type SelectProps<Option, OptGroup = never> = KSelectRootProps<Option, OptGroup> & BaseFieldProps &
  FieldWithErrorMessageSupport & {
    "aria-label"?: string;          // was required
    placeholder?: string;
    description?: JSX.Element;      // was string
    label?: JSX.Element;
    itemLabel?: (item: Option) => JSX.Element;
    valueComponent?: (state: Accessor<Option>) => JSX.Element;
    valueComponentMultiple?: (state: Accessor<Option[]>) => JSX.Element;
    classes?: SelectClasses;        // new
  } & SlotProp<SelectSlot>;         // kept, deprecated alias
```

### `createSelectOptions`, typed to match `Select`

```ts
type SelectOptionsProps<V> = {
  optionValue: "value";
  optionTextValue: (option: Option<V>) => string;
  itemLabel: (option: Option<V>) => JSX.Element;
  valueComponent: (state: Accessor<Option<V>>) => JSX.Element;
};
interface CreateSelectOptionsReturn<T, C extends ConfigFor<T>> {
  options: Accessor<Option<V>[]>;                       // V = MapOptionToValue<T, C["valueKey"]>
  optionToValue(option: Option<V> | null | undefined): V | undefined;
  optionFromValue(value: V): Option<V> | undefined;
  props(): SelectOptionsProps<V>;                        // was Record<string, unknown>
  controlled<W extends V>(value: Accessor<W | undefined>, onChange: (value: W | undefined, option: Option<W> | undefined) => void):
    { value: Option<W> | undefined; onChange: (option: Option<W> | null) => void };   // was (item: Option<W>)
}
```

| Change | Why it only widens |
| --- | --- |
| `"aria-label"` becomes optional | A caller that passes it still compiles. A field with a `label` gets its name from the label |
| `description: string` becomes `JSX.Element` | `string` is a member of `JSX.Element` |
| `controlled().onChange` param becomes `Option<W> \| null` | A wider parameter. Every existing call site still type-checks |
| `optionToValue` param adds `null` | A wider parameter |
| `props()` returns a named object type instead of `Record<string, unknown>` | A type alias with known keys is assignable to `Record<string, unknown>`, so callers that stored it as a record still compile |

### Fixes

- **Type error at `fields.tsx:80`.** Reproduced with `tsc` 5.6.2 against kit source (measured, scratch probe). The cause is that `controlled().onChange` is `(item: Option<string>) => void` and Kobalte needs `(value: Option<string> | null) => void` ("Types of parameters 'item' and 'value' are incompatible"). Spreading `props()` and passing `gutter` both compile. Adding `| null` removes the error.
- **Latent bug in `props()`.** It returns `optionValue: config.valueKey` and `optionTextValue: config.key` (`createSelectValue.ts:96-101`, read). The options it builds always have the shape `{label, value}`, so any config other than `{key: "label", valueKey: "value"}` points Kobalte at a missing key (inferred). The new version returns `"value"`, and a text function that reads `label` when it is a string and falls back to `String(value)` otherwise. CodeImage's only config is `{key: 'label', valueKey: 'value'}` (read), so nothing changes for it.
- **List class.** `classes.content` goes on `KSelect.Content`. This replaces the `getElementById(`${id}-listbox`).parentElement.classList.add` code in `fields.tsx:97-103`.
- **`slotClasses` leak.** `slotClasses` currently reaches the Kobalte root through `others` (`Select.tsx:61-75`, read). The new version splits it out.

### Listbox and VirtualizedListbox

| Change | Old | New | Why |
| --- | --- | --- | --- |
| `VirtualizedListbox` `class` | missing, because the props are `Omit<ListboxProps<...>>`, which is not polymorphic | `class?: string`, plus `classes?: { root, item, itemLabel, itemIndicator }` | Added. Fixes the `@ts-expect-error` at `FontSystemPicker.tsx:108`, reproduced (measured) |
| `Listbox` `classes` | none | optional, same keys | Added |

### The third `@ts-expect-error` is not a kit bug

`FontPickerListbox.tsx:42` calls `props.onChange(values.keys().next().value)`. Kobalte types `onChange` as `(value: Set<string>) => void` (`listbox-section-*.d.ts:193`, read). Under TS 5.6, `next().value` is `string | undefined`, and the caller's `onChange` takes `string` (measured: "Argument of type 'string | undefined' is not assignable to parameter of type 'string'"). The kit type is correct. The fix belongs in CodeImage and is one line: `const [first] = values; if (first !== undefined) props.onChange(first);`. A kit-side single-value `onChange` would be a second selection API for one caller, so I do not recommend it.

## 5. TextField (K4)

### Parts table

| Key | `data-cui` |
| --- | --- |
| `root` | `text-field` *legacy* |
| `label` | `text-field-label` |
| `input` | `text-field-input` |
| `description` | `text-field-description` |
| `errorMessage` | `text-field-error-message` |

`textFieldStyles` at the root stays as it is (D1). The part-function object takes `{ size, theme }` on `input`.

### Props

```ts
export type TextFieldProps = KTextFieldRootOptions & BaseFieldProps & FieldWithErrorMessageSupport & {
  description?: JSX.Element;   // was string
  label?: JSX.Element;
  placeholder?: string;
  ref?: Ref<HTMLInputElement>;
  classes?: TextFieldClasses;  // new
} & SlotProp<TextFieldSlot>;   // kept, deprecated alias
```

### Fix: input attributes go to the input

One constant lists the attributes that only make sense on an `<input>`. `splitProps` sends them to `KTextField.Input`, which keeps them reactive.

```ts
const INPUT_KEYS = ["aria-label", "aria-labelledby", "aria-describedby", "aria-details",
  "aria-autocomplete", "aria-controls", "aria-activedescendant", "aria-expanded", "aria-haspopup",
  "aria-keyshortcuts", "autocomplete", "inputmode", "enterkeyhint", "spellcheck", "type",
  "maxLength", "minLength", "pattern", "autofocus"] as const;
```

Kobalte's `Input` passes `aria-label`, `aria-labelledby` and `aria-describedby` through `createFormControlField`, which merges them with the label and description ids (`chunk/6TVP5A3C.jsx:74-89`, `chunk/37WKIN7J.jsx:24-25`, read), so the label and the error message stay linked. The type does not change. TypeScript allows hyphenated JSX attributes on any component, so `aria-label` compiled before and still compiles. Only the element that receives it changes, from the root `div` to the `input`. This removes the `setAttribute('aria-label', ...)` effect at `SettingsDialog.tsx:187-192` and the one at `ThemePicker.tsx:89`.

## 6. RadioList and RadioListItem (K4)

### Parts table

| Key | `data-cui` |
| --- | --- |
| `root` | `radio-group-field` *legacy* |
| `label` | `radio-list-label` |
| `items` | `radio-list-items` |
| `description` | `radio-list-description` |
| `errorMessage` | `radio-list-error-message` |
| `item`, `itemControl`, `itemIndicator`, `itemLabel` | `radio-list-item`, `radio-list-item-control`, `radio-list-item-indicator`, `radio-list-item-label` |

`radioListStyles` uses the same keys. `items` takes `{ size, orientation }`.

### Props

```ts
export type RadioListProps<T extends ValidComponent = "div"> = KRadioGroupRootProps<T> & BaseFieldProps &
  FieldWithErrorMessageSupport & {
    label?: JSX.Element;
    description?: JSX.Element;            // was string
    classes?: RadioListClasses;           // new
  };
export type RadioListItemProps<T extends ValidComponent = "div"> = KRadioGroupItemProps<T> & {
  label?: JSX.Element;                    // was required string
  classes?: Partial<Record<"item" | "itemControl" | "itemIndicator" | "itemLabel", string>>;
};
export function RadioListItem<T extends ValidComponent = "div">(props: PolymorphicProps<T, RadioListItemProps<T>>): JSX.Element;
```

| Change | Why it only widens |
| --- | --- |
| `RadioListItem` props become polymorphic, forwarding `disabled`, `class`, `id` and handlers | Today only `value` reaches `RadioGroup.Item` (`RadioList.tsx:44`, read). Every prop that compiled before still compiles |
| `label: string` becomes `label?: JSX.Element` | Optional, and a wider type |
| `RadioList` `class` merged | Today `class={mergeClasses(baseFieldContainer)}` comes after `{...others}` and drops the caller's class (`RadioList.tsx:76-77`, read) |
| `RadioListProps`, `RadioListItemProps` exported | Added |

The `aria-label={props.label}` on `ItemLabel` goes away, because the label's text already names the radio and JSX cannot be an `aria-label`. This changes the DOM, not the types.

## 7. SegmentedControl (K4)

### Parts table

| Key | `data-cui` |
| --- | --- |
| `root` | `segmentedControl` *legacy* |
| `list` | `segmentedControlList` *legacy* |
| `indicator` | `segmentedControlIndicator` *legacy* |
| `item` | `segmentedControlItem` *legacy* |

### Props

```ts
export type SegmentedControlProps = Omit<TabsRootProps, "orientation" | "value" | "defaultValue" | "onChange"> &
  { value?: string; defaultValue?: string; onChange?: (value: string) => void } &
  SegmentedControlVariants & { autoWidth?: boolean } & {
    classes?: SegmentedControlClasses;              // new
    onEscapeKeyDown?: (event: KeyboardEvent) => void; // new
  } & SlotProp<"root" | "list" | "indicator">;      // kept, deprecated alias
```

`segmentedControlStyles`: `root({ size, theme, variant, fluid, pill })`, `list()`, `indicator()`, `item()`.

### Fix: intrinsic height

Today two things make the height depend on the parent (`SegmentedControl.css.ts`, read). `fluid: true` sets `segmentHeight: 100%` (`:122-128`). With no `size`, `segmentHeight` is `""`, so the wrapper is `auto` and each segment is `height: 100%` of an auto box.

The new CSS:

- `fluid` sets only `width: 100%`.
- The default variant is `size: "md"`.
- The wrapper height is always `segmentHeight`, exposed as a CSS variable that a layout can set.

Visible change. A `fluid` control no longer fills a taller parent, and a control with no `size` gets the `md` height. CodeImage always passes `size` through `SegmentedField` (read). Its four height overrides (`controls.css.ts:72-77`, `picker.css.ts:34-35`, `settings.css.ts:519`, `dock.css.ts:86`) become deletable. They are not required. No codemod is needed.

### Fix: Escape

The root cause is in Kobalte's selectable collection. For Escape it calls `e.preventDefault()` even when `disallowEmptySelection` means nothing gets cleared (`chunk/H6DSIDEC.js:325-331`, read). Tabs always disallow an empty selection. The dismissable layer closes only `if (!e.defaultPrevented)` (`chunk/5B3SMNNU.js:359-365`, read). So Escape on a segment never closes the enclosing dialog or popover.

The kit fix is a native capture-phase listener on the root, kept in one `utils/escape.ts`:

```ts
// Escape bypasses Kobalte's tabs handler and is re-dispatched from the parent, so the enclosing layer sees it.
function releaseEscape(root: HTMLElement, onEscapeKeyDown?: (e: KeyboardEvent) => void): () => void;
// on Escape, if !defaultPrevented: stopPropagation(); onEscapeKeyDown?.(e);
// if still !defaultPrevented: root.parentElement.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true, cancelable: true}))
```

The caller can call `preventDefault()` in `onEscapeKeyDown` to keep the surface open. That replaces `SegmentedField`'s `onEscape`, its `on:keydown` stopPropagation (`SegmentedField.tsx:36-53`) and `closeOnEscape` (`dock/context.ts:46-51`). File the upstream Kobalte fix (do not `preventDefault` Escape when nothing is cleared) and delete the shim when the kit's Kobalte includes it. Listbox has the same handler. Applying `releaseEscape` to Listbox is the same one-line change, but it is outside K4.

Tests for K4 (behavior):

- Escape on a focused segment inside a kit `Dialog` closes the dialog.
- The same inside a `Popover` closes the popover.
- With `onEscapeKeyDown={e => e.preventDefault()}`, both stay open.
- Arrow keys still move the selection.

## 8. CodeImage callers that import Kobalte today

| File | Layer after K3/K4 |
| --- | --- |
| `UE/shell/SettingsDialog.tsx` | ready `Dialog` + parts `Title`, `CloseButton` |
| `components/WhatsNew/Showcase.tsx` | ready `Dialog` + part `Title` |
| `components/WhatsNew/NewDot.tsx` | popover parts |
| `UE/controls/ShortcutHelp.tsx` | popover parts (canvas), ready `Dialog` (modal) |
| `UE/variants/dock/Sheet.tsx` | dialog parts until K7 Sheet |
| `UE/shell/export-animation-dialog.tsx` | dialog parts + ready `RadioListItem`. `Progress` stays on Kobalte until K6 |
| `UE/shell/ExportControl.tsx`, `UE/controls/ControlOverlay.tsx`, `components/Animation/PhoneSteps.tsx` | dialog parts |
| `UE/command-menu/CommandMenu.tsx`, `UE/shell/export-styles/sheet.tsx` | ready `Dialog` |
| `UE/shell/export-styles/panel.tsx`, `video.tsx`, `UE/variants/dock/index.tsx` | ready `Popover` |
| `UE/controls/fields.tsx` `SelectChoice` (kit today, with workarounds) | ready `Select` |
| `fields.tsx` Switch, `WindowStyleTiles`, `choice-fields`, `sections` RadioGroup cards, `TabName` Combobox, `ui/Alert` | not K3/K4. These go to K6, K7 and K8 |

K3's gate says the pattern spreads "only if the Kobalte import count reaches zero". After K3 and K4 the count can reach zero only for `@kobalte/core/dialog` and `/popover` (14 files). Seven files still import Switch, Progress, RadioGroup cards, Combobox and Alert, and those components do not exist in the kit until K6 to K8. Scope the gate to dialog and popover imports (inferred from the import list, measured).

**SettingsDialog**, ready + parts. The opener tracking in `settings-state.ts` and the `:has()` width override can go.

```tsx
import * as D from "@codeui/kit/dialog";
<Dialog size="xl" open={settings.isOpen()} onOpenChange={o => !o && settings.close()}
  classes={{ panel: styles.panel }}>
  <Panel sections={sections} />   {/* inside Panel's header: */}
</Dialog>
<D.Title class={styles.crumbs}>…</D.Title>
<D.CloseButton aria-label={t("common.close")} class={styles.close} />
<TextField aria-label={t("editor.searchSettings")} value={query()} onChange={setQuery} />
```

**Showcase**, ready + part `Title`, because the header also holds a minimize button.

```tsx
<Dialog size="xl" open onOpenChange={o => !o && close(false)} classes={{ panel: styles.panel }}>
  <div ref={title} class={styles.sheetTitle}>
    <D.Title>{t("editor.whatsNew")}</D.Title>
    <div class={styles.headerActions}>{/* minimize + close IconButtons, unchanged */}</div>
  </div>
  …
</Dialog>
```

**NewDot**, popover parts. Its own `Portal mount` and focus handling stay.

```tsx
import * as P from "@codeui/kit/popover";
<P.Root open={open()} onOpenChange={toggle} placement="bottom-start" gutter={10}>
  <P.Trigger class={styles.dot} aria-label={…} onClick={…} />
  <P.Portal mount={anchor?.closest<HTMLElement>('[role="dialog"]') ?? document.body}>
    <P.Content class={styles.coachmark} onCloseAutoFocus={…} on:keydown={…}>
      <P.Title class={styles.title}>…</P.Title>
      <P.Description class={styles.body}>…</P.Description>
    </P.Content>
  </P.Portal>
</P.Root>
```

**ShortcutHelp**. The canvas variant is an anchored non-modal panel, which is what a Popover is: Kobalte's popover content has `role="dialog"` (`chunk/RP6BPYF5.jsx:203`, read). This drops `@floating-ui/dom`, `computePosition` and `restoreFocus`.

```tsx
<Show when={props.canvas} fallback={
  <Dialog open={open()} onOpenChange={setOpen} title={t("shortcut.buttonAction")}
    closeLabel={t("common.close")} classes={{ panel: styles.content }}><ShortcutList /></Dialog>}>
  <P.Root open={open()} onOpenChange={setOpen} anchorRef={() => trigger} placement="bottom-start" gutter={8}>
    <P.Portal><P.Content class={styles.content}>
      <div class={styles.header}><P.Title>{t("shortcut.buttonAction")}</P.Title>
        <P.CloseButton aria-label={t("common.close")} /></div>
      <ShortcutList />
    </P.Content></P.Portal>
  </P.Root>
</Show>
```

**dock/Sheet**, dialog parts. Everything stays except the import. Escape now reaches the layer, so `on:keydown={closeOnEscape(...)}` can go.

```tsx
<D.Root open={dock.panel() !== undefined} onOpenChange={o => !o && dock.close()} modal={false}>
  <div class={styles.sheetSlot} ref={setSlot} />
  <Show when={slot()}>{mount => (
    <D.Portal mount={mount()}>
      <D.Content class={`${styles.sheet} ${sidebarTheme}`} aria-label={…}
        onOpenAutoFocus={e => e.preventDefault()} onCloseAutoFocus={…} onPointerDownOutside={…}>
        …
      </D.Content>
    </D.Portal>)}</Show>
</D.Root>
```

**export-animation-dialog**. `FormatItem` and its Kobalte radio parts go away.

```tsx
<RadioList size="sm" value={exporter().format()} onChange={exporter().changeFormat}
  aria-label={t("animation.export.format")} disabled={exporter().busy()}>
  <RadioListItem value="mp4" disabled={!!unsupported()} label={ANIMATION_FORMATS.mp4.label} />
  <RadioListItem value="gif" label={ANIMATION_FORMATS.gif.label} />
</RadioList>
<D.Root open={props.exporter.open()} onOpenChange={closeChanged} modal={false}>
  <D.Portal><Show when={!busy()}><div class={styles.videoBackdrop} /></Show>
    <D.Positioner class={styles.videoDialog}><D.Content class={styles.confirmationPanel} onInteractOutside={keepOpen}>
      <D.Title>{t("animation.export.title")}</D.Title><AnimationExportContent {...props} />
    </D.Content></D.Positioner></D.Portal>
</D.Root>
```

**ExportControl**, **ControlOverlay** and **PhoneSteps**, dialog parts. Each swaps `Dialog.X` from Kobalte for `D.X` and keeps its own `onCloseAutoFocus`, because each returns focus to a specific element.

```tsx
<D.Root open={exporter().confirming()} onOpenChange={closeConfirmation}>
  <D.Portal><D.Overlay class={styles.backdrop} />
    <D.Positioner class={styles.confirmation}>
      <D.Content class={styles.confirmationPanel} onCloseAutoFocus={restoreFocus}>
        <D.Title>…</D.Title><D.Body>…</D.Body><D.Footer>…</D.Footer>
      </D.Content></D.Positioner></D.Portal>
</D.Root>
```

**CommandMenu**, ready.

```tsx
<Dialog open={commandMenu.isOpen()} onOpenChange={o => !o && commandMenu.close()}
  aria-label={t("editor.searchOptions")} classes={{ panel: styles.menu }}
  onCloseAutoFocus={e => { e.preventDefault(); if (giveFocusBack) commandMenu.opener()?.focus(); giveFocusBack = true; }}>
  <Commands … />
</Dialog>
```

The default kit focus return makes `giveFocusBack` and `opener()` removable, unless the "run a command, then keep focus where the command put it" case needs them. That is the `giveFocusBack = false` branch, and it stays (inferred).

**export-styles/sheet.tsx**, ready (`title`, `closeLabel`, `classes`). **export-styles/panel.tsx**, **video.tsx** and **dock/index.tsx**, ready `Popover`.

```tsx
<Popover open={open()} onOpenChange={setOpen} placement="bottom-end">
  <PopoverTrigger as={Button} …>…</PopoverTrigger>
  <PopoverContent title={t("export.styles")} class={styles.panel}
    mount={props.host?.mount()} onOpenAutoFocus={…}>
    …   {/* no <p> wrapper: grid children lay out as written */}
  </PopoverContent>
</Popover>
```

`panel.tsx` renders `Popover.Title as="h2"`. The ready `title` renders `KPopover.Title`, whose default element is already `h2` (`chunk/RP6BPYF5.jsx:349-362`, read).

**fields.tsx `SelectChoice`**, ready. The `@ts-expect-error` and the `getElementById` code go away.

```tsx
<Select disallowEmptySelection {...options.props()}
  {...options.controlled(() => props.control.value(), key => { if (key !== undefined && key !== props.control.value()) props.control.set(key); })}
  options={options.options()} disabled={props.control.disabled()} gutter={props.gutter}
  classes={{ content: props.listClass }}
  aria-label={props.control.label()} id={props.id} size={props.size ?? "sm"} />
```

## 9. Build mechanics for subpaths

`rollup-preset-solid` 2.0.1 takes a single `input` string. It calls `resolve(src)` and `parse(src)` on it, and its `ts` plugin compiles from that one file (`dist/esm/index.js`, read). The kit already replaces the preset's `ts` plugin and edits `config.external` after `withSolid` (`rollup.config.js`, read). Subpaths use the same approach.

```js
const entries = ["src/index.tsx", "src/parts/dialog.tsx", "src/parts/popover.tsx"];
const config = withSolid({ input: entries[0], targets: ["esm"],
  output: [{ preserveModules: true, preserveModulesRoot: "src", dir: "dist/esm" }] });
config.input = entries;                       // after the preset, like `external` today
// tsTypes(): ts.createProgram(entries, { ...same options, outDir: "dist/source", declarationDir: "dist/types" })
```

The entries go in `input`, not only behind `preserveModules`. Rollup keeps every export of an entry, but it can drop unused exports from modules that are not entries. Array input with `preserveModulesRoot: "src"` emits `dist/esm/parts/dialog.js` next to `dist/esm/index.js`. `tsc` with JSX preserve emits `dist/source/parts/dialog.jsx` and `dist/types/parts/dialog.d.ts`.

```json
"exports": {
  ".":          { "types": "./dist/types/index.d.ts",         "solid": "./dist/source/index.jsx",         "import": "./dist/esm/index.js" },
  "./dialog":   { "types": "./dist/types/parts/dialog.d.ts",  "solid": "./dist/source/parts/dialog.jsx",  "import": "./dist/esm/parts/dialog.js" },
  "./popover":  { "types": "./dist/types/parts/popover.d.ts", "solid": "./dist/source/parts/popover.jsx", "import": "./dist/esm/parts/popover.js" },
  "./package.json": "./package.json"
},
"typesVersions": { "*": { "dialog": ["dist/types/parts/dialog.d.ts"], "popover": ["dist/types/parts/popover.d.ts"] } }
```

- **Condition order** is `types`, `solid`, `import`. The nested `browser` condition today duplicates `import` and goes away.
- **`typesVersions`** covers `moduleResolution: node`, the mode the kit's own tsconfig uses. attw (K1) checks every subpath in node10, node16 and bundler modes.
- **Each subpath is a list of entries.** One subpath means one entry file, one `exports` key and one `typesVersions` key. K0's API snapshot covers each `.d.ts` entry.
- **vanilla-extract.** Subpaths do not change the constraint. Each part still imports its `.css.js` module, which only works when the consumer runs the vanilla-extract plugin (baseline, measured). The design stays independent of it in three ways. Public types use hand-written variant unions, not `RecipeVariants`. `xxxStyles` returns strings. Theming is through `data-cui` and CSS variables. The S1 spike can swap the engine behind `dialogStyles` without changing an export.
- **`sideEffects: false`.** It is set today. S1 has to recheck it when CSS becomes a side-effect import (inferred). K3 does not change it.

## 10. PR #57 "feat: add combobox" (2024) and K8

`gh pr view 57` (measured). It is open since 2024-01-07, `CONFLICTING`, and changes 13 files with +4941/-2813, mostly `pnpm-lock.yaml` and dependency bumps to Kobalte 0.12.6.

| Part | Reuse in K8 |
| --- | --- |
| `Combobox.css.ts` (211 lines) | Yes, as a starting point. Port it to the K5 tokens and the parts table |
| `utils/highlight` (match highlight through a TreeWalker and a positioned block) | Maybe. It ports CodeImage's directive and works without Kobalte. It needs SSR guards, because it calls `document.createTreeWalker` in the body (read) |
| `Combobox.stories.tsx` | Yes, as story cases |
| `Combobox.tsx` | No. It imports `createControllableBooleanSignal` from the `@kobalte/core` root (a non-public path, against kobalte.md 4c rule 1). It works around refocus with a hidden `<input aria-hidden="true">` that can still take focus, which is an axe violation. It closes with `setTimeout` races and spreads `{...others}` after controlled props, so callers can override them. It also uses 0.12 namespace types (`KCombobox.ComboboxRootProps`) |
| `package.json`, lockfile, Storybook config | No. Superseded by K1 and K2 |

Verdict. Do not rebase #57. Write K8 Combobox on the parts pattern, copy the CSS and stories, and close #57 with a link to K8.

## 11. Decisions for the maintainer

- **D1. Name of the new style objects where a root name already exists.** `popoverStyles` and `textFieldStyles` exist at the root with the raw vanilla-extract shape, and CodeImage uses `textFieldStyles` (measured). Recommended: keep the root ones unchanged and export the part-function objects under the same name from the subpath only (`@codeui/kit/popover`'s `popoverStyles`). The alternative is a new name such as `popoverPartStyles`. New components (`dialogStyles`, `selectStyles`, `radioListStyles`, `segmentedControlStyles`) have no conflict.
- **D2. When to remove `slotClasses`.** This design keeps it as a deprecated alias. Removing it is a break, so the question is whether it goes in 0.2.0 under decision 3 or waits for 1.0.
