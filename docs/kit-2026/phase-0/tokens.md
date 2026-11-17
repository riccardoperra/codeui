# CodeImage token extraction

Phase 0 raw material for making @codeui/kit cover CodeImage and reusable Solid UI. No product code changes.

## Method

Playwright Chromium, 1440 × 900, dark and light at https://codeimage-preview.pages.dev/. Captured 2026-11-16T13:03:59.396Z. Each view stores DOM samples, computed styles, eight keyboard Tab focus samples, and computed custom properties on html and body. CSS custom properties on :root are included through html. Values labelled measured come from getComputedStyle. Values labelled read come from source. Role mappings and scale interpretations are inferred.

Rerun with `npm install --prefix /private/tmp/claude-501/kit-tokens playwright polished`, then `node docs/kit-2026/phase-0/tools/extract-tokens.mjs`. PLAYWRIGHT_HOME can select another external install directory. No repo dependency changes are needed.

The JSON separates semanticTokens, clusters, raw themes, source text, and diff. Clusters group exact property values with counts and sample references. They include artwork and layout dimensions, so they are raw observations rather than a recommended public contract.

## Source cross-check

Read DESIGN.md spacing and size table declares 8px page inset and header gap, 36px desktop header, 36–40px control rows, and 12–16px island padding. Its motion rule declares cubic-bezier(0.23, 1, 0.32, 1), usually 120–260ms. Source label is read.

Read UI-02 confirms two token systems. packages/ui/src/lib/tokens/createCodeImageTheme.ts targets data-codeimage-theme. Kit foundation/themes.css.ts targets data-cui-theme. Both attributes are measured on html. The checked-in CodeImage dark background is #1d1d1d and panel background #111111. Deployment measures #0f0f10 and #151516. Do not substitute source values for live measurements. Full source text is retained in JSON.

## Semantic token table

| Token | Dark | Light | Source | Label |
| --- | --- | --- | --- | --- |
| background | #0f0f10 | #f7fafc | html computed custom property | measured |
| baseText | #ededed | #4a5568 | html computed custom property | measured |
| bottomBar-backgroundColor | #2b2b2b | #fff | html computed custom property | measured |
| bottomBar-textColor | #a0a0a0 | #4a5568 | html computed custom property | measured |
| button-base-activeColor | #505050 | #a0aec0 | html computed custom property | measured |
| button-base-backgroundColor | #333 | #e2e8f0 | html computed custom property | measured |
| button-base-hoverColor | #3e3e3e | #cbd5e0 | html computed custom property | measured |
| button-base-textColor | #ededed | #2d3748 | html computed custom property | measured |
| button-danger-activeColor | #c53030 | #c53030 | html computed custom property | measured |
| button-danger-backgroundColor | #f56565 | #f56565 | html computed custom property | measured |
| button-danger-hoverColor | #e53e3e | #e53e3e | html computed custom property | measured |
| button-danger-textColor | #fff | #fff | html computed custom property | measured |
| button-primary-activeColor | #07f | #07f | html computed custom property | measured |
| button-primary-backgroundColor | #09f | #09f | html computed custom property | measured |
| button-primary-hoverColor | #08f | #08f | html computed custom property | measured |
| button-primary-textColor | #fff | #fff | html computed custom property | measured |
| button-primaryAlt-backgroundColor | #0099ff26 | #0099ff26 | html computed custom property | measured |
| button-primaryAlt-hoverColor | #007acc26 | #007acc26 | html computed custom property | measured |
| button-primaryAlt-textColor | #09f | #09f | html computed custom property | measured |
| descriptionTextColor | #999 | #4a5568 | html computed custom property | measured |
| dialog-overlayBackgroundColor | #000000b3 | #0006 | html computed custom property | measured |
| dialog-panelBackgroundColor | #1d1d1d | #fff | html computed custom property | measured |
| dialog-panelShadow | 0 10px 30px 0 #00000026, inset 0 0 0 1px #232323 | 0 10px 15px -3px #0000001a, 0 4px 6px -2px #0000000d | html computed custom property | measured |
| dialog-panelTextColor | #ededed | #2d3748 | html computed custom property | measured |
| dialog-titleBorderColor | #2b2b2b | #e2e8f0 | html computed custom property | measured |
| dialog-titleTextColor | #ededed | #2d3748 | html computed custom property | measured |
| divider | #252525 | #e2e8f0 | html computed custom property | measured |
| input-accentColor | #505050 | #fff | html computed custom property | measured |
| input-backgroundColor | #232323 | #f3f3f3 | html computed custom property | measured |
| input-borderColor | transparent | transparent | html computed custom property | measured |
| input-labelTextColor | #ededed | #2d3748 | html computed custom property | measured |
| input-labelTextHintColor | #a0a0a0 | #4a5568 | html computed custom property | measured |
| input-textColor | #ededed | #333 | html computed custom property | measured |
| listBox-activeBackgroundColor | #07f | #09f | html computed custom property | measured |
| listBox-activeTextColor | #ededed | #fff | html computed custom property | measured |
| listBox-hoverBackgroundColor | #333 | #f7fafc | html computed custom property | measured |
| listBox-panelBackground | #282828 | #fff | html computed custom property | measured |
| listBox-textColor | #ededed | #2d3748 | html computed custom property | measured |
| panel-background | #151516 | #fff | html computed custom property | measured |
| panel-textColorAlt | #ccc | #666 | html computed custom property | measured |
| panel-textColor | #fff | #000 | html computed custom property | measured |
| primary | #63b3ed | #09f | html computed custom property | measured |
| scrollBar-backgroundColor | #505050 | #cbd5e0 | html computed custom property | measured |
| scrollBar-hoverBackgroundColor | #333 | #a0aec0 | html computed custom property | measured |
| secondary | #edf2f7 | #edf2f7 | html computed custom property | measured |
| snackbar-backgroundColor | #2b2b2b | #fff | html computed custom property | measured |
| snackbar-textColor | #fff | #333 | html computed custom property | measured |

## Measured scales

These are exact observed value sets, separated by property. Inclusion in a shared scale is inferred. Transparent backgrounds and inherited border colours do not establish a semantic surface or hairline.

| Token | Dark | Light | Source | Label |
| --- | --- | --- | --- | --- |
| border-radius | 0px; 9px; 50%; 9px 4px 4px 9px; 4px 9px 9px 4px; 22px; 16px; 8px; 15px; 9999px; 8px 8px 0px 0px; 6px; 18px; 7px; 12px; 13px; 12.32px; 4.8px; 999px; 11px; 4px; 14px; 10px | 0px; 9px; 50%; 9px 4px 4px 9px; 4px 9px 9px 4px; 22px; 16px; 8px; 15px; 9999px; 8px 8px 0px 0px; 6px; 18px; 7px; 12px; 13px; 12.32px; 4.8px; 999px; 11px; 4px; 14px; 10px | DOM clusters | measured |
| padding | 0px; 8px; 0px 0px 0px 8px; 0px 16px; 0px 8px 8px; 64px; 0px 0px 0px 16px; 0px 12px 0px 16px; 20px 16px 16px; 6px 10px; 4px 8px; 8px 12px 12px; 6px; 0px 8px; 12px 16px; 0px 12px 0px 8px; 0px 12px; 4px; 8px 8px 16px; 6.72px 9.6px; 0px 0px 0px 8.64062px; 0px 4px 4px; 0px 16px 16px 0px; 2px 0px; 0px 0px 0px 15px; 4px 12px 12px 16px; 12px 0px 0px; 12px 8px 8px; 4px 0px 6px; 0px 2px; 16px 0px 0px; 0px 8px 0px 0px; 16px 0px; 8px 0px; 12px 12px 8px; 0px 12px 0px 34px; 1px 6px; 4px 12px 12px; 0px 10px; 12px 12px 8px 24px; 8px 24px 24px; 0px 4px; 6px 0px; 12px 16px 8px; 12px; 8px 16px; 2px 6px; 2px 8px; 16px 12px 8px; 0px 20px; 8px 0px 0px; 1px 2px; 12px 12px 4px | 0px; 8px; 0px 0px 0px 8px; 0px 16px; 0px 8px 8px; 64px; 0px 0px 0px 16px; 0px 12px 0px 16px; 20px 16px 16px; 6px 10px; 4px 8px; 8px 12px 12px; 6px; 0px 8px; 12px 16px; 0px 12px 0px 8px; 0px 12px; 4px; 8px 8px 16px; 6.72px 9.6px; 0px 0px 0px 8.64062px; 0px 4px 4px; 0px 16px 16px 0px; 2px 0px; 0px 0px 0px 15px; 4px 12px 12px 16px; 12px 0px 0px; 12px 8px 8px; 4px 0px 6px; 0px 2px; 16px 0px 0px; 0px 8px 0px 0px; 16px 0px; 8px 0px; 12px 12px 8px; 0px 12px 0px 34px; 1px 6px; 4px 12px 12px; 0px 10px; 12px 12px 8px 24px; 8px 24px 24px; 0px 4px; 6px 0px; 12px 16px 8px; 12px; 8px 16px; 2px 6px; 2px 8px; 16px 12px 8px; 0px 20px; 8px 0px 0px; 1px 2px; 12px 12px 4px | DOM clusters | measured |
| gap | normal; 12px; 8px; 2px; normal 8px; 4px; 10px; 6.24px; 2.88px; 6%; 6px; 32px; 24px; 8px 16px; 16px | normal; 12px; 8px; 2px; normal 8px; 4px; 10px; 6.24px; 2.88px; 6%; 6px; 32px; 24px; 8px 16px; 16px | DOM clusters | measured |
| font-family | "Inter var", system-ui, -apple-system, sans-serif; Inter, system-ui, sans-serif; ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; system-ui; ui-monospace, monospace | "Inter var", system-ui, -apple-system, sans-serif; Inter, system-ui, sans-serif; ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; system-ui; ui-monospace, monospace | DOM clusters | measured |
| font-size | 16px; 14px; 18px; 11px; 13px; 12.8px; 20px; 12px; 10px | 16px; 14px; 18px; 11px; 13px; 12.8px; 20px; 12px; 10px | DOM clusters | measured |
| font-weight | 400; 500; 600 | 400; 500; 600 | DOM clusters | measured |
| line-height | 18.4px; 16.1px; 18px; 12.65px; 19.5px; 30px; 14.95px; 24px; 14.72px; 21px; 20px; 18.2px; 14px; 15.6px; 16px; 16.8px; 16.2px; 13.8px | 18.4px; 16.1px; 18px; 12.65px; 19.5px; 30px; 14.95px; 24px; 14.72px; 21px; 20px; 18.2px; 14px; 15.6px; 16px; 16.8px; 16.2px; 13.8px | DOM clusters | measured |
| letter-spacing | normal | normal | DOM clusters | measured |
| transition-duration | 0s; 0.12s; 0.2s, 0.2s, 0.2s, 0.15s, 0.15s; 0.2s; 0.2s, 0.2s; 0.15s; 0.15s, 0.05s; 0.2s, 0.2s, 0.2s; 0.12s, 0.12s, 0.12s; 0.16s; 0.25s, 0.25s; 0.16s, 0.15s; 0.15s, 0.15s, 0.16s; 0.15s, 0.16s | 0s; 0.12s; 0.2s, 0.2s, 0.2s, 0.15s, 0.15s; 0.2s; 0.2s, 0.2s; 0.15s; 0.15s, 0.05s; 0.2s, 0.2s, 0.2s; 0.12s, 0.12s, 0.12s; 0.16s; 0.25s, 0.25s; 0.16s, 0.15s; 0.15s, 0.15s, 0.16s; 0.15s, 0.16s | DOM clusters | measured |
| transition-timing-function | ease; cubic-bezier(0.23, 1, 0.32, 1); ease, ease, ease, ease-in-out, ease-in; cubic-bezier(0.23, 1, 0.32, 1), cubic-bezier(0.23, 1, 0.32, 1); ease-out, cubic-bezier(0.23, 1, 0.32, 1); ease, ease; ease-in-out; ease-in-out, ease-in-out; ease, ease, ease; ease, ease, cubic-bezier(0.23, 1, 0.32, 1); cubic-bezier(0.2, 0, 0, 1), cubic-bezier(0.2, 0, 0, 1); cubic-bezier(0.23, 1, 0.32, 1), ease-out; ease-out, ease-out, cubic-bezier(0.23, 1, 0.32, 1) | ease; cubic-bezier(0.23, 1, 0.32, 1); ease, ease, ease, ease-in-out, ease-in; cubic-bezier(0.23, 1, 0.32, 1), cubic-bezier(0.23, 1, 0.32, 1); ease-out, cubic-bezier(0.23, 1, 0.32, 1); ease, ease; ease-in-out; ease-in-out, ease-in-out; ease, ease, ease; ease, ease, cubic-bezier(0.23, 1, 0.32, 1); cubic-bezier(0.2, 0, 0, 1), cubic-bezier(0.2, 0, 0, 1); cubic-bezier(0.23, 1, 0.32, 1), ease-out; ease-out, ease-out, cubic-bezier(0.23, 1, 0.32, 1) | DOM clusters | measured |
| box-shadow | none; color(srgb 0.388235 0.701961 0.929412 / 0.12) 0px 0px 0px 3px; rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.9) 0px 0px 0px 1px, rgba(255, 255, 255, 0.4) 0px 0px 0px 1.5px inset, rgba(0, 0, 0, 0.45) 0px 25px 20px -20px; rgba(0, 0, 0, 0.25) 1px 10px 5px 1px; rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px; color(srgb 1 1 1 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; rgba(0, 0, 0, 0.3) 0px 2px 6px 0px; color(srgb 0.733333 0.745098 0.74902 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; color(srgb 0.12549 0.12549 0.12549 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; color(srgb 0.807843 0.811765 0.815686 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; color(srgb 0.815686 0.847059 0.898039 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; color(srgb 0.901961 0.929412 0.952941 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; color(srgb 0.678431 0.729412 0.780392 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; color(srgb 0.741176 0.576471 0.976471 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; color(srgb 0.0980392 0.0980392 0.0980392 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; rgba(0, 0, 0, 0.3) 0px 1px 2px 0px; rgba(0, 0, 0, 0.4) 0px 30px 55px 0px; rgb(99, 179, 237) 0px 0px 0px 2px inset; rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(0, 0, 0, 0.3) 0px 4px 10px 0px; rgba(0, 0, 0, 0.15) 0px 10px 30px 0px, rgb(35, 35, 35) 0px 0px 0px 1px inset | none; rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.9) 0px 0px 0px 1px, rgba(255, 255, 255, 0.4) 0px 0px 0px 1.5px inset, rgba(0, 0, 0, 0.45) 0px 25px 20px -20px; rgba(0, 0, 0, 0.25) 1px 10px 5px 1px; rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px; color(srgb 1 1 1 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; rgba(0, 0, 0, 0.3) 0px 2px 6px 0px; color(srgb 0.733333 0.745098 0.74902 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; color(srgb 0.12549 0.12549 0.12549 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; color(srgb 0.807843 0.811765 0.815686 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; color(srgb 0.815686 0.847059 0.898039 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; color(srgb 0.901961 0.929412 0.952941 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; color(srgb 0.678431 0.729412 0.780392 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; color(srgb 0.741176 0.576471 0.976471 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; color(srgb 0.0980392 0.0980392 0.0980392 / 0.16) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.24) 0px 1px 3px 0px; rgba(0, 0, 0, 0.3) 0px 1px 2px 0px; rgba(0, 0, 0, 0.4) 0px 30px 55px 0px; color(srgb 0 0.6 1 / 0.12) 0px 0px 0px 3px; rgb(0, 153, 255) 0px 0px 0px 2px inset; rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 10px 0px; rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px | DOM clusters | measured |

## Diff against kit semantic contract

Counts apply to semantic role pairs, once across both modes. Same requires equal normalized colours in both modes. All mappings are inferred. Kit values are read locally. Preview values are measured custom properties. Only-preview and only-kit mean no mapping in this table. Static scale tokens are compared separately below.

same = 2, different = 21, only-preview = 24, only-kit = 20.

| Kit token | Preview role | Dark preview / kit | Light preview / kit | Status |
| --- | --- | --- | --- | --- |
| background | background | #0f0f10 / #000 | #f7fafc / #fff | different |
| foreground | baseText | #ededed / #fff | #4a5568 / #000 | different |
| accent1 | none | — / #111111 | — / hsl(0, 0%, 97.3%) | only-kit |
| accent2 | none | — / #1d1d1d | — / hsl(0, 0%, 95.1%) | only-kit |
| accent3 | none | — / #232323 | — / hsl(0, 0%, 93.0%) | only-kit |
| accent4 | none | — / #282828 | — / hsl(0, 0%, 90.9%) | only-kit |
| accent5 | none | — / #2B2B2B | — / hsl(0, 0%, 85.8%) | only-kit |
| accent6 | none | — / #3e3e3e | — / hsl(0, 0%, 56.1%) | only-kit |
| accent7 | none | — / #505050 | — / hsl(0, 0%, 52.3%) | only-kit |
| accent8 | none | — / #707070 | — / hsl(0, 0%, 43.5%) | only-kit |
| accent9 | none | — / #7e7e7e | — / #1d1d1d | only-kit |
| accent10 | none | — / #a0a0a0 | — / #111111 | only-kit |
| brand | button-primary-backgroundColor | #09f / #0072F5 | #09f / #0072F5 | different |
| brandAccentActive | button-primary-activeColor | #07f / #0066dc | #07f / #0066dc | different |
| brandAccentHover | button-primary-hoverColor | #08f / #107fff | #08f / #107fff | different |
| brandSecondary | button-base-backgroundColor | #333 / #333333 | #e2e8f0 / hsl(0, 0%, 93.0%) | different |
| brandSecondaryAccentHover | button-base-hoverColor | #3e3e3e / #404040 | #cbd5e0 / #e0e0e0 | different |
| brandSecondaryAccentActive | button-base-activeColor | #505050 / #262626 | #a0aec0 / #d4d4d4 | different |
| brandSoft | button-primaryAlt-backgroundColor | #0099ff26 / #102A4CFF | #0099ff26 / #d8e9fd | different |
| brandSoftAccentActive | none | — / #0c1e37 | — / #a7cefb | only-kit |
| brandSoftAccentHover | button-primaryAlt-hoverColor | #007acc26 / #143661 | #007acc26 / #c0dbfc | different |
| brandLink | none | — / #5ca8ff | — / #00438f | only-kit |
| critical | button-danger-backgroundColor | #f56565 / #E03131FF | #f56565 / #E03131FF | different |
| criticalAccentActive | button-danger-activeColor | #c53030 / #d72020 | #c53030 / #d72020 | different |
| criticalAccentHover | button-danger-hoverColor | #e53e3e / #e34747 | #e53e3e / #e34747 | different |
| caution | none | — / #F08C00FF | — / #F08C00FF | only-kit |
| cautionAccentActive | none | — / #bd6e00 | — / #bd6e00 | only-kit |
| cautionAccentHover | none | — / #d77d00 | — / #d77d00 | only-kit |
| neutral | none | — / #424242 | — / #424242 | only-kit |
| neutralSoft | none | — / #f5f5f5 | — / #f5f5f5 | only-kit |
| formAccent | input-backgroundColor | #232323 / #232323 | #f3f3f3 / #f5f5f5 | different |
| formAccentBorder | input-borderColor | transparent / #333333 | transparent / hsl(0, 0%, 85.8%) | different |
| separator | divider | #252525 / #3e3e3e | #e2e8f0 / hsl(0, 0%, 90.9%) | different |
| dropdownBackground | listBox-panelBackground | #282828 / #282828 | #fff / #fff | same |
| dropdownBoxShadow | none | — / 0 1px #0000000d,0 4px 10px rgba(0, 0, 0, .3) | — / 0 1px #0000000d,0 4px 10px rgba(0, 0, 0, .1) | only-kit |
| dropdownBorder | none | — / #333333 | — / hsl(0, 0%, 90.9%) | only-kit |
| dropdownItemTextColor | listBox-textColor | #ededed / #fff | #2d3748 / #000 | different |
| dropdownItemHoverBackground | listBox-hoverBackgroundColor | #333 / #404040 | #f7fafc / hsl(0, 0%, 95.1%) | different |
| dropdownItemHoverTextColor | none | — / #fff | — / #000 | only-kit |
| dialogBackground | dialog-panelBackgroundColor | #1d1d1d / #1d1d1d | #fff / #fff | same |
| dialogBoxShadow | dialog-panelShadow | 0 10px 30px 0 #00000026, inset 0 0 0 1px #232323 / 0 1px #0000000d,0 4px 10px rgba(0, 0, 0, .3) | 0 10px 15px -3px #0000001a, 0 4px 6px -2px #0000000d / 0 1px #0000000d,0 4px 10px rgba(0, 0, 0, .1) | different |
| dialogTextColor | dialog-panelTextColor | #ededed / #fff | #2d3748 / #000 | different |
| dialogOverlayBackground | dialog-overlayBackgroundColor | #000000b3 / rgba(0,0,0,.7) | #0006 / #091e427d | different |
| bottomBar-backgroundColor | bottomBar-backgroundColor | #2b2b2b / — | #fff / — | only-preview |
| bottomBar-textColor | bottomBar-textColor | #a0a0a0 / — | #4a5568 / — | only-preview |
| button-base-textColor | button-base-textColor | #ededed / — | #2d3748 / — | only-preview |
| button-danger-textColor | button-danger-textColor | #fff / — | #fff / — | only-preview |
| button-primary-textColor | button-primary-textColor | #fff / — | #fff / — | only-preview |
| button-primaryAlt-textColor | button-primaryAlt-textColor | #09f / — | #09f / — | only-preview |
| descriptionTextColor | descriptionTextColor | #999 / — | #4a5568 / — | only-preview |
| dialog-titleBorderColor | dialog-titleBorderColor | #2b2b2b / — | #e2e8f0 / — | only-preview |
| dialog-titleTextColor | dialog-titleTextColor | #ededed / — | #2d3748 / — | only-preview |
| input-accentColor | input-accentColor | #505050 / — | #fff / — | only-preview |
| input-labelTextColor | input-labelTextColor | #ededed / — | #2d3748 / — | only-preview |
| input-labelTextHintColor | input-labelTextHintColor | #a0a0a0 / — | #4a5568 / — | only-preview |
| input-textColor | input-textColor | #ededed / — | #333 / — | only-preview |
| listBox-activeBackgroundColor | listBox-activeBackgroundColor | #07f / — | #09f / — | only-preview |
| listBox-activeTextColor | listBox-activeTextColor | #ededed / — | #fff / — | only-preview |
| panel-background | panel-background | #151516 / — | #fff / — | only-preview |
| panel-textColorAlt | panel-textColorAlt | #ccc / — | #666 / — | only-preview |
| panel-textColor | panel-textColor | #fff / — | #000 / — | only-preview |
| primary | primary | #63b3ed / — | #09f / — | only-preview |
| scrollBar-backgroundColor | scrollBar-backgroundColor | #505050 / — | #cbd5e0 / — | only-preview |
| scrollBar-hoverBackgroundColor | scrollBar-hoverBackgroundColor | #333 / — | #a0aec0 / — | only-preview |
| secondary | secondary | #edf2f7 / — | #edf2f7 / — | only-preview |
| snackbar-backgroundColor | snackbar-backgroundColor | #2b2b2b / — | #fff / — | only-preview |
| snackbar-textColor | snackbar-textColor | #fff / — | #333 / — | only-preview |

## Gaps

- dark: no role=tooltip appeared after Settings hover; title/native tooltips cannot be read with getComputedStyle
- light: no role=tooltip appeared after Settings hover; title/native tooltips cannot be read with getComputedStyle
- Raw DOM sampling includes elements outside overflow-clipped accordion content. Use dedicated frame and frame-number views for Frame, and the named visible overlay for overlay interpretation. Ancestor containers and code-theme miniature colours remain in frequency clusters; those frequencies are observations, not proposed semantic tokens.
- Keyboard Tab sampling covers eight successive focus stops per view, not every control. Range thumb and track pseudo-elements are not captured. Native tooltip contents, hover/pressed states, animation keyframes, and OS focus rendering are not exhaustively measured.
- Theme attributes are switched directly. Appearance radio selection retains its initial app state. The screenshots prove CSS theme rendering, not persisted colour-mode preference.
- The preview build has no verified source SHA. Source cross-check uses the existing origin/main ref without fetching. Semantic mapping between differently named contracts is inferred. Only-kit means no mapped CodeImage semantic role, not absence of that colour in the rendered application.

## Control measurements

Every row below is measured. JSON controlTokens contains all requested CSS properties for each matched node. Missing nodes are null. Colour-mode selected and idle labels refer to retained radio state during direct CSS switching.

| Token | Dark | Light | Source | Label |
| --- | --- | --- | --- | --- |
| ghost | bg rgba(0, 0, 0, 0); text rgb(255, 255, 255); radius 9px; height 36px; padding 0px | bg rgba(0, 0, 0, 0); text rgb(0, 0, 0); radius 9px; height 36px; padding 0px | shell-themes-frame | measured |
| export primary | bg rgb(0, 114, 245); text rgb(238, 238, 238); radius 9px 4px 4px 9px; height 36px; padding 0px 16px | bg rgb(0, 114, 245); text rgb(238, 238, 238); radius 9px 4px 4px 9px; height 36px; padding 0px 16px | shell-themes-frame | measured |
| split arrow | bg rgb(0, 114, 245); text rgb(238, 238, 238); radius 4px 9px 9px 4px; height 36px; padding 0px | bg rgb(0, 114, 245); text rgb(238, 238, 238); radius 4px 9px 9px 4px; height 36px; padding 0px | shell-themes-frame | measured |
| theme card | bg rgb(35, 35, 35); text rgb(237, 237, 237); radius 16px; height 160.375px; padding 8px | bg rgb(255, 255, 255); text rgb(74, 85, 104); radius 16px; height 160.375px; padding 8px | shell-themes-frame | measured |
| theme search | bg rgb(35, 35, 35); text rgb(237, 237, 237); radius 9px; height 36px; padding 0px 12px | bg rgb(245, 245, 245); text rgb(74, 85, 104); radius 9px; height 36px; padding 0px 12px | shell-themes-frame | measured |
| theme segmented item | bg rgba(0, 0, 0, 0); text rgb(255, 255, 255); radius 7px; height 28px; padding 0px | bg rgba(0, 0, 0, 0); text rgb(0, 0, 0); radius 7px; height 28px; padding 0px | shell-themes-frame | measured |
| frame row | bg rgba(0, 0, 0, 0); text rgb(204, 204, 204); radius 0px; height 18px; padding 0px | bg rgba(0, 0, 0, 0); text rgb(102, 102, 102); radius 0px; height 18px; padding 0px | frame | measured |
| radius segmented | bg rgba(0, 0, 0, 0); text rgb(255, 255, 255); radius 7px; height 28px; padding 0px | bg rgba(0, 0, 0, 0); text rgb(0, 0, 0); radius 7px; height 28px; padding 0px | frame | measured |
| slider | bg rgba(0, 0, 0, 0); text rgb(16, 16, 16); radius 0px; height 36px; padding 0px | bg rgba(0, 0, 0, 0); text rgb(16, 16, 16); radius 0px; height 36px; padding 0px | frame | measured |
| select row | bg rgba(0, 0, 0, 0); text rgb(255, 255, 255); radius 9px; height 36px; padding 0px 16px | bg rgba(0, 0, 0, 0); text rgb(0, 0, 0); radius 9px; height 36px; padding 0px 16px | frame | measured |
| settings dialog | bg rgb(29, 29, 29); text rgb(255, 255, 255); radius 14px; height 680px; padding 0px | bg rgb(255, 255, 255); text rgb(0, 0, 0); radius 14px; height 680px; padding 0px | settings-appearance | measured |
| nav active | bg rgb(35, 35, 35); text rgb(237, 237, 237); radius 10px; height 36px; padding 0px 10px | bg rgb(255, 255, 255); text rgb(74, 85, 104); radius 10px; height 36px; padding 0px 10px | settings-appearance | measured |
| nav idle | bg rgba(0, 0, 0, 0); text rgb(153, 153, 153); radius 10px; height 36px; padding 0px 10px | bg rgba(0, 0, 0, 0); text rgb(74, 85, 104); radius 10px; height 36px; padding 0px 10px | settings-appearance | measured |
| selected option card | bg rgb(35, 35, 35); text rgb(237, 237, 237); radius 12px; height 138.188px; padding 12px | bg rgb(255, 255, 255); text rgb(74, 85, 104); radius 12px; height 138.188px; padding 12px | settings-appearance | measured |
| idle option card | bg rgb(35, 35, 35); text rgb(237, 237, 237); radius 12px; height 138.188px; padding 12px | bg rgb(255, 255, 255); text rgb(74, 85, 104); radius 12px; height 138.188px; padding 12px | settings-appearance | measured |
| default badge | bg rgb(51, 51, 51); text rgb(153, 153, 153); radius 6px; height 16px; padding 1px 6px | bg rgb(226, 232, 240); text rgb(74, 85, 104); radius 6px; height 16px; padding 1px 6px | settings-appearance | measured |
| settings search | bg rgb(35, 35, 35); text rgb(237, 237, 237); radius 9px; height 36px; padding 0px 12px 0px 34px | bg rgb(245, 245, 245); text rgb(74, 85, 104); radius 9px; height 36px; padding 0px 12px 0px 34px | settings-appearance | measured |
| export panel | bg rgb(29, 29, 29); text rgb(237, 237, 237); radius 18px; height 581.984px; padding 16px 12px 8px | bg rgb(255, 255, 255); text rgb(74, 85, 104); radius 18px; height 581.984px; padding 16px 12px 8px | export | measured |
| command panel | bg rgb(29, 29, 29); text rgb(237, 237, 237); radius 22px; height 300px; padding 8px | bg rgb(255, 255, 255); text rgb(74, 85, 104); radius 22px; height 300px; padding 8px | commands | measured |

## Static scale diff

These comparisons are inferred from measured controls and read kit foundation/tokens.ts and sizes.ts. They are separate from the semantic colour-contract counts.

| Role | Preview | Kit | Status |
| --- | --- | --- | --- |
| Header control height | 36px | sm 36px | same |
| Header type | 14px | sm 0.875rem = 14px at 16px root | same |
| Search radius | 9px | sm 9px | same |
| Segmented item radius | 7px | xs 7px | same |
| Theme card radius | 16px | no 16px radius, md 12px and lg 14px | only-preview |
| Theme card type | 13px | xs 12.8px and sm 14px | only-preview |
| Segmented item height | 28px | minimum xs 30px | different |
| Spacing | observed 4, 8, 12, 16px | spacing 1, 2, 3, 4 | same |
| Motion curve | cubic-bezier(0.23, 1, 0.32, 1) on new controls | no easing token | only-preview |
| Motion duration | 0.12s on new controls, legacy lists include 0.2s and 0.15s | no duration token | only-preview |
| Settings keyboard outline | 2px solid primary, offset in raw focus samples | boxShadow.outline is 3px rgba(66,153,225,.5) | different |

These are role comparisons, not a claim that every observed dimension is a reusable token. Control heights, typography, shadows, borders, and focus samples remain available in full in JSON.

## Largest drifts

1. Surface hierarchy is inferred to differ. Measured CodeImage background is #0f0f10 dark and #f7fafc light, against read kit #000 and #fff. The measured dark island token is #151516.
2. Accent roles are inferred to differ. Measured CodeImage primary button token is #0099ff in both modes, against read kit brand #0072f5. The measured dark general primary token is a third colour, #63b3ed.
3. Overlay depth is inferred to differ. Measured CodeImage dialog shadow uses a 30px dark blur plus inset edge, against the read kit 10px dark dropdown-style shadow. The light CodeImage shadow has two layers with 15px and 6px blur.
