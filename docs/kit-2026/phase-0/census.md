# CodeImage component census

Phase 0 baseline for `@codeui/kit` 2026. It records which UI primitives CodeImage uses, where each comes from, and whether the kit covers it. Nothing in CodeImage was changed.

- **Ref.** `origin/main` at `8fbbf85b` (2026-11-16 13:07 +0100), read through `git show`, `git grep`, `git ls-tree` and `git cat-file` only.
- **Lever.** `node docs/kit-2026/phase-0/tools/census.mjs [--repo <path>] [--ref <ref>] [--kit <kit index.tsx>] > census.json`. It scans 941 `.ts`/`.tsx`/`.mts` files under `apps/` and `packages/`. It records every static `import`/`export ... from` and side-effect import, per symbol, for the UI libraries plus app-local component modules. It is deterministic: a second run was byte-identical (`cmp`, measured).
- **Labels.** *measured* means a command output, `census.json` included. *read* means I read the cited line. *inferred* means a judgment from reading.
- Paths without a prefix are relative to `apps/codeimage/src/`. `UE/` means `apps/codeimage/src/pages/UnifiedEditor/`. `kit/` means `packages/kit/src/` in this repo.

## Import totals

| Library | Importing files at `8fbbf85b` | Of which in `UE/` | Audit value | Check |
| --- | :-: | :-: | --- | --- |
| `@codeimage/ui` | 154 | 43 | 147 (UI-02, at `255df885`) | measured. `git grep -l` gives 158. The 4 extra are a `vi.mock` in two tests, a commented import (`components/Toolbar/GenerateLinkButton.tsx:6`) and a plugin name (`packages/ui/vite.config.ts:39`). The same grep at `255df885` gives the audit's 147 |
| `@codeui/kit` | 82 | 38 | 70 (63) | measured. Matches `git grep -l` exactly. The grep at `255df885` gives 70, so the audit was right and the app grew by 12 kit importers in 224 commits |
| `@kobalte/core` direct | 20 | 15 | 17 | measured |
| `solid-headless` | 7 | 0 | 7 (8) | measured. 6 in `packages/ui`, plus `core/helpers/create-ref.ts` |
| `solid-toast` | 2 | 0 | n/a | measured. Both in `packages/ui/.../Snackbar` |
| `@floating-ui/dom` | 2 | 1 | n/a | measured. `UE/controls/ShortcutHelp.tsx:13` and `packages/ui/src/lib/hooks/useFloating.tsx` |

The app resolves a single Kobalte, `@kobalte/core@0.13.11` (`pnpm-lock.yaml:3435`, measured). The app declares `^0.13.11` directly (`apps/codeimage/package.json:77`) and the kit declares `^0.13.6` (`kit/../package.json:72`). So the kit and the app's direct imports already share one Kobalte at runtime.

## Component table

The status column uses these values. *in kit* means CodeImage uses the kit component. *forked* means a local copy or wrapper reimplements or patches around a kit component. *direct Kobalte* means CodeImage composes Kobalte parts itself where the kit has, or could have, the component. *missing* means the kit has nothing for it.

| Component | Today's source | Importing files | Status | Class | Evidence |
| --- | --- | :-: | --- | --- | --- |
| Button | kit `Button` (+`buttonStyles` 3) | 43 | in kit | generic | measured. `packages/ui` `Button` (built on `solid-headless` types, `packages/ui/src/lib/primitives/Button/Button.tsx:3`) has 0 importers, so it is dead code (measured). Gap: the kit button does not hand its element to `onClick`, worked around in `UE/variants/dock/index.tsx:323-326` (read) |
| IconButton | kit `IconButton` | 20 | in kit | generic | measured. `packages/ui` `IconButton` has 0 importers |
| TextField | kit `TextField` | 14 | in kit, with a gap | generic | measured. The kit spreads extra props (`aria-label`) on the root, not the input (`kit/components/TextField/TextField.tsx:50` vs `:55`, read). Two callers set `aria-label` on the input by hand (`UE/shell/SettingsDialog.tsx:187`, `UE/theme-styles/ThemePicker.tsx:89`, read). `packages/ui` `TextField` has 0 importers. Its `textFieldStyles` still style 3 legacy picker `.css.ts` files |
| TextArea | kit `TextArea` | 1 | in kit | generic | measured. `UE/local-ai/LocalAi.tsx` |
| NumberField | kit `NumberField` | 1 | in kit | generic | measured. `UE/controls/ControlRow.tsx` |
| Checkbox | kit `Checkbox` | 2 | in kit | generic | measured |
| Select | kit `Select` + `createSelectOptions` | 5 | in kit, with gaps | generic | measured. `@ts-expect-error` because "the kit's Select types reject the props its own helper returns" (`UE/controls/fields.tsx:80`, read). No class hook for the list popover, so the app finds `#<id>-listbox` and adds a class to its parent in `onOpenChange` (`fields.tsx:97-103`, read). The app depends on the kit's internal id convention (`UE/controls/ControlRow.tsx:148`, read). DESIGN.md bans it inside modal dialogs because its portaled list is `aria-hidden` there (`DESIGN.md:94`, `UE/shell/sections.tsx:209-213`, read) |
| Listbox, VirtualizedListbox | kit | 4, 1 | in kit, with gaps | generic | measured. `@ts-expect-error Fix @codeui/kit types` on `class` (`UE/localized/FontSystemPicker.tsx:108`) and on `onChange` iterable types (`components/PropertyEditor/controls/FontPicker/FontPickerListbox.tsx:42`), read |
| Dropdown menu | kit `DropdownMenu*` (9 parts) | 8 | in kit | generic | measured. `packages/ui` `DropdownMenu`/`DropdownItem`/`PopoverPanel` (on `solid-headless` `Menu`) have 0 importers. Export styles its menu "doubled, to win over the kit's own menu surface" (`UE/shell/export.css.ts:23`, read) |
| Dialog | kit `Dialog` 6; `@kobalte/core/dialog` 10 | 16 | in kit, mostly bypassed | generic | measured. The kit `Dialog` takes `title?: string` only (`kit/components/Dialog/Dialog.tsx:10`, `:47`, read), so `UE/shell/SettingsDialog.tsx:241` and `components/WhatsNew/Showcase.tsx:161` render their own `KDialog.Title` inside it. `UE/shell/ExportControl.tsx:2-3,81-95` builds the dialog from Kobalte and reuses the kit's `DialogPanelContent`/`DialogPanelFooter` (read). No focus return without a trigger (`UE/shell/settings-state.ts:51`). Fixed width steps are overridden by `globalStyle('div:has(> ...)')` (`UE/shell/settings.css.ts:51-56`). Its sheet only fades (`components/WhatsNew/whats-new.css.ts:275`), all read |
| Popover | kit `Popover*` 2; `@kobalte/core/popover` 4 | 6 | split: in kit + direct Kobalte | generic | measured. Kit in `components/PropertyEditor/SidebarPopover/SidebarPopover.tsx`, `components/Animation/EasingField.tsx`. Kobalte in `components/WhatsNew/NewDot.tsx:4`, `UE/shell/export-styles/panel.tsx:3`, `UE/shell/export-styles/video.tsx:4`, `UE/variants/dock/index.tsx:5`. The Kobalte users pass `Popover.Portal mount=` (`dock/index.tsx:159`) and render `Popover.Title` (`panel.tsx:110`), which the kit wrapper does not expose (inferred from the kit's three-part API) |
| Anchored non-modal panel | `@kobalte/core/dialog` `modal={false}` + `@floating-ui/dom` | 2 | direct Kobalte | generic | read. `UE/controls/ShortcutHelp.tsx:117,129` positions a dialog with `computePosition`. `UE/controls/ControlOverlay.tsx:174` opens a non-modal dialog. A popover-with-dialog-semantics primitive would cover both (inferred) |
| Sheet (bottom drawer) | `@kobalte/core/dialog` | 1 (+`UE/shell/export-styles/sheet.tsx`, `components/Animation/PhoneSteps.tsx`) | direct Kobalte | generic | read. `UE/variants/dock/Sheet.tsx:3,135` |
| Tooltip | kit `Tooltip` | 5 | in kit | generic | measured |
| Segmented control | kit `SegmentedControl`, only through app `ui/SegmentedField` | 1 (wrapper has 10 importers) | forked (wrapper) | generic | measured. The wrapper is marked `@deprecated This is just a wrapper` with `TODO: port SegmentedControl with items support` (`ui/SegmentedField/SegmentedField.tsx:6-8`, read). It adds an `items` array API and an `onEscape` (`:36-53`). Callers fix its height (`UE/controls/controls.css.ts:72-77`, `UE/theme-styles/picker.css.ts:34-35`), its width (`UE/shell/settings.css.ts:519`, `UE/variants/dock/dock.css.ts:86`) and its Escape handling (`UE/variants/dock/context.ts:46-51`), all read. `packages/ui` has its own `SegmentedField` with 0 importers |
| Radio group | kit `RadioList` 2; `@kobalte/core/radio-group` 4; `@codeimage/ui` `RadioBlock` 1 | 7 | split | generic | measured. `RadioListItem` forwards only `value` (`kit/components/RadioList/RadioList.tsx:44`, read), so `UE/shell/export-animation-dialog.tsx:37-38` drops to Kobalte parts to disable formats. `RadioBlock` is the inaccessible div from UI-07, used only in `components/Toolbar/SettingsDialog.tsx:69,92,119` (read) |
| Option card (radio card with preview) | `@kobalte/core/radio-group` | 3 | direct Kobalte | generic | read. `UE/controls/WindowStyleTiles.tsx:6`, `UE/shell/export-styles/choice-fields.tsx:4`, `UE/shell/sections.tsx:12`. DESIGN.md asks for cards when a choice has a preview (`DESIGN.md:93`) |
| Switch | `@kobalte/core/switch` | 1 | missing | generic | read. "The kit has no switch: Kobalte's, drawn with the app's tokens" (`UE/controls/controls.css.ts:17`). Used by `UE/controls/fields.tsx:4,26`. The dashboard hand-rolls `role="switch"` on a `button` (`components/Toolbar/SettingsDialog.tsx:155`). `packages/ui` `Toggle` (solid-headless) has 0 importers |
| Slider | `@codeimage/ui` `RangeField` (native `input type=range`) | 3 | missing | generic | measured + read. `UE/controls/ControlRow.tsx:155`, `UE/shell/export-styles/choice-fields.tsx:127`, `UE/shell/sections.tsx:840`. The Animate timeline hand-rolls `role="slider"` (`components/Animation/StripTimeline.tsx:78,265`), which is domain |
| Toast | `@codeimage/ui` `toast`/`SnackbarHost` (wraps `solid-toast`) | 13 + 1 | missing | generic | measured. `packages/ui/src/lib/primitives/Snackbar/SnackbarHost.tsx:2-3`, `patch-solid-toast.ts:3-4` (read). Roadmap step 18 moves it to Kobalte Toast |
| Progress | `@kobalte/core/progress` | 1 | missing | generic | read. `UE/shell/export-animation-dialog.tsx:14` |
| Alert | `@kobalte/core/alert` in app `ui/Alert` | 1 (wrapper 1) | missing | generic | read. `ui/Alert/Alert.tsx:1-3` |
| Combobox | `@kobalte/core` `Combobox` + `@kobalte/vanilla-extract` | 1 | missing | generic | read. `components/Terminal/Tabs/TabName/TabName.tsx:4`, `TabName.css.ts` |
| Command menu | hand-rolled combobox + listbox inside `@kobalte/core/dialog` | 1 (button 4) | missing | generic | read. `UE/command-menu/CommandMenu.tsx:10,277-279,308-332` sets `role="combobox"`, `listbox`, `group`, `option` and `aria-selected` itself |
| Accordion / disclosure | hand-rolled | 1 | missing | generic | read. `UE/variants/sidebar/Accordion.tsx:91-92,111` (441 lines, only kit `Button`). `UE/variants/sidebar/Rail.tsx:348-349,394` repeats the pattern |
| Kbd | inline `<kbd>` with 5 local styles | 4 files, 6 sites | missing | generic | read. `UE/controls/ShortcutHelp.tsx:114,164`, `UE/shell/Header.tsx:90`, `UE/shell/SettingsDialog.tsx:197`, `UE/variants/dock/index.tsx:503`, `UE/variants/sidebar/Rail.tsx:374` |
| Settings row / group / section | app `UE/shell/sections.tsx` (`SettingRow`, `SettingGroup`, `SettingSection`) | 2 | missing | generic | measured + read. Label, hint and control per row. `UE/controls/ControlRow.tsx` (3) is the same shape bound to the editor model's control kinds, so it is domain (inferred) |
| Badge / chip | `@codeimage/ui` `Badge` 2; app `ui/ExperimentalChip` 1 | 3 | missing | generic | measured. Both `Badge` users are the two `UserBadge` copies |
| Spinner | `@codeimage/ui` `LoadingCircle` 6, `Loading` 1 | 7 | missing | generic | measured |
| Skeleton | app `ui/Skeleton` (`SkeletonLine` 5, `SkeletonDivider` 3) | 8 | missing | generic | measured |
| Confirm dialog | app `ui/ConfirmDialog` on kit `Dialog` | 2 (+`RenameContentDialog` 3) | in kit (composition) | generic | measured + read. `ui/ConfirmDialog/ConfirmDialog.tsx` |
| Link | kit `Link` 3; `@codeimage/ui` `Link` 5 | 8 | split | generic | measured. Both live. `@codeimage/ui` `Link` is `Text as="a"` (`packages/ui/src/lib/primitives/Link/Link.tsx:21-22`, read) |
| Pagination | kit `Pagination` | 1 | in kit | generic | measured. Dashboard only |
| Icons | kit `icons` 15; `@codeimage/ui` `SvgIcon` 24, `RemoteSvgIcon` 2; local sets `UE/shell/icons` 13, `UE/variants/sidebar/icons` 2, `UE/variants/dock/icons` 2, `components/Icons/*` | many | split | generic (`SvgIcon`), domain (icon sets) | measured. The kit's own `SvgIcon` has 0 importers |
| Layout and text | `@codeimage/ui` `Box` 38, `Text` 19, `HStack` 10, `VStack` 7, `Group` 1 | 60+ | missing | generic, token-bound | measured |
| Field shell | `@codeimage/ui` `FlexField` 7, `FieldLabel` 3, `FieldLabelHint` 1 | 7 | overlap | generic | measured. The kit's field label helpers (`createFieldLabelProps`, `fieldLabelStyles`) have 0 importers |
| Transitions | `@codeimage/ui` `FadeInOutTransition` (solid-headless) | 3 | missing | generic | measured |
| Tokens | `@codeimage/ui` `themeVars` 69, `backgroundColorVar` 19, `withThemeMode` 17, ...; kit `themeTokens` 7, `responsiveStyle` 6, `themeVars` 3 | 80+ | two systems | n/a | measured. DESIGN.md requires `@codeimage/ui` `themeVars` for app styles (`DESIGN.md:139`) |
| Theme picker (`ThemePicker`, `ThemeSwatch`, `AaList`, `OrbList`, `WindowList`) | app `UE/theme-styles`, `UE/ThemeSwatch.tsx` | 6, 7 | n/a | domain | measured |
| Window, frame and canvas (`WindowStyleTiles`, `WindowPreview`, `CanvasToolbar`, `Stage`, `FitFrame`, `PreviewFrame`, terminals, `Watermark`) | app | 1 to 6 each | n/a | domain | measured |
| Export (`ExportControl`, `export-styles/*`, `export-animation-dialog`, `choice-fields`) | app on kit `Button` + Kobalte | 1 to 6 each | n/a | domain | measured |
| What's new (`Showcase`, `Nudge`, `NewDot`, `WhatsNewHost`) | app on kit `Dialog`/`Button` + Kobalte `Popover` | `NewDot` 7 | n/a | domain | measured |
| Pickers (`FontPicker`, `FontSystemPicker`, `ImagePicker`, `ColorPicker`, `AspectRatioPicker`, `PresetSwitcher`) | app `UE/localized/` on kit `Listbox`/`TextField` + app `SegmentedField` | 1 to 4 each | n/a | domain | measured |
| Signatures, Local AI, agent tools, header, rail, dock, sidebar panels | app | 1 to 5 each | n/a | domain | measured |

## Findings that change the plan

### 1. Every forced fork traces to six kit API gaps

Each workaround above has a comment that names the kit (read, `git grep -n -iE "the kit|kit's" origin/main -- apps/codeimage/src`). They reduce to six gaps:

1. **Closed composition.** `Dialog` takes a string `title` and owns its portal, overlay and close button. `Popover` hides `Title` and `Portal mount`. CodeImage has 10 direct Kobalte dialog files and 4 direct popover files (measured). Kit 2026 needs part-level exports (`Dialog.Title`, `Dialog.Portal`, a `mount` prop) or the app keeps bypassing it.
2. **Props dropped or mis-targeted.** `RadioListItem` forwards only `value` (`kit/components/RadioList/RadioList.tsx:44`). `TextField` puts `aria-*` on its root (`TextField.tsx:50`). `Button` hides the event target (`UE/variants/dock/index.tsx:323`).
3. **Wrong types.** All 3 `@ts-expect-error` comments in files that import the kit are kit type bugs (`UE/controls/fields.tsx:80`, `UE/localized/FontSystemPicker.tsx:108`, `components/PropertyEditor/controls/FontPicker/FontPickerListbox.tsx:42`, measured by the script's `tsExpectErrorsInKitImporters`). UI-04 said 8 at an older ref and was not rechecked. The script finds 3 today.
4. **No slot classes on portaled parts.** The Select list class is added through `getElementById` (`fields.tsx:97-103`). Styling needs doubled selectors (`UE/shell/export.css.ts:23`) and `:has()` overrides (`UE/shell/settings.css.ts:53`).
5. **Sizing that fights the layout.** `SegmentedControl` is `height: 100%` and fills its parent, so four style files give it a sized parent (cited in the table).
6. **Escape and focus handling.** The segmented control and lists swallow Escape (`UE/variants/dock/context.ts:46-51`). The dialog does not return focus without a trigger (`UE/shell/settings-state.ts:51`).

### 2. The overlap is smaller than the audit says, and most of it is dead code

UI-02 lists seven overlapping components across four libraries. At `8fbbf85b` the `packages/ui` copies of Button, IconButton, TextField, Dropdown, SegmentedField and Toggle have **0 importers** outside `packages/ui` (measured, `census.json` `libraries["@codeimage/ui"].symbols`). Other unused `packages/ui` exports are `PortalHost`, `SnackBar`, `LoadingOverlay`, `FadeInOutWithScaleTransition`, `FloatingPortal` and `useFloating`. Only Link (kit 3, `@codeimage/ui` 5) and Popover (kit 2, Kobalte 4) have two live sources. Toast has one source, `solid-toast`. Phase 1 can delete the dead `packages/ui` primitives before it moves anything (inferred). That also removes 4 of the 7 `solid-headless` importers (`Button.tsx`, `DropdownItem.tsx`, `DropdownMenu.tsx`, `Toggle.tsx`).

### 3. The kit is missing the controls DESIGN.md asks for

DESIGN.md says "Do not hand-build a control that the kit has" (`DESIGN.md:13`) and asks for switches, segmented controls and cards (`:93`). The kit has no Switch, Slider, Toast, Progress, Alert, Combobox, Accordion, Kbd, Badge, Spinner, Skeleton, Sheet, option card, settings row or command menu (read, `kit/index.tsx`). CodeImage fills each with direct Kobalte, `@codeimage/ui`, or hand-rolled ARIA (table). These are the "generic, missing" rows, 15 candidates.

### 4. The kit patch is a no-op, and the kit manifest leaks into CodeImage

`patches/@codeui__kit.patch` adds `"types": "./dist/types/index.d.ts"` to `exports["."]`. The published 0.1.5 already has that key (`npm view @codeui/kit@0.1.5 exports --json`, measured), so the patch changes nothing. This confirms UI-05. The same manifest ships `@vanilla-extract/vite-plugin ^4.0.15` and `example-basic: link:/Users/riccardoperra/...` as runtime dependencies (`npm view @codeui/kit@0.1.5 dependencies`, measured; `packages/kit/package.json:86-87` in this repo, read). The first is how Vite 6.4.1 and its 2 high advisories reach CodeImage (audit PLAT-002). A clean manifest is a Phase 1 deliverable on its own.

### 5. Kit components CodeImage does not use

From `census.json` `kitExportsUnused` (measured): `Tabs`, `TabsHeader`, `TabsList`, `TabsContent`, `ListboxItem`, `SvgIcon`, `DialogPanel`, `TextFieldLabel`, `TextAreaLabel`, `NumberFieldLabel`, the field helpers (`fieldStyles`, `styleFieldMessage`, `createBaseFieldProps`, `createFieldErrorMessageProps`, `fieldErrorStyles`, `fieldLabelStyles`, `createFieldLabelProps`), `textFieldStyles`, `dropdownMenuStyles`, `popoverStyles`, `breakpoints`, `layoutVars`, `mergeClasses`, and the `*Props` types. CodeImage uses 18 kit component families (measured), which matches the audit's "18 components to move".

### 6. A Kobalte bug fix is in flight as a CodeImage patch

Branch `fix/kobalte-scroll-freeze` (`~/.t3/worktrees/codeimage/t3-ce955984-...`, commit `db4c3f61`, 2026-11-16 13:40) adds `patches/@kobalte__utils@0.9.1.patch`. It starts `scrollIntoViewport`'s scroll-parent lookup from `parentElement`, so keyboard traversal no longer freezes the editor (read). The kit depends on `@kobalte/utils ^0.9.1` too, so the kit should take the upstream fix or carry it (inferred).

### 7. `UE/localized/` duplicates older components

`UE/localized/` holds translated copies of `UserBadge`, `GitHubLoginButton`, `ExperimentalFeatureTooltip`, `ColorPicker`, `FontPicker` and `AspectRatioPicker` that still exist under `components/` and `ui/` (measured, `localComponents`). The README calls them adapters that "reuse existing stores, actions, and styles with translated labels" (`UE/README.md:115`, read). These are domain components, but each pair doubles the kit call sites to migrate (inferred).

## UI changes on `origin/main` in the last 64 hours

`git log origin/main --since="64 hours ago"` lists 744 commits, and 112 of them on `--first-parent` (measured at 14:03 CET). Per first-parent merge I counted changed files under `packages/ui`, `ui/`, `components/`, `UE/` and `DESIGN.md`, plus added or removed import lines for kit, Kobalte and `@codeimage/ui` (measured). Grouped by the UI they introduced or changed:

- **New editor shell and controls.** #711 and #737 `feat/ui-prototypes` (30 and 26 files, 79 and 6 import lines) brought the prototype that became `UE/`, with `CommandMenu` and `ControlOverlay` on Kobalte `Dialog` and `ControlRow` on the kit `NumberField`. #740 `refactor/unified-editor-cleanup` touched 100 files. #754 `refactor/remove-classic-editor` touched 47 files and deleted the classic editor. #764 `feat/unified-editor-snippets` touched 27. #783 `refactor/appearance-panels` touched 25 and merged Inspector and Studio into one Sidebar layout (`f11b14d0`).
- **Export UI.** #759 `feat/improve-export-toolbar` (32 files, 13 import lines) added `export-styles/panel.tsx` on Kobalte `Popover`, `choice-fields.tsx` on Kobalte `RadioGroup` and `ExportControl` on Kobalte `Dialog` with kit panel parts. #766 `feat/animate-mp4-export` added `export-animation-dialog.tsx` with Kobalte `Dialog`, `Progress` and the `RadioGroup` drop-down from `RadioList`. #781 `feat/animate-gif-export` extended it.
- **Animate.** #736 `feat/animate-new-ui` (51 files, 12 import lines) added `components/Animation/*` on kit `Button`, `IconButton`, `Select`, `TextField`, `Popover`. #774 and #776 added `PhoneSteps.tsx` on Kobalte `Dialog`. #782 holds the follow-ups (18 files).
- **What's new 2.0.** #739 `feat/whats-new-2-0` (36 files) added `Showcase` on kit `Dialog` with its own `KDialog.Title`, `Nudge`, and `NewDot` on Kobalte `Popover`.
- **Local AI and agent tools.** #767 `feat/agent-tool-integration` (42 files) added `LocalAi.tsx` (kit `TextArea`), `ToolActivity.tsx` and `FormatTabButton.tsx`.
- **Smaller UI.** #760 editor chrome and shortcuts (28 files), #779 grouped command menu rows, #778 colour-mode orbs, #752 and #747 watermark settings, #777 onboarding button layout, #771 palette shortcuts, and the alt-text and social-export commits on 2026-11-14.

No kit or Kobalte version changed in the window. The only manifest change is the `patchedDependencies` entries for `@codeui/kit` and `solid-headless` moving from `package.json` to `pnpm-workspace.yaml` (`git diff 27b185f1 origin/main -- '*package.json' pnpm-workspace.yaml`, measured). New overlays went mostly to direct Kobalte. The window added 12 import lines for `@kobalte/core/dialog` or `/popover` and 3 for the kit `Dialog` or its panel parts, and it removed 2 kit `Popover` imports (same diff over `apps` and `packages`, measured).

## In-flight branches

Read-only, `git -C <wt> log --oneline -5` and `git -C <wt> diff --stat origin/main...HEAD -- packages/ui apps/codeimage/src`, measured.

| Worktree | Branch | Ahead | UI relevance |
| --- | --- | :-: | --- |
| `t3-ce955984-...` | `fix/kobalte-scroll-freeze` | 1 | Adds `patches/@kobalte__utils@0.9.1.patch` (finding 6). No `packages/ui` or app source change |
| `t3-71428a54-...` | `proto/animate-tabs-timeline` | 8 | 45 app files. Adds kit `Button`, `IconButton`, `Tooltip` imports and 6 `@codeimage/ui` `themeVars` imports |
| `t3-ceb23e23-...` | `implement/p5-gutter-menu` | 28 | 58 app files. Adds kit `Tooltip`, `Select`, `TextField`, `buttonStyles` and `toast` imports. 2 uncommitted files |
| `t3-1eaef0d6-...` | `refactor/whats-new-redesign-1` | 0 | 84 uncommitted files, 66 under `prototypes/editor-controls` and 5 under `components/WhatsNew`. Not inspected beyond `git status` |
| `t3-c12e16a3-...` (`align-p3-main`), `t3-e1d99e84-...` (`feat/a6-cli-mp4`), `t3-62f0e984-...` (detached), `t3-83df8401-...` (`feat/p3-node-renderer`, 813 dirty) | renderer and CLI | 38 to 168 | Each changes `packages/ui/src/lib/primitives/Icon/RemoteSvgIcon.tsx` (+15/-31). `align-p3-main` and `feat/a6-cli-mp4` add one `DropdownMenuItem` and one `toast` import |
| `t3-2cfae569-...`, `t3-98d708a2-...` | detached, per-tab export | 9 | 26 app files, no kit, Kobalte or `@codeimage/ui` import change |
| 9 others | | 0 | No commits ahead of `origin/main` |

## Not verified

- The script reads static imports only. It does not see dynamic `import()`, JSX usage counts per file, or CSS-only coupling to kit class names and `data-cui` attributes.
- Whether each dead `packages/ui` primitive is still used inside `packages/ui` or its `dev/` demo. The census counts importers outside the package.
- Runtime behavior of each gap. All gap evidence is from source comments and kit source, not from running the app.
- Uncommitted work in `t3-1eaef0d6-...` and `t3-83df8401-...` beyond file counts.
