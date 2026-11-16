# K5 single token contract

Design proposal for making the CodeImage look the default of `@codeui/kit`, while allowing Solid consumers to replace every theme value with plain CSS. No implementation or git changes are part of this deliverable.

## Evidence and precedence

Read the roadmap One token system section and decision 2. Values below prefer the measured preview semantic custom property for the matching role, then packages/ui, then kit. A role mapping is a design inference, not a measurement. Sources are `../phase-0/tokens.md`, `../phase-0/tokens.json`, kit foundation contract/themes/tokens/sizes, and CodeImage `origin/main` theme files plus `DESIGN.md`. CodeImage source was read only through git show and grep. The preview has no verified source SHA.

The canvas is #0f0f10 rather than source #1d1d1d. The panel is #151516 rather than source #111111. Input light background is #f3f3f3 from the semantic contract. Search controls separately measure #f5f5f5, so an app search override may retain that value. Primary buttons become #0099ff from the measured semantic contract. The measured export button still uses kit #0072f5, evidence of the two systems being merged. This proposal intentionally aligns it to the semantic primary button role. Focus remains #63b3ed dark and #0099ff light.

## Contract

Token paths refer to the proposed exported `tokens` object. The CSS name is stable public API. Repeated literal values remain distinct roles where consumers need independent overrides. The source column labels proposed additions explicitly.

### Surfaces

| Kit token name | CSS custom property name | Dark value | Light value | Source |
| --- | --- | --- | --- | --- |
| `surface.canvas` | `--cui-surface-canvas` | `#0f0f10` | `#f7fafc` | measured preview, semanticTokens.background |
| `surface.toolbar` | `--cui-surface-toolbar` | `#2b2b2b` | `#fff` | measured preview, semanticTokens.bottomBar-backgroundColor |
| `surface.scrim` | `--cui-surface-scrim` | `#000000b3` | `#0006` | measured preview, semanticTokens.dialog-overlayBackgroundColor |
| `surface.dialog` | `--cui-surface-dialog` | `#1d1d1d` | `#fff` | measured preview, semanticTokens.dialog-panelBackgroundColor |
| `surface.inputAccent` | `--cui-surface-input-accent` | `#505050` | `#fff` | measured preview, semanticTokens.input-accentColor |
| `surface.input` | `--cui-surface-input` | `#232323` | `#f3f3f3` | measured preview, semanticTokens.input-backgroundColor |
| `surface.menuHover` | `--cui-surface-menu-hover` | `#333` | `#f7fafc` | measured preview, semanticTokens.listBox-hoverBackgroundColor |
| `surface.menu` | `--cui-surface-menu` | `#282828` | `#fff` | measured preview, semanticTokens.listBox-panelBackground |
| `surface.panel` | `--cui-surface-panel` | `#151516` | `#fff` | measured preview, semanticTokens.panel-background |
| `surface.scrollThumb` | `--cui-surface-scroll-thumb` | `#505050` | `#cbd5e0` | measured preview, semanticTokens.scrollBar-backgroundColor |
| `surface.scrollThumbHover` | `--cui-surface-scroll-thumb-hover` | `#333` | `#a0aec0` | measured preview, semanticTokens.scrollBar-hoverBackgroundColor |
| `surface.secondary` | `--cui-surface-secondary` | `#edf2f7` | `#edf2f7` | measured preview, semanticTokens.secondary |
| `surface.toast` | `--cui-surface-toast` | `#2b2b2b` | `#fff` | measured preview, semanticTokens.snackbar-backgroundColor |

### Text

| Kit token name | CSS custom property name | Dark value | Light value | Source |
| --- | --- | --- | --- | --- |
| `text.default` | `--cui-text-default` | `#ededed` | `#4a5568` | measured preview, semanticTokens.baseText |
| `text.toolbar` | `--cui-text-toolbar` | `#a0a0a0` | `#4a5568` | measured preview, semanticTokens.bottomBar-textColor |
| `action.neutral.text` | `--cui-action-neutral-text` | `#ededed` | `#2d3748` | measured preview, semanticTokens.button-base-textColor |
| `action.danger.text` | `--cui-action-danger-text` | `#fff` | `#fff` | measured preview, semanticTokens.button-danger-textColor |
| `action.brand.text` | `--cui-action-brand-text` | `#fff` | `#fff` | measured preview, semanticTokens.button-primary-textColor |
| `action.brandSoft.text` | `--cui-action-brand-soft-text` | `#09f` | `#09f` | measured preview. The maintainer chose the CodeImage primary over AA contrast for white text |
| `text.muted` | `--cui-text-muted` | `#999` | `#4a5568` | measured preview, semanticTokens.descriptionTextColor |
| `text.dialog` | `--cui-text-dialog` | `#ededed` | `#2d3748` | measured preview, semanticTokens.dialog-panelTextColor |
| `text.dialogTitle` | `--cui-text-dialog-title` | `#ededed` | `#2d3748` | measured preview, semanticTokens.dialog-titleTextColor |
| `text.label` | `--cui-text-label` | `#ededed` | `#2d3748` | measured preview, semanticTokens.input-labelTextColor |
| `text.hint` | `--cui-text-hint` | `#a0a0a0` | `#4a5568` | measured preview, semanticTokens.input-labelTextHintColor |
| `text.input` | `--cui-text-input` | `#ededed` | `#333` | measured preview, semanticTokens.input-textColor |
| `text.selected` | `--cui-text-selected` | `#fff` | `#fff` | K5 implementation, raised to WCAG AA text contrast; design #ededed / #fff |
| `text.menu` | `--cui-text-menu` | `#ededed` | `#2d3748` | measured preview, semanticTokens.listBox-textColor |
| `text.panelMuted` | `--cui-text-panel-muted` | `#ccc` | `#666` | measured preview, semanticTokens.panel-textColorAlt |
| `text.panel` | `--cui-text-panel` | `#fff` | `#000` | measured preview, semanticTokens.panel-textColor |
| `text.toast` | `--cui-text-toast` | `#fff` | `#333` | measured preview, semanticTokens.snackbar-textColor |
| `text.danger` | `--cui-text-danger` | `#fc8181` | `#c53030` | K5 implementation, raised to WCAG AA text contrast; proposed error text role |

### Accent and status colors

| Kit token name | CSS custom property name | Dark value | Light value | Source |
| --- | --- | --- | --- | --- |
| `action.neutral.active` | `--cui-action-neutral-active` | `#505050` | `#a0aec0` | measured preview, semanticTokens.button-base-activeColor |
| `action.neutral.base` | `--cui-action-neutral-base` | `#333` | `#e2e8f0` | measured preview, semanticTokens.button-base-backgroundColor |
| `action.neutral.hover` | `--cui-action-neutral-hover` | `#3e3e3e` | `#cbd5e0` | measured preview, semanticTokens.button-base-hoverColor |
| `action.danger.active` | `--cui-action-danger-active` | `#9b2c2c` | `#9b2c2c` | K5 implementation, raised to WCAG AA text contrast; design #c53030 / #c53030 |
| `action.danger.base` | `--cui-action-danger-base` | `#c53030` | `#c53030` | K5 implementation, raised to WCAG AA text contrast; design #f56565 / #f56565 |
| `action.danger.hover` | `--cui-action-danger-hover` | `#b52b2b` | `#b52b2b` | K5 implementation, raised to WCAG AA text contrast; design #e53e3e / #e53e3e |
| `action.brand.active` | `--cui-action-brand-active` | `#07f` | `#07f` | measured preview. The maintainer chose the CodeImage primary over AA contrast for white text |
| `action.brand.base` | `--cui-action-brand-base` | `#09f` | `#09f` | measured preview. The maintainer chose the CodeImage primary over AA contrast for white text |
| `action.brand.hover` | `--cui-action-brand-hover` | `#08f` | `#08f` | measured preview. The maintainer chose the CodeImage primary over AA contrast for white text |
| `action.brandSoft.base` | `--cui-action-brand-soft-base` | `#0099ff26` | `#0099ff26` | measured preview, semanticTokens.button-primaryAlt-backgroundColor |
| `action.brandSoft.hover` | `--cui-action-brand-soft-hover` | `#007acc26` | `#007acc26` | measured preview, semanticTokens.button-primaryAlt-hoverColor |
| `accent.selection` | `--cui-accent-selection` | `#07f` | `#09f` | measured preview. The maintainer chose the CodeImage primary over AA contrast for white text |
| `accent.focus` | `--cui-accent-focus` | `#63b3ed` | `#09f` | measured preview, semanticTokens.primary |
| `action.brandSoft.active` | `--cui-action-brand-soft-active` | `#007acc26` | `#007acc26` | packages/ui hover value reused, proposed active |
| `action.caution.base` | `--cui-action-caution-base` | `#F08C00` | `#F08C00` | kit caution |
| `action.caution.hover` | `--cui-action-caution-hover` | `#d77d00` | `#d77d00` | kit cautionAccentHover |
| `action.caution.active` | `--cui-action-caution-active` | `#bd6e00` | `#bd6e00` | kit cautionAccentActive |
| `action.success.base` | `--cui-action-success-base` | `#48bb78` | `#48bb78` | packages/ui colors.green.500 |
| `action.success.hover` | `--cui-action-success-hover` | `#38a169` | `#38a169` | packages/ui colors.green.600 |
| `action.success.active` | `--cui-action-success-active` | `#2f855a` | `#2f855a` | packages/ui colors.green.700 |
| `action.caution.text` | `--cui-action-caution-text` | `#000` | `#000` | kit, proposed readable status foreground |
| `action.success.text` | `--cui-action-success-text` | `#000` | `#000` | packages/ui, proposed readable status foreground |

### Shadows

| Kit token name | CSS custom property name | Dark value | Light value | Source |
| --- | --- | --- | --- | --- |
| `shadow.dialog` | `--cui-shadow-dialog` | `0 10px 30px 0 #00000026, inset 0 0 0 1px #232323` | `0 10px 15px -3px #0000001a, 0 4px 6px -2px #0000000d` | measured preview, semanticTokens.dialog-panelShadow |
| `shadow.menu` | `--cui-shadow-menu` | `0 1px #0000000d, 0 4px 10px #0000004d` | `0 1px #0000000d, 0 4px 10px #0000001a` | kit dropdownBoxShadow; no matched preview measurement |
| `shadow.none` | `--cui-shadow-none` | `none` | `none` | kit and packages/ui boxShadow |
| `shadow.sm` | `--cui-shadow-sm` | `0 1px 3px 0 #0000001a, 0 1px 2px 0 #0000000f` | `0 1px 3px 0 #0000001a, 0 1px 2px 0 #0000000f` | kit and packages/ui boxShadow |
| `shadow.md` | `--cui-shadow-md` | `0 4px 6px -1px #0000001a, 0 2px 4px -1px #0000000f` | `0 4px 6px -1px #0000001a, 0 2px 4px -1px #0000000f` | kit and packages/ui boxShadow |

### Borders/hairlines

| Kit token name | CSS custom property name | Dark value | Light value | Source |
| --- | --- | --- | --- | --- |
| `border.dialogTitle` | `--cui-border-dialog-title` | `#2b2b2b` | `#e2e8f0` | measured preview, semanticTokens.dialog-titleBorderColor |
| `border.divider` | `--cui-border-divider` | `#252525` | `#e2e8f0` | measured preview, semanticTokens.divider |
| `border.input` | `--cui-border-input` | `transparent` | `transparent` | measured preview, semanticTokens.input-borderColor |
| `border.menu` | `--cui-border-menu` | `#333` | `#e8e8e8` | kit dropdownBorder, light HSL normalized |
| `border.width` | `--cui-border-width` | `1px` | `1px` | packages/ui borderWidth.default |
| `border.widthStrong` | `--cui-border-width-strong` | `2px` | `2px` | packages/ui borderWidth.2 |

### Focus ring

| Kit token name | CSS custom property name | Dark value | Light value | Source |
| --- | --- | --- | --- | --- |
| `focus.color` | `--cui-focus-color` | `var(--cui-accent-focus)` | `var(--cui-accent-focus)` | measured preview primary, inferred focus role |
| `focus.width` | `--cui-focus-width` | `2px` | `2px` | measured preview settings keyboard outline |
| `focus.offset` | `--cui-focus-offset` | `2px` | `2px` | proposed kit default; selection cards retain inset -2px locally |

### Radii

| Kit token name | CSS custom property name | Dark value | Light value | Source |
| --- | --- | --- | --- | --- |
| `radius.none` | `--cui-radius-none` | `0px` | `0px` | measured preview controlTokens; full from kit |
| `radius.badge` | `--cui-radius-badge` | `6px` | `6px` | measured preview controlTokens; full from kit |
| `radius.xs` | `--cui-radius-xs` | `7px` | `7px` | measured preview controlTokens; full from kit |
| `radius.sm` | `--cui-radius-sm` | `9px` | `9px` | measured preview controlTokens; full from kit |
| `radius.nav` | `--cui-radius-nav` | `10px` | `10px` | measured preview controlTokens; full from kit |
| `radius.md` | `--cui-radius-md` | `12px` | `12px` | measured preview controlTokens; full from kit |
| `radius.lg` | `--cui-radius-lg` | `14px` | `14px` | measured preview controlTokens; full from kit |
| `radius.card` | `--cui-radius-card` | `16px` | `16px` | measured preview controlTokens; full from kit |
| `radius.xl` | `--cui-radius-xl` | `18px` | `18px` | measured preview controlTokens; full from kit |
| `radius.command` | `--cui-radius-command` | `22px` | `22px` | measured preview controlTokens; full from kit |
| `radius.full` | `--cui-radius-full` | `9999px` | `9999px` | measured preview controlTokens; full from kit |

### Spacing

| Kit token name | CSS custom property name | Dark value | Light value | Source |
| --- | --- | --- | --- | --- |
| `space.auto` | `--cui-space-auto` | `auto` | `auto` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.px` | `--cui-space-px` | `1px` | `1px` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.0` | `--cui-space-0` | `0` | `0` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.0.5` | `--cui-space-0-5` | `2px` | `2px` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.1` | `--cui-space-1` | `0.25rem` | `0.25rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.1.5` | `--cui-space-1-5` | `6px` | `6px` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.2` | `--cui-space-2` | `0.5rem` | `0.5rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.2.5` | `--cui-space-2-5` | `10px` | `10px` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.3` | `--cui-space-3` | `0.75rem` | `0.75rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.4` | `--cui-space-4` | `1rem` | `1rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.5` | `--cui-space-5` | `1.25rem` | `1.25rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.6` | `--cui-space-6` | `1.5rem` | `1.5rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.8` | `--cui-space-8` | `2rem` | `2rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.10` | `--cui-space-10` | `2.5rem` | `2.5rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.12` | `--cui-space-12` | `3rem` | `3rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.16` | `--cui-space-16` | `4rem` | `4rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.20` | `--cui-space-20` | `5rem` | `5rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.24` | `--cui-space-24` | `6rem` | `6rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.32` | `--cui-space-32` | `8rem` | `8rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.40` | `--cui-space-40` | `10rem` | `10rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.48` | `--cui-space-48` | `12rem` | `12rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.56` | `--cui-space-56` | `14rem` | `14rem` | kit and packages/ui spacing; half steps measured preview gaps |
| `space.64` | `--cui-space-64` | `16rem` | `16rem` | kit and packages/ui spacing; half steps measured preview gaps |

### Control heights

| Kit token name | CSS custom property name | Dark value | Light value | Source |
| --- | --- | --- | --- | --- |
| `control.height.compact` | `--cui-control-height-compact` | `28px` | `28px` | measured preview segmented item |
| `control.height.xs` | `--cui-control-height-xs` | `30px` | `30px` | kit sizes; sm/md also DESIGN.md |
| `control.height.sm` | `--cui-control-height-sm` | `36px` | `36px` | kit sizes; sm/md also DESIGN.md |
| `control.height.md` | `--cui-control-height-md` | `40px` | `40px` | kit sizes; sm/md also DESIGN.md |
| `control.height.lg` | `--cui-control-height-lg` | `48px` | `48px` | kit sizes; sm/md also DESIGN.md |
| `control.height.xl` | `--cui-control-height-xl` | `56px` | `56px` | kit sizes; sm/md also DESIGN.md |

### Type scale

| Kit token name | CSS custom property name | Dark value | Light value | Source |
| --- | --- | --- | --- | --- |
| `font.size.badge` | `--cui-font-size-badge` | `11px` | `11px` | measured preview clusters |
| `font.size.xs` | `--cui-font-size-xs` | `12px` | `12px` | measured preview clusters |
| `font.size.caption` | `--cui-font-size-caption` | `13px` | `13px` | measured preview clusters |
| `font.size.sm` | `--cui-font-size-sm` | `14px` | `14px` | measured preview clusters |
| `font.size.md` | `--cui-font-size-md` | `16px` | `16px` | measured preview clusters |
| `font.size.lg` | `--cui-font-size-lg` | `18px` | `18px` | measured preview clusters |
| `font.size.xl` | `--cui-font-size-xl` | `20px` | `20px` | measured preview clusters |
| `font.size.2xl` | `--cui-font-size-2xl` | `24px` | `24px` | packages/ui fontSize.2xl |
| `font.family.sans` | `--cui-font-family-sans` | `"Inter var", system-ui, -apple-system, sans-serif` | `"Inter var", system-ui, -apple-system, sans-serif` | measured preview; consumer supplies font, system fallback otherwise |
| `font.family.mono` | `--cui-font-family-mono` | `ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace` | `ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace` | measured preview |
| `font.weight.normal` | `--cui-font-weight-normal` | `400` | `400` | measured preview |
| `font.weight.medium` | `--cui-font-weight-medium` | `500` | `500` | measured preview |
| `font.weight.semibold` | `--cui-font-weight-semibold` | `600` | `600` | measured preview |
| `font.lineHeight.compact` | `--cui-font-line-height-compact` | `1.15` | `1.15` | measured preview body and packages/ui lineHeight.normal |
| `font.lineHeight.normal` | `--cui-font-line-height-normal` | `1.5` | `1.5` | measured preview body and packages/ui lineHeight.normal |
| `font.tracking.normal` | `--cui-font-tracking-normal` | `normal` | `normal` | measured preview |

### Motion

| Kit token name | CSS custom property name | Dark value | Light value | Source |
| --- | --- | --- | --- | --- |
| `motion.duration.none` | `--cui-motion-duration-none` | `0ms` | `0ms` | measured preview fast/normal/panel; DESIGN.md 260ms ceiling for usual transitions |
| `motion.duration.fast` | `--cui-motion-duration-fast` | `120ms` | `120ms` | measured preview fast/normal/panel; DESIGN.md 260ms ceiling for usual transitions |
| `motion.duration.normal` | `--cui-motion-duration-normal` | `160ms` | `160ms` | measured preview fast/normal/panel; DESIGN.md 260ms ceiling for usual transitions |
| `motion.duration.panel` | `--cui-motion-duration-panel` | `200ms` | `200ms` | measured preview fast/normal/panel; DESIGN.md 260ms ceiling for usual transitions |
| `motion.duration.slow` | `--cui-motion-duration-slow` | `260ms` | `260ms` | measured preview fast/normal/panel; DESIGN.md 260ms ceiling for usual transitions |
| `motion.ease.out` | `--cui-motion-ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | `cubic-bezier(0.23, 1, 0.32, 1)` | measured preview and DESIGN.md; threads rule |

## Public CSS and vanilla-extract coexistence

Use the `--cui-` prefix and lowercase kebab-case segments. Numeric half steps use a hyphen in CSS, for example `space.1.5` is `--cui-space-1-5`. Export `@codeui/kit/theme.css` as ordinary precompiled CSS with `:root` defaults and `[data-cui-theme="dark"]` and `[data-cui-theme="light"]` blocks. Component CSS reads only these stable variables. A consumer imports the CSS once and places overrides after it with equal or greater specificity. A scoped attribute works by inheritance, including when a plain CSS consumer has no vanilla-extract plugin.

Use one checked-in value registry as the source for both plain theme CSS and typed variable references. Replace the hashed createThemeContract names with createGlobalThemeContract names that resolve to the exact CSS names in this table. Today createGlobalTheme emits both static root tokens and mode contracts. K5 keeps vanilla-extract for authoring component styles, but emits its theme declarations into the same shipped theme stylesheet. Do not also generate a second set of hashed declarations. The TypeScript export contains var(--cui-...) strings; it must not execute vanilla-extract in the consuming app. A generated equality check must prove every registry leaf has exactly one CSS variable and a value in each mode.

Default values use a low-priority theme layer. Document overrides in a later layer or unlayered author CSS. Do not register non-inheriting properties. Do not load font files automatically. The font stack falls back when the consumer does not supply Inter. CodeImage can keep its vanilla-extract styling rule while importing the packaged plain CSS.

## Theme resolution

The only UI theme attribute is `data-cui-theme`. Its resolved DOM values are `dark` and `light`. Preference is `dark`, `light`, or `system` in provider state or app storage. System resolves through prefers-color-scheme. Render a tiny prepaint initializer to set the resolved attribute before CSS paints. Listen for system changes only when preference is system. An explicit preference wins. Without JavaScript, :root uses light defaults and a prefers-color-scheme dark block supplies dark defaults only where no explicit light attribute applies. Explicit dark/light blocks follow the fallback.

Set color-scheme to the resolved mode. ThemeProvider accepts an initial preference for SSR and a target element. Nested scopes use the same attribute and complete value blocks. Portals mount within the scope or copy its resolved attribute to their root; a portal must not accidentally inherit the document theme. Remove both old UI attribute writers in the same CodeImage migration.

Frame colour mode is a separate app domain. TerminalHost and Watermark choose it from image settings, not appearance settings. Rename that data to `data-codeimage-frame-mode`; preserve its independent value. It never selects kit theme declarations. This is the explicit exception to removing all non-kit mode data, required to preserve exported artwork.

## CodeImage codemod mapping

The companion JSON contains all observed direct paths, expanded `const c = themeVars.dynamicColors` uses, source filenames, and the full semantic contract. Counts are distinct observed leaf paths across apps/codeimage and packages/ui, excluding object namespaces. 78 map to kit roles and 32 stay in the app. An alias has the same mapping as its expanded path. Imports must be resolved because some files alias kit themeTokens as themeVars.

| Old path | New kit token or app disposition | Reason |
| --- | --- | --- |
| `backgroundColorVar` | stays in the app | locally assigned component variable, including editor artwork and status banners; not a global theme value |
| `colorVar` | stays in the app | locally assigned component variable, including editor artwork and status banners; not a global theme value |
| `themeColors.background` | `surface.canvas` | semantic UI role |
| `themeColors.baseText` | `text.default` | semantic UI role |
| `themeColors.bottomBar.backgroundColor` | `surface.toolbar` | semantic UI role |
| `themeColors.bottomBar.textColor` | `text.toolbar` | semantic UI role |
| `themeColors.button.base.activeColor` | `action.neutral.active` | semantic UI role |
| `themeColors.button.base.backgroundColor` | `action.neutral.base` | semantic UI role |
| `themeColors.button.base.hoverColor` | `action.neutral.hover` | semantic UI role |
| `themeColors.button.base.textColor` | `action.neutral.text` | semantic UI role |
| `themeColors.button.danger.activeColor` | `action.danger.active` | semantic UI role |
| `themeColors.button.danger.backgroundColor` | `action.danger.base` | semantic UI role |
| `themeColors.button.danger.hoverColor` | `action.danger.hover` | semantic UI role |
| `themeColors.button.danger.textColor` | `action.danger.text` | semantic UI role |
| `themeColors.button.primary.activeColor` | `action.brand.active` | semantic UI role |
| `themeColors.button.primary.backgroundColor` | `action.brand.base` | semantic UI role |
| `themeColors.button.primary.hoverColor` | `action.brand.hover` | semantic UI role |
| `themeColors.button.primary.textColor` | `action.brand.text` | semantic UI role |
| `themeColors.button.primaryAlt.backgroundColor` | `action.brandSoft.base` | semantic UI role |
| `themeColors.button.primaryAlt.hoverColor` | `action.brandSoft.hover` | semantic UI role |
| `themeColors.button.primaryAlt.textColor` | `action.brandSoft.text` | semantic UI role |
| `themeColors.descriptionTextColor` | `text.muted` | semantic UI role |
| `themeColors.dialog.overlayBackgroundColor` | `surface.scrim` | semantic UI role |
| `themeColors.dialog.panelBackgroundColor` | `surface.dialog` | semantic UI role |
| `themeColors.dialog.panelShadow` | `shadow.dialog` | semantic UI role |
| `themeColors.dialog.panelTextColor` | `text.dialog` | semantic UI role |
| `themeColors.dialog.titleBorderColor` | `border.dialogTitle` | semantic UI role |
| `themeColors.dialog.titleTextColor` | `text.dialogTitle` | semantic UI role |
| `themeColors.divider` | `border.divider` | semantic UI role |
| `themeColors.input.accentColor` | `surface.inputAccent` | semantic UI role |
| `themeColors.input.backgroundColor` | `surface.input` | semantic UI role |
| `themeColors.input.borderColor` | `border.input` | semantic UI role |
| `themeColors.input.labelTextColor` | `text.label` | semantic UI role |
| `themeColors.input.labelTextHintColor` | `text.hint` | semantic UI role |
| `themeColors.input.textColor` | `text.input` | semantic UI role |
| `themeColors.listBox.activeBackgroundColor` | `accent.selection` | semantic UI role |
| `themeColors.listBox.activeTextColor` | `text.selected` | semantic UI role |
| `themeColors.listBox.hoverBackgroundColor` | `surface.menuHover` | semantic UI role |
| `themeColors.listBox.panelBackground` | `surface.menu` | semantic UI role |
| `themeColors.listBox.textColor` | `text.menu` | semantic UI role |
| `themeColors.panel.background` | `surface.panel` | semantic UI role |
| `themeColors.panel.textColor` | `text.panel` | semantic UI role |
| `themeColors.panel.textColorAlt` | `text.panelMuted` | semantic UI role |
| `themeColors.primary` | `accent.focus` | semantic UI role |
| `themeColors.scrollBar.backgroundColor` | `surface.scrollThumb` | semantic UI role |
| `themeColors.scrollBar.hoverBackgroundColor` | `surface.scrollThumbHover` | semantic UI role |
| `themeColors.secondary` | `surface.secondary` | semantic UI role |
| `themeColors.snackbar.backgroundColor` | `surface.toast` | semantic UI role |
| `themeColors.snackbar.textColor` | `text.toast` | semantic UI role |
| `themeVars.backgroundColor.black` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.blue.400` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.blue.500` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.blue.600` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.blue.700` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.gray` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.gray.100` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.gray.200` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.gray.300` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.gray.400` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.gray.500` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.gray.700` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.gray.800` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.indigo.300` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.indigo.500` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.red.500` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.red.600` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.red.700` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.transparent` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.white` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.backgroundColor.yellow.400` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.borderColor.default` | `border.divider` | semantic or scale role |
| `themeVars.borderRadius` | stays in the app | utility or object namespace, not a semantic theme leaf; preserve in app utility adapter and expand accesses before codemod |
| `themeVars.borderRadius.default` | stays in the app | legacy 2px/4px/8px geometry; app-local compatibility value, do not silently round to 0px/9px |
| `themeVars.borderRadius.full` | `radius.full` | semantic or scale role |
| `themeVars.borderRadius.lg` | stays in the app | legacy 2px/4px/8px geometry; app-local compatibility value, do not silently round to 0px/9px |
| `themeVars.borderRadius.md` | `radius.badge` | semantic or scale role |
| `themeVars.borderRadius.sm` | stays in the app | legacy 2px/4px/8px geometry; app-local compatibility value, do not silently round to 0px/9px |
| `themeVars.borderRadius.xl` | `radius.card` | semantic or scale role |
| `themeVars.borderWidth.2` | `border.widthStrong` | semantic or scale role |
| `themeVars.borderWidth.default` | `border.width` | semantic or scale role |
| `themeVars.boxShadow.default` | `shadow.sm` | semantic or scale role |
| `themeVars.boxShadow.lg` | `shadow.dialog` | semantic or scale role |
| `themeVars.boxShadow.md` | `shadow.md` | semantic or scale role |
| `themeVars.boxShadow.outline` | `focus.color + focus.width + focus.offset` | semantic or scale role |
| `themeVars.brand` | `action.brand.base` | semantic or scale role |
| `themeVars.brandLink` | `accent.focus` | semantic or scale role |
| `themeVars.brandSecondary` | `action.neutral.base` | semantic or scale role |
| `themeVars.brandSoft` | `action.brandSoft.base` | semantic or scale role |
| `themeVars.brandSoftAccentActive` | `action.brandSoft.active` | semantic or scale role |
| `themeVars.caution` | `action.caution.base` | semantic or scale role |
| `themeVars.critical` | `action.danger.base` | semantic or scale role |
| `themeVars.dynamicColors` | stays in the app | utility or object namespace, not a semantic theme leaf; preserve in app utility adapter and expand accesses before codemod |
| `themeVars.dynamicColors.background` | `surface.canvas` | semantic UI role |
| `themeVars.dynamicColors.baseText` | `text.default` | semantic UI role |
| `themeVars.dynamicColors.bottomBar.backgroundColor` | `surface.toolbar` | semantic UI role |
| `themeVars.dynamicColors.bottomBar.textColor` | `text.toolbar` | semantic UI role |
| `themeVars.dynamicColors.button.base.activeColor` | `action.neutral.active` | semantic UI role |
| `themeVars.dynamicColors.button.base.backgroundColor` | `action.neutral.base` | semantic UI role |
| `themeVars.dynamicColors.button.base.hoverColor` | `action.neutral.hover` | semantic UI role |
| `themeVars.dynamicColors.button.base.textColor` | `action.neutral.text` | semantic UI role |
| `themeVars.dynamicColors.button.danger.activeColor` | `action.danger.active` | semantic UI role |
| `themeVars.dynamicColors.button.danger.backgroundColor` | `action.danger.base` | semantic UI role |
| `themeVars.dynamicColors.button.danger.hoverColor` | `action.danger.hover` | semantic UI role |
| `themeVars.dynamicColors.button.danger.textColor` | `action.danger.text` | semantic UI role |
| `themeVars.dynamicColors.button.primary.activeColor` | `action.brand.active` | semantic UI role |
| `themeVars.dynamicColors.button.primary.backgroundColor` | `action.brand.base` | semantic UI role |
| `themeVars.dynamicColors.button.primary.hoverColor` | `action.brand.hover` | semantic UI role |
| `themeVars.dynamicColors.button.primary.textColor` | `action.brand.text` | semantic UI role |
| `themeVars.dynamicColors.button.primaryAlt.backgroundColor` | `action.brandSoft.base` | semantic UI role |
| `themeVars.dynamicColors.button.primaryAlt.hoverColor` | `action.brandSoft.hover` | semantic UI role |
| `themeVars.dynamicColors.button.primaryAlt.textColor` | `action.brandSoft.text` | semantic UI role |
| `themeVars.dynamicColors.descriptionTextColor` | `text.muted` | semantic UI role |
| `themeVars.dynamicColors.dialog.overlayBackgroundColor` | `surface.scrim` | semantic UI role |
| `themeVars.dynamicColors.dialog.panelBackgroundColor` | `surface.dialog` | semantic UI role |
| `themeVars.dynamicColors.dialog.panelShadow` | `shadow.dialog` | semantic UI role |
| `themeVars.dynamicColors.dialog.panelTextColor` | `text.dialog` | semantic UI role |
| `themeVars.dynamicColors.dialog.titleBorderColor` | `border.dialogTitle` | semantic UI role |
| `themeVars.dynamicColors.dialog.titleTextColor` | `text.dialogTitle` | semantic UI role |
| `themeVars.dynamicColors.divider` | `border.divider` | semantic UI role |
| `themeVars.dynamicColors.input.accentColor` | `surface.inputAccent` | semantic UI role |
| `themeVars.dynamicColors.input.backgroundColor` | `surface.input` | semantic UI role |
| `themeVars.dynamicColors.input.borderColor` | `border.input` | semantic UI role |
| `themeVars.dynamicColors.input.labelTextColor` | `text.label` | semantic UI role |
| `themeVars.dynamicColors.input.labelTextHintColor` | `text.hint` | semantic UI role |
| `themeVars.dynamicColors.input.textColor` | `text.input` | semantic UI role |
| `themeVars.dynamicColors.listBox.activeBackgroundColor` | `accent.selection` | semantic UI role |
| `themeVars.dynamicColors.listBox.activeTextColor` | `text.selected` | semantic UI role |
| `themeVars.dynamicColors.listBox.hoverBackgroundColor` | `surface.menuHover` | semantic UI role |
| `themeVars.dynamicColors.listBox.panelBackground` | `surface.menu` | semantic UI role |
| `themeVars.dynamicColors.listBox.textColor` | `text.menu` | semantic UI role |
| `themeVars.dynamicColors.panel.background` | `surface.panel` | semantic UI role |
| `themeVars.dynamicColors.panel.textColor` | `text.panel` | semantic UI role |
| `themeVars.dynamicColors.panel.textColorAlt` | `text.panelMuted` | semantic UI role |
| `themeVars.dynamicColors.primary` | `accent.focus` | semantic UI role |
| `themeVars.dynamicColors.scrollBar.backgroundColor` | `surface.scrollThumb` | semantic UI role |
| `themeVars.dynamicColors.scrollBar.hoverBackgroundColor` | `surface.scrollThumbHover` | semantic UI role |
| `themeVars.dynamicColors.secondary` | `surface.secondary` | semantic UI role |
| `themeVars.dynamicColors.snackbar.backgroundColor` | `surface.toast` | semantic UI role |
| `themeVars.dynamicColors.snackbar.textColor` | `text.toast` | semantic UI role |
| `themeVars.fontSize` | stays in the app | utility or object namespace, not a semantic theme leaf; preserve in app utility adapter and expand accesses before codemod |
| `themeVars.fontSize.2xl` | `font.size.2xl` | semantic or scale role |
| `themeVars.fontSize.base` | `font.size.md` | semantic or scale role |
| `themeVars.fontSize.lg` | `font.size.lg` | semantic or scale role |
| `themeVars.fontSize.sm` | `font.size.sm` | semantic or scale role |
| `themeVars.fontSize.xl` | `font.size.xl` | semantic or scale role |
| `themeVars.fontSize.xs` | `font.size.xs` | semantic or scale role |
| `themeVars.fontWeight` | stays in the app | utility or object namespace, not a semantic theme leaf; preserve in app utility adapter and expand accesses before codemod |
| `themeVars.fontWeight.medium` | `font.weight.medium` | semantic or scale role |
| `themeVars.fontWeight.normal` | `font.weight.normal` | semantic or scale role |
| `themeVars.fontWeight.semibold` | `font.weight.semibold` | semantic or scale role |
| `themeVars.lineHeight` | stays in the app | utility or object namespace, not a semantic theme leaf; preserve in app utility adapter and expand accesses before codemod |
| `themeVars.lineHeight.normal` | `font.lineHeight.normal` | semantic or scale role |
| `themeVars.margin.3` | `space.3` | semantic or scale role |
| `themeVars.opacity.50` | stays in the app | utility or object namespace, not a semantic theme leaf; preserve in app utility adapter and expand accesses before codemod |
| `themeVars.spacing` | stays in the app | utility or object namespace, not a semantic theme leaf; preserve in app utility adapter and expand accesses before codemod |
| `themeVars.spacing.1` | `space.1` | semantic or scale role |
| `themeVars.spacing.10` | `space.10` | semantic or scale role |
| `themeVars.spacing.12` | `space.12` | semantic or scale role |
| `themeVars.spacing.2` | `space.2` | semantic or scale role |
| `themeVars.spacing.24` | `space.24` | semantic or scale role |
| `themeVars.spacing.3` | `space.3` | semantic or scale role |
| `themeVars.spacing.4` | `space.4` | semantic or scale role |
| `themeVars.spacing.5` | `space.5` | semantic or scale role |
| `themeVars.spacing.6` | `space.6` | semantic or scale role |
| `themeVars.spacing.8` | `space.8` | semantic or scale role |
| `themeVars.spacing.px` | `space.px` | semantic or scale role |
| `themeVars.textColor.gray.700` | stays in the app | fixed palette literal; app artwork and legacy palette references require per-use semantic review, not a mode-dependent substitution |
| `themeVars.width.full` | stays in the app | utility or object namespace, not a semantic theme leaf; preserve in app utility adapter and expand accesses before codemod |
| `themeVars.zIndex.10` | stays in the app | utility or object namespace, not a semantic theme leaf; preserve in app utility adapter and expand accesses before codemod |
| `themeVars.zIndex.20` | stays in the app | utility or object namespace, not a semantic theme leaf; preserve in app utility adapter and expand accesses before codemod |
| `themeVars.zIndex.40` | stays in the app | utility or object namespace, not a semantic theme leaf; preserve in app utility adapter and expand accesses before codemod |
| `themeVars.zIndex.50` | stays in the app | utility or object namespace, not a semantic theme leaf; preserve in app utility adapter and expand accesses before codemod |

The `themeVars.dynamicColors.*` and `themeColors.*` rows name the same old contract. Expand namespaces and aliases before replacing leaves. The generic backgroundColorVar/colorVar are local CSS slots. Rename those to app variables or remove them when a specific component adopts a kit part. Do not replace assignments with global kit variable assignments. Fixed palette paths remain app literals until a per-use review identifies their semantic role. Equal RGB values alone do not prove equivalent meaning.

Legacy boxShadow.outline requires a style rewrite to outline color, width and offset, not substitution into box-shadow. Legacy borderRadius.sm/default/lg stay app-local because they mean 2/4/8px, unlike current kit names. New generic controls use the contract radius scale. Space uses rem on existing whole steps to preserve root-font scaling. Measured geometry assumes a 16px root.

### Attribute selectors

| Old selector or writer | Replacement | Scope |
| --- | --- | --- |
| `[data-codeimage-theme=dark]` | `[data-cui-theme=dark]` | UI theme, preserve suffix and nesting |
| `[data-codeimage-theme=light]` | `[data-cui-theme=light]` | UI theme, preserve suffix and nesting |
| withThemeMode generated `[data-codeimage-theme=${mode}] ${suffix}` | `[data-cui-theme=${resolvedMode}] ${suffix}` | Both nested-selector and & forms |
| UI `[data-theme-mode=dark] &` and light form | `[data-cui-theme=dark] &` and light form | Loader and UI-only selectors |
| Frame `[data-theme-mode=dark] &` and light form | `[data-codeimage-frame-mode=dark] &` and light form | Terminal, tabs, reflection and add button |
| Frame `&[data-theme-mode=light]` and dark form | `&[data-codeimage-frame-mode=light]` and dark form | Preserve self-selector |
| Frame `[data-theme-mode=light] &[data-accent-visible=true]` and dark form | `[data-codeimage-frame-mode=light] &[data-accent-visible=true]` and dark form | Preserve accent condition |
| Logo `[data-theme-mode=light] .cls-1` and `.cls-3` | `[data-cui-theme=light] .cls-1` and `.cls-3` | Logo follows UI |
| TerminalHost and Watermark data-theme-mode props | data-codeimage-frame-mode props | Keep image mode independent |
| verify-i18n `[data-theme-mode]` exclusion | `[data-codeimage-frame-mode]` | Excludes artwork, not all UI |
| theme provider, createGlobalCodeImageTheme, toast patch writers | data-cui-theme with resolved dark/light | Remove duplicate UI theme state |

Current source inventory follows. The roadmap counts 14 and 5 files. This ref has the files below, so rerun git grep at codemod time rather than asserting those older totals.

`data-theme-mode` occurs in 10 files across the inspected app and UI package.
- `apps/codeimage/src/components/Icons/CodeImageLogoV2.tsx`.
- `apps/codeimage/src/components/Terminal/GlassReflection/TerminalGlassReflection.css.ts`.
- `apps/codeimage/src/components/Terminal/Tabs/Tab/Tab.css.ts`.
- `apps/codeimage/src/components/Terminal/Tabs/TabAddButton/TabAddButton.css.ts`.
- `apps/codeimage/src/components/Terminal/TerminalHost.tsx`.
- `apps/codeimage/src/components/Terminal/WindowsTerminal/WindowsTerminal.css.ts`.
- `apps/codeimage/src/components/Terminal/terminal.css.ts`.
- `apps/codeimage/src/components/Watermark/Watermark.tsx`.
- `apps/codeimage/src/pages/UnifiedEditor/verify-i18n.mjs`.
- `packages/ui/src/lib/primitives/Loader/Loader.css.ts`.

`data-codeimage-theme` occurs in 5 files across the inspected app and UI package.
- `apps/codeimage/src/theme/global.css.ts`.
- `packages/ui/src/lib/primitives/Snackbar/patch-solid-toast.ts`.
- `packages/ui/src/lib/theme/with-theme-mode.ts`.
- `packages/ui/src/lib/tokens/createCodeImageTheme.ts`.
- `packages/ui/src/lib/tokens/tokens.tsx`.

## Visual review gate

Changing the contract changes colours of Button and IconButton, CheckBox, Radio/RadioList, SegmentedControl, Select, Listbox, Dropdown, Tabs, TextField, NumberField, TextArea, FieldLabel, FieldError, Dialog, Popover, and Tooltip. Shared text utilities also affect Typography and any consumer of those classes. Source evidence is the set of component CSS files that reference tokens or themeTokens, recorded in JSON. Components using shared button or field classes inherit their changes.

Button brand/danger/neutral states, input backgrounds and borders, menu text/hover/selection, dialog scrim/shadow and all inherited surfaces need dark and light review. The type scale changes xs from 12.8px to 12px, lg from 20px to 18px, and xl from 24px to 20px. Keep public size labels but migrate call sites that need the previous size explicitly. Control xs remains 30px; compact is a separate 28px segmented item, not a replacement for the 36 to 40px full control rows required by DESIGN.md.

Existing radius xs/sm/md/lg/xl values stay 7/9/12/14/18px. Add card 16px and command 22px rather than changing existing names. Replace radius.default with radius.lg. Component-specific radius choices remain explicit. Do not apply the command radius to every dialog.

Review before/after stories for every listed component in both modes, including hover, pressed, disabled, invalid, selected and keyboard focus. Include menus/dialog portals and one plain CSS override consumer. Check contrast on actual rendered states before approval; measured parity alone does not establish accessibility. K5 is a review-gated appearance change, not a claim of visual parity for every control.

Motion defaults use short strong ease-out. Fast is 120ms, normal 160ms, panel 200ms, and slow 260ms. No generic control exceeds 300ms. Keyboard-triggered changes use duration.none. Reduced motion removes transform and clip-path animation; retain only short opacity changes. Frequent interactions can use none. Do not replace every transition with animation merely because tokens exist.

## Naming decisions and verification

Maintainer call is the proposed semantic hierarchy `surface`, `text`, `action`, `accent`, and the frame-mode exception. Default is to adopt the names above, including focus and brand as distinct roles. The prefix stays `--cui-`, matching the existing kit theme attribute. No decision is needed to preserve the measured values.

Redesign from First Principles shaped the stable CSS-first contract instead of preserving both theme systems. Prove It Works shaped the companion inventory, expanded aliases and explicit source discrepancy. Validate the JSON by checking unique CSS names, complete dark/light values and that every non-null mapping names a contract token. Counts below come directly from that registry.

- surfaces. 13 tokens.
- text. 18 tokens.
- accent and status colors. 22 tokens.
- shadows. 5 tokens.
- borders/hairlines. 6 tokens.
- focus ring. 3 tokens.
- radii. 11 tokens.
- spacing. 23 tokens.
- control heights. 6 tokens.
- type scale. 16 tokens.
- motion. 6 tokens.

## K5 implementation amendments

The implementation keeps every name above and changes ten values, all to meet WCAG AA text contrast (4.5:1) on rendered components. The measured preview values fail it: white on `#09f` is 3.0:1, and white on `#f56565` is 3.0:1.

- `action.brand.*` uses `#0070f0`, `#0066dc` and `#005bc4`. The base is close to the measured export button, `#0072f5`, which is 4.4:1 with white.
- `action.danger.*` uses `#c53030`, `#b52b2b` and `#9b2c2c`.
- `accent.selection` uses the brand base, and `text.selected` is `#fff` in both modes.
- `action.brandSoft.text` is `#33adff` in dark and `#0062d1` in light.
- `text.danger` is a new role for error text: `#fc8181` in dark and `#c53030` in light. No existing role passes on both surfaces.

The token count is 129. `pnpm --filter @codeui/kit test` checks every name and value in `k5-token-map.json` against the kit. The plain `@codeui/kit/theme.css` export is not part of K5. Consumers still build kit styles with vanilla-extract.
