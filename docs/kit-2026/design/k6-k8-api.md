# K6, K7, and K8 API proposal

CodeImage should import all generic UI controls from `@codeui/kit`. Another Solid app should get the same controls without CodeImage stores, routing, translations, or a vanilla-extract build plugin. This document proposes APIs only. No implementation or git operation is part of this work.

## Evidence and conventions

Counts below are importing files in [census.json](../phase-0/census.json), at `8fbbf85b`, rather than JSX occurrence counts. Source behavior was read through `git -C ~/WebstormProjects/codeimage show origin/main:<path>` and `git grep` on 2026-11-16. Paths starting `UE/` mean `apps/codeimage/src/pages/UnifiedEditor/`. Other app paths are relative to `apps/codeimage/src/`. Counts are baseline measurements. API signatures and visual choices below are proposals.

References are [roadmap](../roadmap.md), [K3/K4 API](k3-k4-api.md), [K5 tokens](k5-tokens.md), [token measurements](../phase-0/tokens.md), and [thread decisions](../phase-0/threads.md). Visually inspected screenshots are `tokens-shots/dark-settings-appearance.png`, `dark-commands.png`, and `light-export.png`. Geometry quoted from the other views comes from tokens.md, not a new measurement.

Kobalte availability was checked against the published [0.13.14 declarations](https://unpkg.com/@kobalte/core@0.13.14/dist/index.d.ts), including each `dist/<component>/index.d.ts`. Switch, Slider, Progress, Meter, Toast, Alert, Accordion, Combobox, RadioGroup, Skeleton, Badge, Dialog, and Listbox exist. Sheet composes Dialog. CommandMenu composes Combobox and Dialog. There is no dedicated Sheet or CommandMenu engine. Meter is available but does not describe export completion, so Progress uses Progress.

### Public contract

Every component has styled parts at its kebab-case subpath and a ready component at the root. Parts preserve the corresponding Kobalte public props, refs, events, polymorphism, and context exports. All rendered parts merge `class` with their kit class. Non-rendering Root and Portal exports have no invented DOM node or `data-cui` attribute.

Every subpath exports `<component>Parts`, `<component>Styles`, public props and variant types, and the named parts listed below. Tables list part keys. The stable attribute is `data-cui="<component>-<kebab-case-key>"`, for example `switch-error-message`. `classes` uses the short keys, as in `classes.errorMessage`, matching K3/K4. It never uses the full attribute value. For SettingsRow and SettingsGroup the prefixes are `settings-row` and `settings-group`.

The style shape for **each** component is the following. Each component section defines `P` and `V`. Every part function accepts the component's optional variants, ignoring variants irrelevant to that part. The object has exactly the listed rendered keys. Styles return classes only. Callers applying styles to their own elements also apply the published `data-cui` and variant attributes.

```ts
type Classes<P extends string> = Partial<Record<P, string>>;
type Styles<P extends string, V> = { [K in P]: (variants?: V) => string };
type Appearance<P extends string> = { class?: string; classes?: Classes<P> };
type Tone = "neutral" | "info" | "success" | "warning" | "danger";
type FieldContent = {
	label?: JSX.Element;
	description?: JSX.Element;
	errorMessage?: JSX.Element;
};
```

Type excerpts use `JSX`, `ComponentProps`, `Accessor`, and `ValidComponent` from Solid and public Kobalte subpath types. `KSwitch`, `KSlider`, and similar names mean the public namespace imported from the matching `@kobalte/core/<component>` module. They are notation, not new kit exports. `Omit` replaces explicitly owned ready props. HTML props extend the specified element with collisions omitted. No private Kobalte imports, styling-engine types, generic slots, or `slotProps` enter emitted declarations.

A ready field without visible `label` requires `aria-label` or `aria-labelledby`. Those attributes target the actual input or interactive control. `createSwitchProps` and `createSliderProps` reuse the existing field helpers for label, description, and error IDs. Their input is an accessor to the corresponding ready props; their output is `{ root, input, label, description, errorMessage }`, each an accessor to typed part props. They do not implement keyboard state. Other helpers are named below. Single-element components need no artificial helper.

### Shared visual and behavior rules

All color, space, radius, typography, shadow, and duration values resolve through K5 tokens. Defaults are the CodeImage look. Islands use `surface.panel`, fields use `surface.input`, floating lists use `surface.menu`, dialogs use `surface.dialog`, and toasts use `surface.toast`. Text uses the matching role. The default accent is `action.brand.base`, and focus uses `focus.color/width/offset`, independently of selection.

Interactive targets are at least 28px on desktop and 40px on phone, including invisible hit area around a small switch or slider thumb. Text is at least 11px. Pointer hover styles require a hover-capable device. Disabled, checked, expanded, highlighted, invalid, and focus-visible styling follows engine state attributes. Do not duplicate engine state in kit signals.

Pointer-triggered infrequent transitions use 160ms or 200ms with `motion.ease.out`. Larger exits may use 260ms. Keyboard-triggered changes and frequent selection, typing, slider movement, and command navigation use zero duration. Reduced motion removes movement and retains short fades for presence changes. Expose `motion?: "auto" | "none"` on Sheet and Accordion; auto detects the initiating input modality. Programmatic opens without a known pointer default to no movement. CommandMenu always has no presence animation. Skeleton and Spinner have explicit continuous-motion rules below.

Tooltip triggers cover the whole button, segment, or card label rather than only its icon. Tooltips supplement an accessible name. Nested Escape first dismisses the active child popup and cannot also close its parent overlay. SSR must not access document, window, observers, or animation APIs at module load. Export-frame primitives must keep their static markup and CSS within Takumi's supported subset.

## K6 form controls, layout, and text

### Switch

Replaces `UE/controls/fields.tsx` SwitchField, the sole direct switch importer, plus the `role="switch"` button in `components/Toolbar/SettingsDialog.tsx`. The wrapper relies on `id` on Input, optional accessible label, controlled `checked`, boolean `onChange`, and disabled state. The legacy Toggle has zero importers and earns no compatibility API.

Engine is Kobalte Switch. Parts at `/switch` are Root, Input, Control, Thumb, Label, Description, and ErrorMessage. Rendered keys are `root input control thumb label description errorMessage`.

```ts
type SwitchProps = Omit<KSwitch.SwitchRootProps, "children"> & FieldContent &
	Appearance<SwitchPart> & {
		inputId?: string;
		"aria-label"?: string;
		"aria-labelledby"?: string;
		size?: "sm" | "md";
	};
// switchStyles: Styles<SwitchPart, { size?: "sm" | "md" }>
```

Ready Switch renders one hidden form input, track and thumb, then optional field text. Checked/defaultChecked, name, required, validationState, readOnly, and onChange remain engine props. Default md has a proposed 36×22px pill and white 18px thumb. Compact sm is 30×18px. Both receive the shared minimum hit area. Off uses neutral/input-accent tokens. Checked uses brand. Thumb movement is immediate for keyboard and otherwise 160ms.

Codemod replaces SwitchField with `<Switch inputId={id} checked={checked} onChange={onChange} aria-label={label} disabled={disabled} />`. External row labels use `for={inputId}`. The dashboard button becomes a real Switch with the same setting setter. No synthetic click toggling remains.

### Slider

Replaces `packages/ui/src/lib/primitives/RangeField/RangeField.tsx`, with three importers, `UE/controls/ControlRow.tsx`, `UE/shell/export-styles/choice-fields.tsx`, and `UE/shell/sections.tsx`. Source relies on scalar value, min/max/step, input ID, disabled state, classes, and numeric onChange during dragging. RangeField currently parses integers and dispatches from both input and change. Preserving duplicate callbacks is unnecessary. The domain timeline slider stays in CodeImage.

Engine is Kobalte Slider. Parts at `/slider` are Root, Label, Description, ErrorMessage, Track, Fill, Thumb, Input, and ValueLabel. Keys are `root label description errorMessage track fill thumb input valueLabel`. Ready API handles one thumb. Multi-thumb consumers use parts with Kobalte arrays.

```ts
type SliderProps = Omit<KSlider.SliderRootProps,
	"value" | "defaultValue" | "onChange" | "onChangeEnd" | "children"> &
	FieldContent & Appearance<SliderPart> & {
		value?: number;
		defaultValue?: number;
		onChange?: (value: number) => void;
		onChangeEnd?: (value: number) => void;
		inputId?: string;
		"aria-label"?: string;
		"aria-labelledby"?: string;
		showValue?: boolean;
	};
// sliderStyles: Styles<SliderPart, { orientation?: "horizontal" | "vertical" }>
```

Adapter converts a scalar to `[value]`. Root minValue/maxValue/step retain engine semantics, including fractional steps. Default proposed rail is 2px, white thumb 10px, brand fill. Thumb hit area is 28/40px without changing rail size. Value changes never animate. A paired NumberField remains an app composition for precise entry, not a second state owner in Slider.

Codemod renames min/max to minValue/maxValue and preserves step and scalar callbacks. Move input refs and input ID onto Input when using parts. Move RangeField text size to the row Text. QualityChoice keeps its percent summary and gets a real accessible label.

### Progress

Replaces the one direct progress import in `UE/shell/export-animation-dialog.tsx`. It relies on value=`done`, maxValue=`total`, an accessible label, and separate frame-count text in a surrounding status region.

Engine is Kobalte Progress, not Meter. `/progress` exports Root, Label, Track, Fill, ValueLabel. Keys are `root label track fill valueLabel`.

```ts
type ProgressProps = Omit<KProgress.ProgressRootProps, "children"> &
	Appearance<ProgressPart> & { label?: JSX.Element; showValue?: boolean };
// progressStyles: Styles<ProgressPart, { size?: "sm" | "md" }>
```

Add `size?: "sm" | "md"` to ready props, default sm. Proposed track heights are 4/8px, full radius, neutral base and brand fill. Preserve minValue, maxValue, value, indeterminate, and engine value-label formatting. No width interpolation for frequent progress updates. Indeterminate uses a gentle opacity pulse, static under reduced motion. No nested live region for every frame.

Codemod can use ready `<Progress value={done} maxValue={total} aria-label={...} />`; the frame counter stays outside. Parts preserve the existing track/fill structure and classes.

### Kbd

Replaces six inline sites across ShortcutHelp, Header, SettingsDialog, dock/index, and sidebar/Rail. Census labels this four import files because inline elements have no component import; its evidence lists five paths. Treat six sites in five source files as the migration inventory. Values include `?`, platform command shortcuts, individual keys, and an aria-hidden search hint.

No Kobalte primitive. `/kbd` exports Root. Key is `root`.

```ts
type KbdProps = JSX.IntrinsicElements["kbd"] & Appearance<"root"> & {
		size?: "sm" | "md";
		variant?: "keycap" | "hint";
	};
// kbdStyles: Styles<"root", Pick<KbdProps, "size" | "variant">>
```

Uses mono family, 11px minimum, neutral fill, divider border, and badge radius. Hint has no keycap border. It is presentational and has no minimum interactive height. Keyboard sequences remain several Kbd children in an app wrapper. The app chooses OS-specific labels. Codemod preserves children and aria-hidden and maps each local class to class or variants. No key detection helper is added.

### Badge

Replaces `packages/ui/src/lib/primitives/Badge/Badge.tsx`, two importers in the two UserBadge copies, and `ui/ExperimentalChip/ExperimentalChip.tsx`, one importer. Badge relies on children, size, variant, theme class, and HTML props. ExperimentalChip is icon plus the word Experimental. Product wording and icon stay app-owned.

Engine is Kobalte Badge. `/badge` exports Root and kit Icon and Label wrappers. Keys are `root icon label`.

```ts
type BadgeProps = KBadge.BadgeRootProps & Appearance<BadgePart> & {
		children?: JSX.Element;
		icon?: JSX.Element;
		size?: "sm" | "md";
		tone?: Tone;
		variant?: "soft" | "outline";
	};
// badgeStyles: Styles<BadgePart, Pick<BadgeProps, "size" | "tone" | "variant">>
```

Default sm follows measured Default tag, 16px high, 1px 6px padding, radius.badge, 11px text, neutral fill and muted text. Proposed md is 20px with 12px text. Status tones use K5 action roles and require contrast verification. Badge is noninteractive. Codemod maps old theme CSS class to class, not tone, unless that class's semantic meaning is known. ExperimentalChip becomes Badge with icon and translated children. Retain textValue for nontext content.

### Spinner

Replaces `packages/ui/src/lib/primitives/Loader/LoadingCircle.tsx`, six importers, and Loading, one importer in WindowTab. LoadingCircle accepts SVG icon sizing, class, and SVG attributes. Its circle and ring use currentColor. Loading supplies the fallback composition around it.

No Kobalte primitive. `/spinner` exports Root, Track, and Indicator. Keys are `root track indicator`.

```ts
type SpinnerProps = Omit<JSX.IntrinsicElements["svg"], "children"> &
	Appearance<SpinnerPart> & { size?: "sm" | "md" | "lg"; label?: string };
// spinnerStyles: Styles<SpinnerPart, { size?: "sm" | "md" | "lg" }>
```

Proposed 12/16/24px SVG uses currentColor, faint track and solid partial ring. With label it has role=status and an accessible name. Without label it is aria-hidden, for use inside an already named busy control. Rotation is continuous only while mounted and becomes a static ring under reduced motion. Codemod maps SVG size names by rendered dimensions, preserves class, and gives standalone loading indicators a localized label. Loading's conditional display remains an app Show/Suspense composition.

### Skeleton

Replaces `ui/Skeleton/Skeleton.tsx` SkeletonLine, five importers, and `SkeletonDivider.tsx`, three importers. Line relies on CSS-string width/height/radius. Divider accepts height and supplies spacing rather than a loading block. SkeletonVCenter is a layout helper.

Engine is Kobalte Skeleton. `/skeleton` exports Root. Key is `root`.

```ts
type SkeletonProps = Omit<KSkeleton.SkeletonRootProps,
	"width" | "height" | "radius"> & Appearance<"root"> & {
		width?: JSX.CSSProperties["width"];
		height?: JSX.CSSProperties["height"];
		radius?: JSX.CSSProperties["border-radius"];
		children?: JSX.Element;
	};
// skeletonStyles: Styles<"root", { circle?: boolean; animate?: boolean }>
```

Ready adapter sets dimensions as ordinary CSS and omits engine numeric dimension props, preventing engine px conversion of strings. Styled Root retains native Kobalte numeric dimensions. Default radius.xs and neutral/input-accent fill use a subtle opacity pulse; no shimmer translation. Reduced motion disables the pulse. Placeholder blocks are aria-hidden; the containing app region owns aria-busy and loading text. A Skeleton wrapping content keeps engine visibility semantics.

Codemod maps SkeletonLine directly. Divider becomes a plain spacer with a class or Stack gap, never a fake loading placeholder. SkeletonVCenter becomes Stack plus an app height/flex class.

### Stack

Replaces `packages/ui/src/lib/primitives/Box/Stack.tsx`, HStack ten importers and VStack seven. Existing Stack requires spacing and inherits the full Box API, including alignItems, sizing, and flex rules. Box itself has 38 importing files and 66 JSX uses in the roadmap. Those counts are different units.

No Kobalte primitive. `/stack` exports Root. Key is `root`.

```ts
type Gap = "0" | "0.5" | "1" | "1.5" | "2" | "3" | "4" |
	"6" | "8" | "10" | "12" | "16" | "20" | "24" | "32" |
	"40" | "48" | "56" | "64" | "px";
type StackVariants = {
	gap?: Gap;
	align?: "start" | "center" | "end" | "stretch" | "baseline";
	direction?: "row" | "column";
};
type StackProps<T extends ValidComponent = "div"> = StackVariants &
	Appearance<"root"> & { as?: T; children?: JSX.Element } &
	Omit<ComponentProps<T>, keyof StackVariants | "as" | "children">;
// stackStyles: Styles<"root", StackVariants>
```

Default column, stretch, gap 2. Set data-gap, data-align, and data-direction. One local variable `--cui-stack-gap` resolves the selected space token. CSS uses `gap: var(--cui-stack-gap)` and fixed attribute selectors for align/direction. Gap selection requires a fixed selector per token, not a generated class per property/value. The style helper alone cannot set runtime gap attributes; callers also apply them. No padding, margin, width, responsive prop arrays, arbitrary gap values, or sprinkles API is added.

Codemod maps HStack/VStack to direction row/column, spacing to gap, and alignItems to align. Box flex-only layouts become Stack. Other Box uses become semantic elements with app CSS. Preserve original layout props in an extracted class. Do not silently discard them or port Box.

### Text

Replaces `packages/ui/src/lib/primitives/Text/Text.tsx`, 19 importers and 37 JSX uses. Relies on polymorphic as, size, weight, children, class, native attributes, and refs. Source defaults to span and uses useText's token classes.

No Kobalte primitive. `/text` exports Root. Key is `root`.

```ts
type TextVariants = {
	size?: "badge" | "xs" | "caption" | "sm" | "md" | "lg" | "xl" | "2xl";
	weight?: "normal" | "medium" | "semibold";
	tone?: "default" | "muted" | "hint" | "label" | "danger" | "success";
};
type TextProps<T extends ValidComponent = "span"> = TextVariants &
	Appearance<"root"> & { as?: T; children?: JSX.Element } &
	Omit<ComponentProps<T>, keyof TextVariants | "as" | "children">;
// textStyles: Styles<"root", TextVariants>
```

Default sm/normal/default, normal line height. Size and weight map one-to-one to K5 font tokens. Default/muted/hint/label map to text roles. Danger and success map to action status colors only after contrast checks; no new literal colors. Semantic heading levels come from as, never size. It has no motion or layout props. Codemod preserves native props/ref/as, maps equivalent legacy sizes and weights, and extracts unsupported sizes or bold weights to app CSS for explicit review. No silent narrowing of legacy typography.

## K7 feedback and overlays

### Toast

Replaces `packages/ui/src/lib/primitives/Snackbar/SnackbarHost.tsx` and `patch-solid-toast.ts`, toast 13 importers and SnackbarHost one in index.tsx. Callers rely on success/error, string or callback content receiving an ID, returned ID, dismiss, position, duration, theme, className/style, and inline action callbacks. ExportSuccessToast uses bottom-center, 8000ms, inverted theme, max-width, and CopyAltTextButton. CanvasEditor uses 10000ms action messages and dismisses on undo. The source patches solid-toast globally and initializes its exported toast only when the host mounts. Neither behavior becomes a kit contract.

Engine is Kobalte Toast and its toaster. `/toast` exports Region, List, Root, Title, Description, CloseButton, ProgressTrack, ProgressFill, plus kit Icon and Action. Keys are `region list root title description closeButton progressTrack progressFill icon action`.

```ts
type ToastId = number;
type ToastPosition = "top-left" | "top-center" | "top-right" |
	"bottom-left" | "bottom-center" | "bottom-right";
type ToastContext = { id: ToastId; dismiss: () => void };
type ToastContent = JSX.Element | ((context: ToastContext) => JSX.Element);
type ToastOptions = Appearance<ToastPart> & {
	title?: JSX.Element;
	description: ToastContent;
	tone?: Tone;
	action?: ToastContent;
	closeable?: boolean;
	duration?: number;
	position?: ToastPosition;
	regionId?: string;
	theme?: "light" | "dark";
	style?: JSX.CSSProperties;
};
type ToastProps = ToastOptions & { toastId: ToastId };
type ToastRegionProps = KToast.ToastRegionProps & Appearance<ToastPart> & {
	position?: ToastPosition;
	mount?: HTMLElement;
};
interface ToastController {
	show(options: ToastOptions): ToastId;
	update(id: ToastId, options: Partial<ToastOptions>): void;
	dismiss(id: ToastId): void;
	clear(): void;
}
// toastStyles: Styles<ToastPart, { tone?: Tone; position?: ToastPosition }>
```

Root exports ready Toast, ToastRegion, and `createToastController`. The helper scopes IDs and cleanup to its controller; it delegates storage/timing to Kobalte's toaster. A controller exposes a stable regionId for its matching ToastRegion. It can be created without a DOM. Controllers own their app identity; the engine toaster itself is module-global. Calls before region mount queue in that controller. On disposal, remove only its toast IDs. Position routes to a matching region; the application mounts only positions it uses. Region id and regionId are explicit, not derived from DOM queries. Kobalte toaster.dismiss removes an ID from visible and queued toasts. Use the mounted Toast context close() for a graceful exit, then remove it after completion; queued IDs can dismiss immediately. Verify that sequence before promising exit animation. Controller clear iterates only its owned IDs, never global toaster.clear(). Server-rendered calls do not enqueue into the module-global toaster; SSR renders an empty region and client event handlers enqueue after hydration.

Default proposed duration is 5000ms, limit three, bottom-center. Region uses pauseOnInteraction and pauseOnPageIdle. Critical persistent messages use duration Infinity and a close button. Announcements and swipe remain engine-owned. Region translations and hotkey pass through. Localized close labels are required. Toast action is a small inline text button, not a full-width block. Use toast surface/text, radius.md, 12px padding, 8px gap, width at most min(480px, viewport minus 32px), 13px message. Pointer entry fades/rises 8px over 200ms; reduced motion fades only. Keyboard region navigation has no animation.

Codemod supplies an app-scoped controller to the existing notification service. `toast.success(message, options)` becomes `notifications.show({ description: message, tone: "success", ...mappedOptions })`. Callback `activeToast.id` becomes numeric context id. String-typed stored IDs become ToastId. `dismiss` maps directly; `remove` maps to controller removal through a separately named immediate-removal method if a live caller actually needs it, rather than pretending dismiss is identical. `className` becomes class. Host becomes ToastRegion. Theme becomes data-cui-theme on the toast root. Existing theme DOM patch disappears. App-owned translations and arbitrary action components remain JSX.

### Alert

Replaces `ui/Alert/Alert.tsx`, one wrapper importer in FeatureCheckBanner and one direct engine importer inside the wrapper. Relies on children, class, fluid layout, theme info/warning/critical, showIcon, and custom icon. No close behavior exists today.

Engine is Kobalte Alert. `/alert` exports Root plus kit Icon, Title, Description, and Action. Keys are `root icon title description action`.

```ts
type AlertProps = KAlert.AlertRootProps & Appearance<AlertPart> & {
	children?: JSX.Element;
	title?: JSX.Element;
	description?: JSX.Element;
	icon?: JSX.Element;
	showIcon?: boolean;
	action?: JSX.Element;
	tone?: Tone;
	fluid?: boolean;
};
// alertStyles: Styles<AlertPart, { tone?: Tone; fluid?: boolean }>
```

Description falls back to children. Avoid paragraph wrappers around arbitrary JSX. Default neutral has no decorative icon; status variants may supply a kit icon when showIcon is true. Proposed radius.sm, 12px padding, 8px gap, 13px text, status accent and token surface. Alert retains engine live-announcement semantics for new messages; static explanatory settings text uses Text instead. Codemod theme critical becomes tone danger, others map directly. Preserve fluid/class/icon/children. No unsolicited dismiss affordance is added.

### Sheet

Replaces `UE/variants/dock/Sheet.tsx`, one importer, plus related dialog compositions in `UE/shell/export-styles/sheet.tsx` and `components/Animation/PhoneSteps.tsx`. Dock source relies on nonmodal in-layout portal, external bar interactions excluded from dismissal, trigger focus return, retained content during exit, panel switching, first-focus override, and drag-to-close on a handle. It limits its height to 40% of layout. Handle tap closes. Pointer cancellation needs a snap-back, not a dismissal.

Engine is Kobalte Dialog. `/sheet` exports Root, Trigger, Portal, Overlay, Content, Title, Description, CloseButton, plus kit Handle, Header, Body, Footer. Keys are `overlay content title description closeButton handle header body footer trigger`. Root/Portal are structural. Style export is `sheetStyles`.

```ts
type SheetProps = Omit<KDialog.DialogRootProps, "children"> &
	Appearance<SheetPart> & {
	children?: JSX.Element;
	title?: JSX.Element;
	description?: JSX.Element;
	footer?: JSX.Element;
	side?: "bottom" | "left" | "right";
	mount?: HTMLElement;
	draggable?: boolean;
	showCloseButton?: boolean;
	closeLabel?: string;
	motion?: "auto" | "none";
	contentProps?: Pick<KDialog.DialogContentProps,
		"onOpenAutoFocus" | "onCloseAutoFocus" | "onPointerDownOutside" |
		"onFocusOutside" | "onInteractOutside" | "onEscapeKeyDown">;
};
// sheetStyles: Styles<SheetPart, { side?: "bottom" | "left" | "right" }>
```

`contentProps` is a narrowly typed behavior-event group, not a generic slots API. Parts handle other structures. Ready defaults modal=true, bottom, draggable=false. Drag is supported for bottom only; enabling it on side sheets is a type error in the final discriminated props union. Handle is a named button with a 40px hit area, supports Enter/Space close, pointer capture, interruption, and cancellation. Distance/velocity thresholds stay implementation details. Portal mount preserves inherited theme through an explicit theme boundary when needed.

Use dialog surface and shadow, radius.xl on exposed corners, scrim only when modal, safe-area padding, app class for max-height. Pointer open/close uses 200ms strong ease-out. No spring dependency. Ready Sheet does not own dock bar exclusions or app trigger lookup.

Codemod moves dock Dialog parts to sheet parts, retains mount, event handlers, shown-panel retention, focus return policy, and 40% cap in the adapter. Extract only the generic handle gesture. The app continues deciding which panel is open. Modal export and animation sheets can use the ready form. Do not convert Rail into a modal sheet on desktop.

### Accordion

Replaces the hand-built disclosure in `UE/variants/sidebar/Accordion.tsx`, one importer, and repeated disclosure/panel controls in Rail.tsx. Source needs controlled one-open-or-none state, icon/title/value summary/chevron, labelled content, inert closed content, header arrow-key navigation, Escape from a section, optional measured fill height, and retained mounted children. Rail's separate navigation rail and adjacent persistent panel remain app composition, not accordion DOM forced into a different visual model.

Engine is Kobalte Accordion. `/accordion` exports Root, Item, Header, Trigger, Content, plus kit Icon, Title, Summary, Chevron. Keys are `root item header trigger content icon title summary chevron`.

```ts
type AccordionEntry = {
	value: string;
	title: JSX.Element;
	icon?: JSX.Element;
	summary?: JSX.Element;
	content: JSX.Element;
	disabled?: boolean;
};
type AccordionProps = Appearance<AccordionPart> & {
	items: readonly AccordionEntry[];
	value?: string | null;
	defaultValue?: string | null;
	onChange?: (value: string | null) => void;
	collapsible?: boolean;
	keepMounted?: boolean;
	motion?: "auto" | "none";
	"aria-label"?: string;
};
// accordionStyles: Styles<AccordionPart, { density?: "compact" | "comfortable" }>
```

Ready enforces multiple=false and defaults collapsible=true. Adapter maps scalar/null to engine arrays. Parts retain multiple support. `createAccordionItems(accessor)` supplies reactive item metadata only; content stays JSX. Header orders icon, title, current-value summary, right chevron. Use island fill, radius.card, 12px inner spacing, 13px headings and muted 12px summary. Minimum header targets follow 28/40px rule. Pointer content expansion is 200ms; keyboard expansion is instant. Mounted closed content must be inert and inaccessible even during exit. Height measuring never runs during SSR.

Codemod moves openSection logic into controlled value/onChange and maps panel definitions to entries. App measured fill height applies through classes to Content. Section Escape stays in the app with child-layer checks; Accordion does not install a global Escape listener. Rail can reuse styles and header parts where semantics fit, while retaining its navigation buttons and focus-return map.

## K8 composites

### Combobox

Replaces the single direct combobox in `components/Terminal/Tabs/TabName/TabName.tsx`. Source needs free-text filename input, independently selected extension suggestion, custom extension filter, option identity by extension, option text/name, icon/highlight content, focus-triggered popup, disallowEmptySelection, placement/gutter/shift, refs, and width measurement. Filename replacement and caret placement remain app logic.

Engine is Kobalte Combobox. `/combobox` exports all engine parts, including Root, Control, Input, Trigger, Icon, Portal, Content, Arrow, Listbox, Item, ItemLabel, ItemDescription, ItemIndicator, Section, HiddenSelect, Label, Description, ErrorMessage. Keys are `root control input trigger icon content arrow listbox item itemLabel itemDescription itemIndicator section hiddenSelect label description errorMessage`. Portal has no rendered key.

```ts
type ComboboxProps<T> = Omit<KCombobox.ComboboxRootProps<T>,
	"children" | "itemComponent" | "sectionComponent"> & FieldContent &
	Appearance<ComboboxPart> & {
	inputRef?: (element: HTMLInputElement) => void;
	inputId?: string;
	inputValue?: string;
	onInputChange?: (value: string) => void;
	renderOption?: (option: T) => JSX.Element;
	emptyContent?: JSX.Element;
	mount?: HTMLElement;
	size?: "sm" | "md";
};
// comboboxStyles: Styles<ComboboxPart, { size?: "sm" | "md" }>
```

Final emitted type preserves the engine single/multiple discriminated union rather than applying a flattening Omit to the union. `inputValue`/onInputChange stay independent of value/onChange. Kobalte 0.13.14 exposes onInputChange on Root and value on Input, but no inputValue root prop. The ready adapter forwards inputValue to Input.value and synchronizes through the public context setInputValue only if needed by the engine. It must prove controlled text changes update filtering and active descendants. No competing text state is added. `createComboboxOptions` follows createSelectOptions, accepting reactive options plus valueKey/labelKey/disabledKey mappings, returning options(), props(), and controlled() without iterable casts. String search labels remain required when rich JSX labels are used.

Ready input defaults 36px, phone 40px, radius.sm, input surface/text. List uses menu tokens, shadow.menu, radius.md, 4px padding, 28/40px option targets. No list animation while typing. Highlight uses selection tokens and an independent focus indication. Portal mount can stay inside a parent dialog so options remain accessible.

Codemod TabName uses parts because its hidden text measurement and custom inline control need a custom structure. Preserve value/onChange separately from inputValue/onInputChange, put the accessible label on Input, preserve extension filtering/caret logic, and remove timeout-based positioner transition mutation. Keep app highlight rendering SSR-safe.

PR #57 reuse follows K3/K4 section 10. Port the 211-line CSS to K5 tokens and reuse story cases. Rewrite the component. Do not copy private createControllableBooleanSignal imports, hidden focusable input, timeout close/refocus races, prop-spread precedence, or old 0.12 namespace types. Highlight utility is optional and needs SSR guards. Do not rebase its lockfile or config changes. Closing #57 is a maintainer action after replacement lands, outside this design task.

### CommandMenu

Replaces `UE/command-menu/CommandMenu.tsx`, one importer, with its open button used in four files. Source behavior includes controlled open, app global Cmd/Ctrl+K binding, grouped and section-labelled results, query filtering, mouse/keyboard highlighting, cyclic navigation, preview before commit, Enter/click commit, current-value check, shortcut notes, empty result text, conditional commands, and focus-return suppression when an action moves focus. Closing cancels preview synchronously before the action runs.

Engine is Combobox inside Dialog, with its list rendered inline in the dialog. No nested popup portal or second modal. `/command-menu` exports Root, Trigger, Portal, Overlay, Content, Title, Search, Listbox, Item, Group, GroupLabel, ItemLabel, ItemDescription, ItemIndicator, plus kit Leading, Shortcut, Empty. Keys are `trigger overlay content title search listbox item group groupLabel itemLabel itemDescription itemIndicator leading shortcut empty`.

```ts
type CommandItem = {
	id: string;
	textValue: string;
	label: JSX.Element;
	description?: JSX.Element;
	leading?: JSX.Element;
	shortcut?: JSX.Element;
	group?: string;
	section?: string;
	disabled?: boolean;
	current?: boolean;
};
type CommandMenuProps<T extends CommandItem> = Appearance<CommandMenuPart> & {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	items: readonly T[];
	title: JSX.Element;
	placeholder?: string;
	query?: string;
	onQueryChange?: (query: string) => void;
	filter?: (items: readonly T[], query: string) => readonly T[];
	onHighlightChange?: (item: T | undefined) => void;
	onSelect: (item: T) => void;
	onBeforeClose?: () => void;
	onCloseAutoFocus?: KDialog.DialogContentProps["onCloseAutoFocus"];
	emptyContent?: JSX.Element;
	mount?: HTMLElement;
};
// commandMenuStyles: Styles<CommandMenuPart, {}>
```

Default filtering uses textValue, group, section, and description only when description is plain text. JSX is never coerced into a search string. `createCommandItems` validates unique IDs and derives groups/search metadata at the data boundary. No editor actions or router imports enter the kit. Engine highlighted-key changes feed onHighlightChange; pointer movement and keyboard navigation share it. The 0.13.14 declarations expose useComboboxContext().listState(), whose selection manager owns the focused key. A reactive adapter observes that key and resolves it to the item. Verify callback order with actual keyboard and pointer input; do not emulate navigation with a second active-index signal.

Selection sequence is onBeforeClose, onOpenChange(false), then onSelect exactly once. Cancellation runs onBeforeClose before close and reports undefined highlight. Filtering away an active item also reports undefined before a new highlight. Disposal clears highlight. Empty queries highlight the first eligible action without starting an app preview unless the app requests it. The app owns preview rollback/commit and decides whether current items execute. Global shortcut registration stays in CodeImage.

Visual target is the measured command panel, radius.command=22px, 8px padding, dialog surface, roughly 640px wide and 300px high, bounded by viewport and safe area. Search is 36/40px with 13px text, group headings muted 12px, rows 36/40px, notes 11px minimum. No open, close, highlight, or query animation. Codemod keeps command building/filter ranking in the app, maps leading/check/note to content props, uses onHighlightChange for preview, onBeforeClose for rollback, onSelect for actions, and onCloseAutoFocus for existing focus policy.

### OptionCard

Replaces three direct RadioGroup importers, `UE/controls/WindowStyleTiles.tsx`, `UE/shell/export-styles/choice-fields.tsx`, and ChoiceCards in `UE/shell/sections.tsx`. Source relies on controlled string choice, localized accessible group name, preview art, compact tiles/cards, optional hint/default tag, per-option icon, and selection ring. RadioBlock in `packages/ui` has one importer in the old Toolbar SettingsDialog and also maps here where it represents a card.

Engine is Kobalte RadioGroup. `/option-card` exports Root, Label, Description, ErrorMessage, Item, ItemInput, ItemControl, ItemIndicator, ItemLabel, ItemDescription, plus Preview and Badge. Keys are `root label description errorMessage item itemInput itemControl itemIndicator itemLabel itemDescription preview badge`.

```ts
type OptionCardEntry<T extends string> = {
	value: T;
	label: JSX.Element;
	description?: JSX.Element;
	preview?: JSX.Element;
	badge?: JSX.Element;
	disabled?: boolean;
};
type OptionCardProps<T extends string> = FieldContent & Appearance<OptionCardPart> & {
	items: readonly OptionCardEntry<T>[];
	value?: T;
	defaultValue?: T;
	onChange?: (value: T) => void;
	name?: string;
	disabled?: boolean;
	required?: boolean;
	orientation?: "horizontal" | "vertical";
	variant?: "card" | "tile";
	"aria-label"?: string;
	"aria-labelledby"?: string;
};
// optionCardStyles: Styles<OptionCardPart, { variant?: "card" | "tile" }>
```

Root ready OptionCard represents the group; Entry represents one card. This avoids exporting a misleading standalone radio without group state. `createOptionCardItems` preserves the value union and reactive entries; it does not own selection. Parts expose validationState and input refs for advanced forms.

Use input surface, radius.md=12px, 12px padding and 8px gaps. Appearance screenshot cards are approximately 138px tall with preview above title/hint; height remains content-driven. Tile variant is compact and can omit description. Selected border is a 2px focus/accent role, not color alone. Separate focus-visible ring remains visible. Preview is aria-hidden by default; accessible meaning belongs in label/description. Entire label is clickable and has 40px phone target. No interactive descendants in a radio label. Enter/Space and arrows use engine behavior. App-specific window/theme illustrations remain JSX in CodeImage.

Codemod maps option.key/id to value, name to label, hint to description, art/preview to preview, and Default tag to badge. Compact FormatChoice/ScaleChoice can remain RadioList/SegmentedControl when there is no preview; do not force every radio into a large card. RadioBlock div clicks become real radio inputs. ThemeCard and WindowStyleTiles remain domain wrappers.

### SettingsRow and SettingsGroup

Replaces SettingRow, SettingGroup, and SettingSection data/rendering in `UE/shell/sections.tsx`, two importers. Data relies on id, title, fresh marker, experimental marker, picture, description accessor, details JSX accessor, control accessor, wide/small layout flags; groups have titles/rows and sections have navigation metadata, intro, action, and groups accessor. ControlRow's three importers stay domain-bound to editor model kinds.

No Kobalte primitive for settings layout. Field semantics come from the controls inside it. `/settings` exports Row, Group, Label, Description, Details, Control, Picture, Marker, GroupTitle, GroupDescription, and GroupContent. Ready root exports SettingsRow and SettingsGroup. Row keys are `root label description details control picture marker`. Group keys are `root title description content`. Styles are `settingsRowStyles` and `settingsGroupStyles`.

```ts
type SettingsRowProps = Appearance<SettingsRowPart> & {
	id?: string;
	label: JSX.Element;
	description?: JSX.Element;
	details?: JSX.Element;
	picture?: JSX.Element;
	marker?: JSX.Element;
	children: JSX.Element;
	controlId?: string;
	layout?: "inline" | "wide";
	compactControl?: boolean;
};
type SettingsGroupProps = Appearance<SettingsGroupPart> & {
	title?: JSX.Element;
	description?: JSX.Element;
	children: JSX.Element;
	id?: string;
};
// settingsRowStyles: Styles<SettingsRowPart,
//   { layout?: "inline" | "wide"; compactControl?: boolean }>
// settingsGroupStyles: Styles<SettingsGroupPart, {}>
```

`createSettingsRowProps(accessor)` returns stable label/description IDs and control aria-labelledby/aria-describedby props. It composes existing control descriptions rather than replacing them. Label becomes a real label only when controlId points at one labelable input. Composite controls receive aria-labelledby instead. Do not wrap groups of controls in a single label. No SettingSection component is added; settings navigation, search index, deep links, experiments filtering, and section data remain app-owned.

Rows are two-column label/control layouts on desktop. Description and details sit under the label. Wide controls occupy a second full-width row. Phone rows stack unless compactControl=true, which keeps small toggles inline. The app chooses its settings navigation breakpoint. Groups are rounded islands with panel fill, radius.card, 16px padding and 12px row gaps. Titles sit above islands, matching the appearance screenshot. Labels are 13/14px, descriptions 12/13px. No row entry animation.

Codemod preserves the app's searchable data model and translates it at render time. title becomes label, description()/details()/control() become JSX props/children, picture() becomes picture, wide becomes layout=wide, small becomes compactControl, and fresh/experimental become marker JSX with Badge. SettingSection continues to compose headings, groups, and the surrounding two-column settings dialog navigation. No CodeImage HighlightId or SectionId reaches kit types.

## Verification and review boundaries

These are implementation acceptance checks, not claims that proposed components already pass. Each slice must render from the packed package in a plain Solid consumer and SSR, expose its declared part table/classes/styles, and preserve rich JSX content. Field checks exercise form submission, labels, disabled/readOnly, keyboard input, and controlled updates. Overlay checks exercise nested Escape, focus return, portal mounting inside modal dialogs, and reduced motion. Composite checks exercise empty results, disabled entries, filtering while highlighted, preview cancellation before actions, and duplicate IDs.

Screenshot comparisons use both themes and a 390px phone width. Review small text contrast, focus against selected cards, 28/40px hit areas, wrapping translated labels, and settings column collapse. Spinner and Skeleton need static reduced-motion snapshots. RangeField's three adapters must preserve fractional numeric values and avoid duplicate commits. Toast checks include multiple controllers, no pre-host crash, queue cleanup, action focus, and no SSR state leakage. These checks target consumer behavior, not internal signal names.

## Proposed PR split

Sequence work into verifiable units shaped this split. Each PR owns parts, ready API, styles, API snapshot, and behavior checks for its components. Stories and generated files do not count toward the approximate 800-line review budget. Estimates below are planning limits, not measured diffs. Split further if implementation exceeds the budget.

| Slice | Scope | Dependency | Review budget |
| --- | --- | --- | --- |
| K6a | Stack and Text | K5 | 350-550 lines |
| K6b | Kbd, Badge, Spinner, Skeleton | K5 | 500-750 lines |
| K6c | Switch and shared field helper wiring | K5 | 350-550 lines |
| K6d | Slider and Progress | K6c | 550-750 lines |
| K7a | Alert and Toast parts | K5 | 400-650 lines |
| K7b | Toast ready components and scoped controller | K7a | 500-750 lines |
| K7c | Sheet parts and ready composition | K3, K5 | 450-650 lines |
| K7d | Sheet handle gesture and cancellation checks | K7c | 250-450 lines |
| K7e | Accordion | K5 | 450-650 lines |
| K8a | Combobox parts and option helper | K6c | 500-750 lines |
| K8b | Combobox ready API and #57 story/CSS port | K8a | 350-600 lines |
| K8c | OptionCard | K6b, K4 | 450-700 lines |
| K8d | SettingsRow and SettingsGroup | K6a, K6b | 300-500 lines |
| K8e | CommandMenu parts and engine highlight adapter | K8a, K3 | 450-650 lines |
| K8f | CommandMenu ready API and lifecycle checks | K8e | 400-650 lines |

CodeImage caller migration remains C1. Do not mix its domain code into these library PRs. A slice can include a temporary consumer fixture proving a specific mapping, without committing to CodeImage in this checkout.

Maintainer calls are naming the group-level ready component OptionCard versus OptionCardGroup, adopting plural SettingsRow/SettingsGroup, and accepting an explicit scoped toast controller instead of a globally initialized toast object. Recommended defaults are the names and controller above. Product scope follows roadmap decision 1, with previews, settings navigation, command construction, and editor state remaining in CodeImage. Stack and Text are included as requested; Box is excluded.
