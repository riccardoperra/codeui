# Inkstone

Inkstone is the design language of `@codeui/kit` and CodeImage. This file is the specification. Read it before you build or change any interface that uses the kit, in this repository or in an app.

- **This file says what to do.** Each rule has a one-line reason. The documentation site (`apps/docs/content/docs/design/`) explains the reasoning at length, with examples.
- **It ships with the package** as `node_modules/@codeui/kit/DESIGN.md`, so an app reads the version that matches its kit. An app's own `DESIGN.md` starts from this file and records only its product decisions.
- **CodeImage is the reference app.** When CodeImage and this file disagree, open an issue and fix one of them. Do not copy the drift.

Rules are plain statements. **Proposed** marks a rule that the kit or CodeImage does not follow yet. Token names are the `--cui-*` custom properties from `@codeui/kit/theme.css`.

## The idea

An inkstone is the matte, dark stone on which ink is ground. Its surface is carved into wells, and the ink is the only thing on it that shines.

In Inkstone, the interface is the stone and the user's work is the ink. The interface stays dark, matte and steady, so the user's work is the most vivid thing on the screen.

| Trait                                 | Not          | In practice                                                                                           |
| ------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------- |
| **Carved**                            | stacked      | Islands are recessed into the page: darker than it, borderless, with no shadow.                       |
| **Matte**                             | glossy       | No glass, blur, gradients or glow on the interface. Colour and effects belong to the user's content.  |
| **The work moves, controls respond**  | lively       | The content changes smoothly. Controls answer in 120ms or not at all. The keyboard is never animated.  |
| **One signal**                        | colourful    | Neutral greys. One blue for focus, selection, "on", "new" and the single primary action.              |
| **Roomy**                             | dense        | 36px controls, a 360px panel, one open section. Fewer things, each easy to hit.                       |
| **Exact**                             | approximate  | Concentric radii, tabular numbers, reserved widths. Nothing shifts by a pixel.                         |

When a case is not covered below, choose the option that best fits these six traits.

## 1. Principles

1. **The work is the product.** The user's content stays in view and stays still. Nothing that opens moves, resizes or rezooms it.
2. **Islands, not lines.** Controls sit on rounded islands. Space and a change of fill separate groups, not borders.
3. **Relaxed density.** When a panel is full, remove something or move it one click away. Do not shrink it.
4. **Overlay, don't reflow.** Pickers, menus and toolbars open over the layout.
5. **Nothing jumps.** Labels reserve their widest value, cards reserve their text height, the primary action keeps its place.
6. **Colour is a signal.** See §2.3.
7. **Preview, then commit.** Hover or keyboard highlight previews on the content. Click or Enter saves. Escape restores.
8. **One component per pattern, one place per thing.** One settings dialog, one export control, one command menu. Layouts place them; none owns a copy.
9. **Keyboard first, keyboard instant.** Everything works from the keyboard, and nothing opened from the keyboard animates.

## 2. Colour

### 2.1 Surfaces

The page is the lighter surface. Islands are carved into it.

| Level    | Use                                                       | Dark                      | Light               | Token today                |
| -------- | --------------------------------------------------------- | ------------------------- | ------------------- | -------------------------- |
| Page     | Behind everything. The header sits directly on it          | `#151516`                 | `#fff`              | `--cui-surface-panel`      |
| Island   | Content area, side panel, settings group                  | `#0f0f10`                 | `#f7fafc`           | `--cui-surface-canvas`     |
| Inset    | The open section inside an island                         | `#151516`                 | `#fff`              | `--cui-surface-panel`      |
| Field    | Field, tile, card, hovered or selected row                | `#232323`                 | `#f3f3f3`           | `--cui-surface-input`      |
| Floating | Menu, popover, command menu, dialog, floating bar         | `#1d1d1d` + ring + shadow | `#fff` + shadow     | `--cui-surface-dialog`     |

- A surface sits on the level below it. A field goes on an island, not on the page.
- State is a step of fill: hover raises one step, selected raises one step. Pressed changes the fill and keeps the hover radius.
- A selected card differs from its island by fill **and** an accent ring, not by the ring alone.
- User content never uses these tokens.
- The token names are inverted today: `surface-canvas` is the island and `surface-panel` is the page. Use the table, not the names. **Proposed:** rename to `surface-page`, `surface-island`, `surface-field`, `surface-floating`.

Why: a bordered, compact build was rejected for "un layout più unito e a isole". Fill steps group content without drawing lines that compete with it.

### 2.2 Text

| Tone      | Use                                                             | Dark      | Light (proposed) |
| --------- | --------------------------------------------------------------- | --------- | ---------------- |
| Primary   | Titles, row titles, values the user set, the selected item      | `#ededed` | `#1a202c`        |
| Secondary | Descriptions, summaries, hints, unselected nav, metadata        | `#999`    | `#4a5568`        |
| Disabled  | Unavailable controls                                            | `#666`    | `#a0aec0`        |

- Most text is secondary. Primary marks what matters or what is selected.
- Hierarchy comes from tone, then weight, then size.
- Accent text is only for links and inline text actions.
- Do not add a new grey. The kit's `#ccc`, `#a0a0a0`, `#fff` text tokens and the `#404040` segment fill alias these roles.
- Light mode must keep the order. Today light `text-default` and `text-muted` are both `#4a5568`, and CodeImage shows row labels in black under grey section titles. Both are bugs.

### 2.3 Accent

The accent is never a surface or a large fill. It has five uses:

| Use                                | Shape                                    |
| ---------------------------------- | ---------------------------------------- |
| Keyboard focus                     | 2px ring, 2px offset                     |
| Selected card                      | 2px ring                                 |
| On, active                         | Switch track, open-section icon, check, 15% wash |
| New, unread                        | 6–7px dot                                |
| The one primary action per surface | Filled button                            |

- One filled accent button per surface.
- A selected row in a list, menu, command menu or nav is neutral: field fill and primary text. Never an accent fill.
- "On" uses the soft wash. "Do" uses the filled button. Two same-shaped blue controls side by side read as one.
- Accent on user content must not read as semantic red or green.
- Filled buttons use `--cui-action-brand-base` (`#0070f0`, 4.6:1 with white text). `#0099ff` is for rings, dots and washes only, because white text on it is 3.0:1.

### 2.4 Status

Danger, caution and success mark states the user must notice. They never decorate or label a category. Danger fills only the confirm button of a destructive dialog. Errors pair colour with an icon.

### 2.5 Lines

A line is allowed only where a fill would vanish:

1. the 1px inner ring of a floating surface in dark mode;
2. a focus or selection ring;
3. a ring around a colour fill that could match its background (swatch, orb, avatar), neutral at 16–35% alpha.

No line between islands, around a field, between rows or around an unselected card. A split button is two parts with a 2px gap and 4px inner corners.

## 3. Typography

- **Interface font:** Inter, with `font-feature-settings: "cv02", "cv03", "cv04", "cv11"`. The app loads it with `font-display: swap`. One family name everywhere (`--cui-font-family-sans`).
- **Code:** the user's chosen monospace; JetBrains Mono by default. Chrome uses `--cui-font-family-mono` only for code, paths and hex values.
- **Base:** 13px, line height 1.5.

| Step    | Size  | Line height | Weight  | Use                                                     | Token                     |
| ------- | ----- | ----------- | ------- | ------------------------------------------------------- | ------------------------- |
| Micro   | 11px  | 1.2         | 500     | Badge, tag, keycap. One word                            | `--cui-font-size-badge`   |
| Meta    | 12px  | 1.4         | 400     | Description, summary, group label (at 600)              | `--cui-font-size-xs`      |
| Base    | 13px  | 1.5         | 400     | Running text, row labels inside a section               | `--cui-font-size-caption` |
| Label   | 14px  | 1.3         | 500/600 | Row title, menu item, nav item, button, section header  | `--cui-font-size-sm`      |
| Title   | 16px  | 1.3         | 600     | Group title, breadcrumb, phone input text               | `--cui-font-size-md`      |
| Display | 18px+ | 1.2         | 600     | Sheet titles and announcements only                     | `--cui-font-size-lg`+     |

- Never below 11px.
- Weights 400, 500, 600 only. 400 reads, 500 acts, 600 heads.
- A selected option may go from 500 to 600 only if its box reserves the 600 width.
- Tracking `normal` up to 16px; `-0.01em` to `-0.02em` on display type. No uppercase labels.
- Sentence case everywhere. A label is a noun or short verb phrase. A hint is one line. A badge is one word.
- Changing numbers use `font-variant-numeric: tabular-nums`.
- Truncate values, never labels, to one line with an ellipsis, and keep the full text reachable (tooltip, accessible name).
- **Proposed:** `text-wrap: balance` on titles and short descriptions, `text-wrap: pretty` on paragraphs.
- Use `…`, `→`, `×`, `⌘` and curly quotes in rendered text.
- Phone inputs use 16px text, so iOS does not zoom.

## 4. Space

- 4px grid with 2px half steps: `2 · 4 · 6 · 8 · 12 · 16 · 24 · 32`. `10px` only inside compact controls.
- Inside a group < between groups. Title to description 2–4px; rows touch inside their group; groups 16–24px apart.
- More space above a heading than below it.

| Measure                                  | Value                          |
| ---------------------------------------- | ------------------------------ |
| Page inset and gap between islands       | 8px                            |
| Island padding                           | 12–16px                        |
| Header row                               | 36px; 40px at ≤768px           |
| Side panel                               | 360px                          |
| First item inside a 22px corner          | 16px from the edge             |

The header has no bar. It is the first row of islands, and its edges align with the islands below.

## 5. Shape

### 5.1 Radius

**Inner radius = outer radius − the padding between them**, floor 4px. Choose a radius by nesting level, not by component.

| Level                                                         | Radius | Token                  |
| ------------------------------------------------------------- | ------ | ---------------------- |
| Island, floating bar, command menu                            | 22px   | `--cui-radius-command` |
| Group inside an island, popover, dialog, nudge                | 16px   | `--cui-radius-card`    |
| Field inside a 22px surface                                   | 14px   | `--cui-radius-lg`      |
| Control: button, segmented track, option card, section header | 12px   | `--cui-radius-md`      |
| Row: menu row, nav item, segment, icon tile                   | 10px   | `--cui-radius-nav`     |
| Badge, tag, keycap                                            | 6px    | `--cui-radius-badge`   |
| Inner corners of a split control                              | 4px    | proposed               |
| Dot, switch, avatar, pill                                     | full   | `--cui-radius-full`    |

Today buttons are 9px, dialogs 14px and the toolbar 18px. **Proposed:** move them to the table; drop `xs` (7), `sm` (9) and `xl` (18).

### 5.2 Elevation

- Islands in the layout have no shadow.
- Floating surfaces have `--cui-shadow-dialog` and, in dark mode, a 1px inner ring.
- A surface revealed with `clip-path` uses `filter: drop-shadow()`.
- No backdrop unless the surface is modal.

## 6. Size

| Control                                                | Desktop  | Phone   |
| ------------------------------------------------------ | -------- | ------- |
| Button, field, select, segmented, menu row, nav item   | 36px     | 40–44px |
| Segment inside a segmented track                       | 28px     | 32px    |
| Command menu input                                     | 44px     | 44px    |
| Settings row                                           | min 56px | min 56px |
| Switch                                                 | 36×22    | 44×26   |

- Hit targets: 28px desktop, 40px phone. A small mark keeps a 24px hit box.
- A segmented control has a fixed height in any container, 84px per option in settings.
- Icons: one outline set; 16px in controls and rows, 14px in segments, 20px in a rail or phone tab bar; 6–8px from their label.
- A row has a fixed 20px leading slot, so text aligns with or without an icon.
- An icon-only button has an accessible name and a kit Tooltip covering its whole hit area.

## 7. Motion

Inkstone motion follows Emil Kowalski's interface rules, with Apple's rules for gestures. The content changes smoothly; controls respond fast; the keyboard is instant.

### 7.1 Should it animate?

| How often                        | Decision                                    |
| -------------------------------- | ------------------------------------------- |
| Keyboard action, or 100+ a day   | Never. Command menu, shortcuts, Escape, arrow keys, play/pause |
| Tens a day                       | 120ms or nothing. Hover, press, switch, segment in a working panel |
| Occasional                       | Standard. Popover from a click, dialog, sheet, accordion |
| Rare                             | May delight. What's new, onboarding, first export |

If you cannot name the purpose (feedback, origin, state change, avoiding a jump, explanation), do not animate.

### 7.2 Tokens

| Token                          | Value                              | Use                                     |
| ------------------------------ | ---------------------------------- | --------------------------------------- |
| `--cui-motion-ease-out`        | `cubic-bezier(0.23, 1, 0.32, 1)`   | Enter, respond, default                 |
| `--cui-motion-ease-in-out`     | `cubic-bezier(0.77, 0, 0.175, 1)` (proposed) | Something moving across the screen |
| `--cui-motion-ease-drawer`     | `cubic-bezier(0.32, 0.72, 0, 1)` (proposed)  | Sheets and drawers         |
| `--cui-motion-duration-fast`   | 120ms                              | Press, switch, colour, exit             |
| `--cui-motion-duration-normal` | 160ms                              | Tooltip, small popover                  |
| `--cui-motion-duration-panel`  | 200ms                              | Accordion, popover, content change      |
| `--cui-motion-duration-slow`   | 260ms                              | Clip reveal; ceiling for a control      |

### 7.3 The movements

| Name               | Where                                        | Recipe                                                                         |
| ------------------ | -------------------------------------------- | ------------------------------------------------------------------------------ |
| **Press**          | Buttons, cards                               | `scale(0.97)` (cards `0.98`), 120ms ease-out, on pointer-down                  |
| **Toggle**         | Switch                                       | Thumb `transform` 120ms ease-out; track colour 120ms                           |
| **Pop**            | Popover, menu, tooltip opened by pointer     | In from `scale(0.96)` + fade, 160–180ms; out to `scale(0.98)`, 120ms; `transform-origin` at the trigger |
| **Expand**         | Accordion                                    | `height` + `opacity` 200ms ease-out, retargets mid-way; chevron rotates in step |
| **Morph**          | The content after a value changes            | The changed property (radius, colour, theme) 150–200ms                         |
| **Collapse to origin** | Closing something that lives on elsewhere | Scale and move into where it can be found again, 200ms ease-out (What's new → nudge) |
| **Rise**           | Corner card, toast                           | From the edge, 400ms `ease`; leave 200ms                                        |
| **Reveal**         | A surface growing in place                   | `clip-path`, 260ms ease-out                                                     |
| **Slide**          | Phone sheet                                  | `translateY(100%)` → 0, 280ms drawer curve; out 150–200ms; tracks the finger 1:1 when dragged |
| **Ring**           | Selection ring                               | `scale(0.92)` → 1 with fade, 200ms                                              |

Rules for every movement:

- Ease-out for anything entering or responding. Never `ease-in` on UI. `ease-in-out` only for something moving across the screen.
- Exits are faster than entrances and go back toward their origin.
- Animate `transform`, `opacity` and `clip-path`. `height` only for the accordion.
- Use transitions, not keyframes, so motion can be interrupted and reversed. Keyframes only for one-shot entrances.
- Never start from `scale(0)`.
- After the first tooltip opens, the next ones open with no delay and no animation.
- Group entrances stagger 30–80ms per item, and never block input.
- Illustrations play once, under 850ms, then rest.
- Drags track the pointer 1:1 from where it was grabbed, hand their release velocity to the settle animation, and rubber-band at the edges.
- Keyboard-only rules read the last input from `<html data-cui-input>` (`keyboard` or `pointer`), not `:focus-visible`: a script focus after a click reports `:focus-visible` to a mouse user.
- Reduced motion keeps opacity and colour, drops movement and scale.
- Hover styles only under `@media (hover: hover) and (pointer: fine)`.
- **No materials.** Unlike Apple's design language, Inkstone has no translucency or `backdrop-filter` on the interface. Matte is a trait.

The kit's own motion is slower than these rules today: buttons press in 200ms `ease`, the focus ring transitions with `ease-in`, and the dialog enters with a 250ms `ease-in-out` keyframe. **Proposed:** move them to Press, a 120ms colour change, and Pop with transitions.

## 8. Layout

```
┌──────────────────────────────────────────────────────────────┐
│ ◧ Name                       ⌘K  ⚙   [ Export ][▾]  [ … ]     │  header on the page, no bar
│ ┌──────────────────────────────────────────┐ ┌─────────────┐ │
│ │                                          │ │ ▾ Section … │ │
│ │          content island (still)          │ │ ┌─────────┐ │ │  side panel island, 360px
│ │                                          │ │ │  inset  │ │ │
│ │           ( floating toolbar )           │ │ └─────────┘ │ │
│ └──────────────────────────────────────────┘ └─────────────┘ │
└──────────────────────────────────────────────────────────────┘
  8px inset · 8px gap · 22px island radius
```

- Chrome has fixed sizes. The content takes the rest.
- A read-only view draws no container for controls it does not show.
- **Accordion:** one section open; header is icon, title, secondary summary on the right, chevron; 36px, Label 600, radius 12; icon turns accent when open; everything in an open section is visible.
- **Floating bar:** takes no layout space; its menus open over it; labels keep a minimum width; rarely used actions go to the command menu.
- **Modes** that change what the user is doing (CodeImage's Animate timeline) are the one open question: today the timeline takes canvas space and moves the frame. Until decided, a mode may take space, but entering and leaving it must not rezoom the content.
- **Responsive:** `max-width: 768px` is a phone (`min-width: 769px` the reverse; nothing else). On a phone a panel becomes a bottom sheet with a 36×4 grip, sections become tabs, timelines become lists, and header actions must fit the width.
- Check 1440×900, 1024×768 and 390×844, with visible and overlay scrollbars.

## 9. Patterns

### 9.1 Choosing a control

| The choice                                     | Use                                         |
| ---------------------------------------------- | ------------------------------------------- |
| On or off                                      | Switch                                      |
| 2–4 short options, changed while working       | Segmented control                           |
| Several options where seeing them helps        | Option cards, three across                  |
| Many options known by name                     | Select; Combobox when it needs search       |
| A number in a useful range                     | Slider and a number field                   |
| A value set by dragging                        | The drag and a typed input                  |
| An action                                      | Button; icon button with tooltip in a bar   |

- Inside a modal dialog use segmented, switch or cards, not Select.
- Never a dropdown to manage things the user is building. Use inline affordances.

### 9.2 Settings row

Title (Label 500, primary) and one-line description (Meta, secondary) on the left, control on the right. Min 56px, padding 8px 16px. Rows touch inside one group island with 6px vertical padding. Below 900px the control drops under the text.

### 9.3 Settings dialog

Two panes: a 232px left pane with search and 36px nav items (radius 10, Label 500; current item gets field fill, not accent), and the rows. Breadcrumb title, close button, no footer. Every section reachable from the command menu. Choices not yet default live in Experiments with a `Default` tag and one "Restore defaults".

### 9.4 Option card

No border; field fill, radius 12, padding 12; a 68px preview well (radius 8) over a Label name. Selected: fill one step up and `outline: 2px solid` accent with `outline-offset: -2px`. A preview is a schematic in the option's own colours, not a miniature of real content.

### 9.5 Overlays

| Overlay      | When                                   | Backdrop | Focus                                |
| ------------ | -------------------------------------- | -------- | ------------------------------------ |
| Tooltip      | Name an icon, explain a value          | None     | Opens on hover and keyboard focus    |
| Popover      | Pick a value for one row               | None     | Moves in, returns to the trigger     |
| Menu         | Choose an action                       | None     | Moves in, returns to the trigger     |
| Command menu | Find anything by name                  | None     | Trapped, returns on close            |
| Sheet        | A panel on a phone                     | None     | Trapped                              |
| Dialog       | Settings, or a decision that blocks    | Scrim    | Trapped, returns on close            |

- A picker opens anchored to its row, over the panel that holds it: 360px, radius 16, padding 16.
- A dialog is for settings and for blocking decisions, not for confirming something undoable.
- Escape closes the innermost layer only.
- Scrollbars inside overlays set `scrollbar-color`; never mix it with `::-webkit-scrollbar`.

### 9.6 Command menu

`Mod+K` everywhere. Bottom centre, 16px from the edge, `min(640px, …)`, radius 22, padding 8, six 36px rows, no scrim. Grouped under Meta 600 labels. The highlighted row has field fill, previews on the content, Enter applies, Escape restores. A one-line hint in the input row: `↑↓ preview · ↵ apply · esc cancel`. It lists every visible option, action and setting, read from the same data as the controls.

### 9.7 Actions in dialogs and toasts

Close and Confirm on the right; a tertiary action is a small ghost icon button on the left. No full-width buttons on desktop. A toast action is an inline text action. On a phone the footer stacks.

### 9.8 Tag and keycap

- **Tag:** `1px 6px`, radius 6, neutral fill, Micro 500, secondary tone, one word.
- **Keycap:** Micro, secondary tone, field fill, radius 6, min width 20px. One style everywhere.

### 9.9 New things

A 6–7px accent dot on the new control, at most three in the app, never animated. A release announcement is a small corner card once per release; a large showcase only for a big one; never a blocking dialog.

### 9.10 Empty, loading, error

A loading control swaps its icon for a spinner and keeps its width. A loading region shows a skeleton of the content in place. An empty state names what is missing and offers the one action that fixes it. An error says what happened and what to do, where it happened.

## 10. Accessibility

- Contrast 4.5:1 for text up to 18px; 3:1 for large text, icons, rings and control edges. Both themes.
- Every control works from the keyboard. Pickers and cards open with Enter and Space. Lists preview on focus as on hover.
- One focus ring: 2px, 2px offset, `--cui-focus-color`, on `:focus-visible`.
- Closing an overlay returns focus to its trigger. Closing a corner card moves focus to the next control, never into a text field.
- A dialog on a phone does not focus a text field on open.
- Every icon button and field has an accessible name.
- Colour is never the only signal.
- Chrome is the reference browser; check Firefox and Safari once per change.

## 11. Rejected

Do not propose these again without a new reason.

| Rejected                                              | Instead                                       |
| ----------------------------------------------------- | --------------------------------------------- |
| Compact bordered panels, 28px rows, 300px panel       | Islands, 36px rows, 360px panel               |
| Several accordion sections open                       | One open                                      |
| "More / Less" inside a section                        | Everything visible                            |
| Inline dropdowns that push content                    | Anchored overlays                             |
| A dock that takes its own row                         | A floating bar                                |
| A dimmed modal for a picker                           | No backdrop                                   |
| Tiny real-content thumbnails; palette strips          | A schematic in the option's colours           |
| Full-width buttons in toasts and dialogs              | Inline action; ghost tertiary on the left     |
| A floating chip with × over the content               | An affordance beside the content              |
| Dropdowns to manage steps                             | Inline cards, direct manipulation             |
| Draggable bezier handles                              | Read-only curve and a typed value             |
| A blocking "What's new" dialog; a "7 new things" toast | Corner card, dots, archive                   |
| Native SVG `title` as a tooltip                       | The kit Tooltip                               |
| Glass, blur, dot grids as decoration                  | Matte surfaces                                |
| Text under 11px                                       | 11px minimum                                  |

## 12. Review checklist

- [ ] The content stays still when anything opens; previews do not reflow anything.
- [ ] No new borders; fills follow §2.1.
- [ ] Accent only for focus, selection, on, new and one primary action; selected rows are neutral.
- [ ] Text from §3, at least 11px, weights 400/500/600, mostly secondary.
- [ ] Radii follow nesting.
- [ ] Controls 36px (phone 40–44px); targets ≥28px desktop, ≥40px phone.
- [ ] Tabular numbers; truncated text reachable.
- [ ] Motion named in §7.3; ease-out; ≤260ms for controls; nothing from the keyboard; reduced motion handled.
- [ ] Keyboard works, focus visible and returned, Escape closes one layer.
- [ ] Dark and light at 1440×900, 1024×768, 390×844.
- [ ] Values from `--cui-*` tokens; any literal explained in the pull request.

## 13. Changing a rule

1. Build the alternative next to the current one (a flag in the app, a story in the kit).
2. Check it in both themes at the three sizes.
3. If the maintainer picks it, make it the default, delete the loser, and update this file and the matching docs page in the same pull request.
