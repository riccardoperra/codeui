# Phase 0: UI decisions from recent CodeImage threads

Source: T3 threads in the CodeImage project, read on 2026-11-16. These threads record intent, not specification. The code is the truth. Where a thread says something "is" in the app, check the code before relying on it.

Quotes are the maintainer's own words, in the original language. Agent claims are marked "(agent)". Dates are thread creation, with the last activity in brackets.

Threads read in full or by user message:

1. Rivedere la UX dell'animazione, `807b78b8`
2. CodeImage Features for 2026, `309d19ea`
3. Pianificare animazioni del codice, `10ec5855`
4. Unificare Appearance tra Studio e Inspector, `0fee906b`
5. Codebase and UI Modernization Review, `89d0f070`
6. Whats New Redesign, `abb87724`
7. Code Highlight Marks and Focus UX, `2c940dbf`
8. Esplorare nuovi stili per la finestra codice, `7c295394`
9. Fix Kobalte keyboard freeze (Sol), subagent of `10ec5855`

Not read: "What's new: architettura e semplificazione", "Rifinire watermark e anteprime stile" (`0a1e995b`), "Align Takumi Export with New Editor" (`bf9c7f53`), "Spot motion design CodeImage 2026" (`ad51ce27`). The last two are renderer and marketing work. The first two may hold more What's new and watermark decisions.

---

## 1. Rivedere la UX dell'animazione

`807b78b8-bbaa-4054-b9ed-6c38770ad4f0`, 2026-11-16 (last 2026-11-16). Prototype branch `proto/animate-tabs-timeline`, local only, not pushed.

**Components and patterns built**
- Animate timeline in three variants (Filmstrip cards, Track proportional blocks, Outline list). Track was removed. Filmstrip is "Cards", Outline is "List". Files: `apps/codeimage/src/components/Animation/timeline/Filmstrip.tsx`, `StepsMenu.tsx`, `state/editor/stepSources.ts`, `timelineGeometry.ts`.
- Cards/List view switch: a two-icon segmented control in the panel bar, not a dropdown option and not a global preference. Persisted per user. Hidden on phone, where List is forced.
- "+ Step" ghost card: dashed card, same size as a step card (136x96 px), shows the next step number and a one-line hint. Replaced a bare "+" icon.
- Floating canvas bar (`CanvasToolbar`) morphs into the transport when Animate opens: play, time, Cards/List, Current tab. The Animate button stays in place, turns pressed/blue, tooltip "Close Animate (Esc)". Copy image comes back as an icon button with tooltip.
- Minimap on the top timeline bar: a window over the segments of the visible cards, draggable, with linked hover between segment and card. Tab boundaries shown as a 9 px gap instead of 3 px.
- Per-line gutter badges for script steps (`2→`, `1 only`, `◉3`), segmented "Enters / Leaves / Focus" group with icons, tooltips and pressed state.

**Maintainer decisions and rejections**
- "Non mi piacciono i drop per gestire gli step e inserirne di nuovi". Dropdown-based step management is rejected.
- "track é il peggiore e lo toglierei". Track timeline removed.
- On the view switch: "Possiamo prevedere un settings per modificarlo? magari anche un segmented control o tra le option con il dropdown". Agent chose segmented control in the bar, maintainer accepted.
- "per le icone usiamo anche il componente tooltip che abbiamo". Use the kit Tooltip, not native SVG title.
- "in modalità animate non conviene "modificare" il contenuto della floating bar ... far apparire quella anziché la dock?". The bar morph was adopted.
- "alcuni pulsanti sono troppo piccoli, si puó rendere piu una timeline comprensibile". Led to the sizing rules below.

**Token, spacing and motion rules stated (agent, accepted)**
- Hit targets at least 28 px on desktop, 40 px on phone. No text below 11 px. Labels 12 to 13 px. A 9.5 px label was called unreadable.
- Motion uses the app's existing strong ease-out from `WhatsNew/motion.ts`. No new curve.
- Add step or tab: enter from scale 0.96 with fade, 200 ms. Remove: exit 150 ms, gap closes 200 ms. Reorder: siblings move 180 ms, dropped item settles 200 ms. Selection ring slides 180 ms on click. Panel open: rise 8 px, 200 ms, mouse only.
- Bar morph: clip-path, not width, 220 ms. Old buttons out 90 ms. New controls staggered 190 ms each, 30 ms apart. Panel rise 200 ms with 60 ms delay. Close reversed at 150 ms. Old and new controls never visible together. Interruptible.
- No animation for keyboard-triggered open, Esc, command menu, play/pause, scrub, arrow-key selection, or anything frequent.
- Reduced motion keeps only the fade. Hover styles only on devices with a real pointer.
- WAAPI only, no motion library.

**Kit complaints**
- Kit `Tooltip` showed only over the icon, not the whole segment of a segmented control (agent).

**Open items**
- Two blue ▶ buttons side by side (play and pressed Animate). Pressed Animate needs a different icon or a neutral pressed state.
- In Dock layout the open bar is 504 px wide and wraps, so Animate moves. Needs a layout decision.
- Selection ring finds the card by step number, not id (bug).
- Engine changes for whole-line enter/leave are unbuilt. The prototype is not shippable.

---

## 2. CodeImage Features for 2026

`309d19ea-0bc7-47fb-a366-ea5b5bbce01b`, 2026-11-04 (last 2026-11-16). Mostly orchestration of PRs P1 to P11 (static export view, Takumi renderer, CLI, diff and highlight, secrets, social sizes, per-tab export, alt text). UI decisions below.

**Components and patterns built**
- Alt text action (P9, PR #693). First a full-width dark button in the toast and a full-width grey bar in the export dialog. Reworked into a small text action on the toast row in link colour, and a ghost icon button on the left of the export dialog footer. Close and Confirm stay right. At 390 px the action takes its own row above full-width Close and Confirm. Tooltip "Text for screen readers and social posts".
- Signature on the frame (PR #729, new UI only). Styles Minimal, Pill, Card. Optional social icon. Avatar in Card. Saved signatures, up to 3, stored in IndexedDB when logged out and in the DB when logged in. Clicking the handle on the canvas should open its settings.
- Line-mark gutter column (via thread 7). Replaced a floating "Focus ×" chip.

**Maintainer decisions and rejections**
- "i pulsanti messi cosi sono orrendi o sbaglio?". Full-width blocks inside toasts and dialogs are rejected.
- "non sono convintissimo del coso con la X messo cosi. mi sembra un po arraffazzonato". Floating chip over code rejected.
- "la firma nuova va solo sulla UI nuova". Signature ships only in the new UI.
- "la card grande con l'immagine ha loghi brutti ... Il minimal forse é troppo minimal?".
- "attenzione che forse cosi é brutto ... lo farei un po piu compatto? non mi sembrano allineate".
- "P10 -> considera che il classic lo stiamo rimuovendo". The classic editor is going away, so nothing in the kit needs to serve it.
- "mettiamo un limite di 3 firme".

**Token, spacing and motion rules**
- Toast actions are inline text actions, right-aligned with the message (agent, accepted).
- Tertiary dialog actions go in the footer, left, as small ghost buttons with icon (agent, accepted).

**Kit complaints**
- `@codeimage/ui` broke the Node SSR build: the barrel compiled for the DOM has no server `use`, and `createUniqueId` needed a fix (agent, P3). Anything rendered inside the export frame must render under Solid SSR.

**Open items**
- Mobile/phone layout of the new UI is tracked in GitHub issue #750.

---

## 3. Pianificare animazioni del codice

`10ec5855-38cc-4952-8fb3-5704bf72f7f8`, 2026-11-14 (last 2026-11-16). Animate panel in the new UI (PRs #734, #736, #766, #774, #776, #781, #782).

**Components and patterns built**
- Animate panel with a single proportional track: hold → transition → hold. Drag the right edge to resize, later segments shift. Scale stays fixed during drag. Click selects and shows the exact value in a number field. Ruler scrubs, body selects, a handle reorders. Arrows and Shift step values, Esc cancels, one drag is one undo step. Snap 100 ms, Alt for 10 ms.
- Easing popover: read-only curve with a dot following playback, presets Smooth `cubic-bezier(0.65,0,0.35,1)` (default), Snappy `(0.2,0,0,1)`, Strong `(0.77,0,0.175,1)`, Linear, plus a custom `cubic-bezier(...)` text field with y clamped to 0..1. `components/Animation/EasingCurve.tsx`.
- Preview/edit pill: "clicca o scrivi per modificare".
- Header select in the Animate panel: Current tab (default), Title only, All tabs. Persisted with the project.
- Phone: no draggable timeline. A step list plus an overview bar to scrub (PR #774).
- Export dialog gained MP4 (default) and GIF (gifenc), with fps chosen in the export dialog, not the Animate panel.

**Maintainer decisions and rejections**
- "come un app di grafica, quelle barre di index etc potrebbero essere in una timeline e ridimensionate ... va bene impostare anche i numeri fissi da textbox, ma darei entrambe le possibilitá". Every draggable value also has a numeric input.
- "Forse mostrerei solo la curva SENZA dare la possibilitá di customizzarla completamente (a meno che quello non lo permettiamo passando un valore custom da textbot, non da grafico)". No draggable bezier handles.
- "quando sei in modalitá animate, non si capisce che non puoi editare il testo dell'editor". Read-only state must be visible.
- Prototype picks: "a, a, b, a" (single track, pill, curve with dot, current tab only). "Ma teoricamente forse permetterei di scegliere con un flag, select". Agent limited the select to the header.
- Default transition: agent picked 700 ms; maintainer: "5 quello che dici te".
- "Io da telefono forse eviterei di fare la gestione animazione con timeline? ... se ci sono troppi elementi non si capisce niente".
- "noto che il dropdown con le easing sembra rotto, il grafico non si vede".
- "non soffermiamoci troppo su firefox e safari se danno problemi, l'importante é che su chrome funzioni bene". Chrome is the reference browser.
- "eviterei di fare sicuramente l'export su server".

**Token, spacing and motion rules**
- Phone buttons were 30 px tall instead of 40 px (agent finding, listed as a defect).

**Kit complaints**
- Kit Popover wraps its content in a `<p>`. With the app's grid popover CSS that `<p>` stretched, and a SegmentedField in `adapt` mode (`ui/SegmentedField/SegmentedField.tsx:64`) grew to about 200 px tall. The curve was 11% visible in 12 of 12 layout/theme/size combinations (agent, verified).
- A change to Esc handling closed the Settings dialog when Esc was pressed on a segmented control, app-wide (agent).
- Kobalte keyboard freeze, see thread 9. PR #782 worked around it by moving Animate triggers out of scroll containers.

**Open items**
- A cross-browser verification system is wanted ("dobbiamo predisporre un sistema per fare questo tipo di verifiche meglio").
- Timeline keyboard reachability for easing, duration and "Apply to all" was flagged and fixed in a later round; re-check in code.

---

## 4. Unificare Appearance tra Studio e Inspector

`0fee906b-66da-4ef1-b635-22373a553439`, 2026-11-16. PR #783, branch `refactor/appearance-panels`.

**Components and patterns built**
- One layout named **Sidebar** replaces Inspector and Studio. Dock stays separate. Code in `apps/codeimage/src/pages/UnifiedEditor/variants/sidebar/`: `index.tsx`, `Accordion.tsx`, `Rail.tsx`, shared `panels.tsx` and `places.ts`.
- Two preferences in Settings → Appearance, with illustrations: Navigation (Accordion or Rail) and Side (Left or Right). Illustration mirrors with the side. Stored as `panelNav`, `panelSide`. Page attributes `data-layout`, `data-panel-nav`, `data-panel-side`.
- Accordion header: icon (same as the rail icon, turns blue when open), title, current-value summary, chevron on the right. Header 36 px tall, 14 px text, hover background. Open section sits on a darker inner island. Single panel 360 px wide.
- Shared section content: groups with `PanelHeader` subheadings, `ControlRow` rows, presets reachable in both navigations.

**Maintainer decisions and rejections**
- "L'idea é che non abbia 800 versioni diverse della stessa cosa, per cui sarebbe importante anche unificare i vari componenti. Ok cambiare il wrapper, ma ... il modo in cui c'e all'interno vorrei che fosse sempre uguale".
- "lo stile dell'accordion forse era meglio prima. Probabilmente aggiungerei una icona al titolo dell'accordion come nel rail". The agent's separate-island restyle was rejected. The approved Inspector accordion is the base.
- "ibrido in realta non mi piace, lo trovo poco sensato". Hybrid rail plus accordion rejected.
- "ok il chevron lasciamolo".
- "Non sono sicurissimo che abbia senso togliere lo studio. o comunque la preferenza di vedere il rail". Rail stays as a preference.
- "Studio/Inspector sará il Default ... (diamoli un unico nome) ... la scelta ... deve finire su appearance. con le illustrazioni adatte".

**Open items**
- Three separate phone bottom sheets still exist. A second PR should unify them.
- Dock "More" does not yet use the shared section body.
- The rubber-band helper exists twice (`studio/index.tsx`, `dock/Sheet.tsx`).
- The "Theme" select in the Code section renders empty (agent, unverified on main).

---

## 5. Codebase and UI Modernization Review

`89d0f070-d8d5-4c8c-ab36-ac1b7e9aac1c`, 2026-11-14 (last 2026-11-15). Audit PR #703, new UI PR #711 (merged), cleanup #740, `DESIGN.md` #743, classic editor removed #754.

**Components and patterns built**
- New editor ("unified editor", `apps/codeimage/src/pages/UnifiedEditor/`) with layouts Inspector (default), Dock, Studio. Since thread 4 these are Sidebar and Dock.
- Compact header aligned to the island grid. Logo 16 px from the edge, because islands have a 22 px corner radius and flush content looked pushed into the corner.
- Settings dialog rebuilt as two columns with left navigation and search, modelled on a screenshot the maintainer supplied. Has an "Experiments" section (the reference called it "Labs"). Sections can open from the command palette. Dialog has role `alertdialog` (agent).
- Command palette (`Cmd+K`) in every layout, can open settings sections and run line-mark commands.
- Theme picker cards: five styles prototyped (Code, Orb, Aa list, Palette, Window). Window is the default. Palette removed. Code preview replaced. Window cards always two per row in a 360 px panel. Syntax colours come from the theme's `highlight` map in `defineEditorTheme`.
- Dock: floating, overlays the canvas, its menus are overlays.
- Export button exports a PNG immediately. A menu next to it holds "export with current format and scale", "one image per tab" and export settings. Export settings were merged into Settings.
- Inspector: one accordion section open at a time, all options visible inside (no "More/less" expander), animated expand 200 ms ease-out, interruptible, off under reduced motion. Inner pickers open as overlays inside the panel, never as a dimmed modal over the frame.
- Read-only snippet mode: the layout does not render containers for controls it hides, and the canvas takes the space (`DESIGN.md` rule, PR #768).

**Maintainer decisions and rejections**
- "devi farli piu simili alla realtá, quindi con l'header pronto, riutilizzando i componenti che abbiamo dei form".
- "mi sembra un po troppo compatto e con bordi, quando forse io preferisco un layout piu unito e a isole". The island layout is the design direction.
- "per quanto riguarda i temi riducendo a quello spazio non si capisce ... quale é il tema effettivo". Tiny code previews as theme thumbnails rejected.
- "Noto che il segmented control alcune volte ha la height che si rompe."
- "la editor-card "window" secondo me deve essere meno schiacciata".
- "era meglio che i "dropdown" interni venissero aperti in sovraimpressione overlay anziché sotto, perché altrimenti devi scrollare".
- "L'idea della command palette invece secondo me é utile a prescindere, non solo su Dock".
- "mi aspettavo che la dock non occupasse spazio potenzialmente e stesse in sovraimpressione, cosi come i dropdown che apre".
- "editor-cards: la modalitá code verrá sostituita, di default avremo sempre "window". il prototipo "palette" si puó togliere".
- "More/less frame options etc con l'expander non serve ... potrebbe aver senso introdurre delle animazioni di expand".
- "Non si distingue tantissimo il gruppo dal contenuto". Group headings must separate visually from content.
- "eviterei di mostrare la solida barra sopra in sovraimpressione per fare lo switch. dobbiamo emulare l'app vera".
- "Header e isola mi sembrano troppo staccati. Possiamo sistemare un po la modale dei settings?" then "le impostazioni dovrebbero andare bene a livello estetico".
- "va bene experiments".
- "forse il logo di codeimage é troppo attaccato a sx".
- "Lo stile della barra di scorrimento forse é ancora rotta in qualche punto, mi sembra che si vedesse bianca tipo nella modalitá dock".
- "Vorrei unire la parte di Export settings nei settings, in modo che ci sia un unico punto".
- "possiamo convertire con vanilla extract. direi che deve essere production ready". vanilla-extract stays the styling system; plain `.css` files in the prototype were converted (0 pixel diff on 122 views).
- "La versione Classic non serve più in teoria", then "Puoi iniziare a rimuovere l'editor classico".
- "Dobbiamo poi prendere le decisioni grafiche etc e pusharle nella repo per il futuro. Magari su design.md". `DESIGN.md` exists on CodeImage main.
- Initial brief: "valutare eventualmente la sostituzione di alcune librerie ... (solid 2.0, kobalte, non lo so)". No decision recorded on Solid 2.0.

**Token, spacing and motion rules**
- Island corner radius 22 px (agent, measured).
- Content inset 8 px inside islands; header logo at 16 px from the edge.
- Accordion expand 200 ms ease-out, interruptible, disabled with `prefers-reduced-motion`.

**Kit complaints**
- vanilla-extract runs in `unstable_mode: 'transform'` in `apps/codeimage/vite.config.ts`, so production compiles styles in the browser with about 69 kB of runtime (agent, measured). Switching to build-time extraction failed with 75 errors, because app `.css.ts` files import the `@codeimage/ui` entry point (which pulls Solid client code into the compiler) and the `packages/ui` dist points to undistributed `.css.ts` files.
- Scrollbars: the app colours scrollbars with `::-webkit-scrollbar`. Elements that also set `scrollbar-width: thin` make Chrome ignore those rules and draw a light default scrollbar.
- Duplicated UI layers: `@codeimage/ui` (147 importing files), `@codeui/kit` (70), `solid-headless` (7) and direct `@kobalte/core` overlap. `@motionone/solid` has no imports left but is still a dependency with a patch. `RadioBlock` is still used by the dashboard settings dialog (agent, counts after classic removal).
- Pre-redesign audit (agent): selectors for background, aspect ratio, window style and font did not open with Enter or Space; the 26 theme cards were not keyboard reachable.

**Open items**
- Phone layout of the new UI, GitHub issue #750 (labelled `ui/ux`, not planned).
- Roadmap steps 17 to 21 in `docs/modernization/roadmap.md` (remove solid-headless, @motionone/solid, RadioBlock) are not done.

---

## 6. Whats New Redesign

`abb87724-76f1-460d-b683-569afddded8b`, 2026-11-14 (last 2026-11-15). PR #725 (merged into the new UI), follow-up #739/#775.

**Components and patterns built**
- What's new is no longer a blocking XL dialog. Surfaces: **Nudge** (small card bottom-left, once per release, for everyone), **Showcase** (large, only for releases marked big), **NewDot** (blue dot on the feature's control, max 3, with coachmark), **Archive** (list in Settings with thumbnails).
- Code in `apps/codeimage/src/state/whats-new/` (`registry.ts`, `decide.ts`) and `components/WhatsNew/`.
- Generalised dot placement: anchors declared in one typed table, one `NewDots` component mounted by shared pieces (`ControlRow`, settings row renderer, shared buttons). Layout files no longer place dots by hand.

**Maintainer decisions and rejections**
- "occhio che sto rivedendo anche i settings, ora sono diversi". New two-column Settings is the reference.
- "Settings ha 7 new things non mi piace assolutamente". A toast pointing to Settings rejected.
- "il nudge in basso a sinistra mi sembra bellino a prescindere".
- On Hide secrets: "togliamo il puntino, si presenta da sola tanto".
- "come mai questa parte non ha le immaginette che ci sono nel nudge in basso a sinistra? inoltre forse dobbiamo aggiungere qualche animazione". Archive rows got the Nudge illustrations.
- "Pensiamo ad un modo generale del puntino magari con un componente".

**Token, spacing and motion rules (agent, Emil method)**
- Nudge enter: rise from the bottom edge, 400 ms. Expand upward 260 ms without animating height. Step change: fade with small slide, 200 ms. Exit 200 ms. Coachmark collapses into its dot. Illustrations animate once, only in Nudge and Showcase. Showcase content staggers in. The dot and archive rows never animate.
- Closing the Nudge moves focus to the adjacent control, never into a text field.

**Kit complaints**
- "la pressione dei pulsanti, che usa i 200 ms del kit. È più lenta di quanto consiglia Emil, ma correggerla riguarda tutta l'app" (agent). The kit's button press transition is 200 ms, slower than wanted.

**Open items**
- A final "2.0" PR will add the remaining highlights (social sizes, alt text, line marks, renderer, CLI, animations).

---

## 7. Code Highlight Marks and Focus UX

`2c940dbf-d07b-4d46-8b6a-caea9f1ffe77`, 2026-11-14 (last 2026-11-15). PR #698.

**Components and patterns built**
- Line-mark gutter column left of line numbers. A coloured indicator per marked line: `+`, `−`, a bar for highlight, a dot for focus. On unmarked lines a dashed circle appears only on hover; not shown on touch but still tappable. Tab-reachable.
- Clicking the indicator opens a small menu (Added, Removed, Highlight, Focus, Remove). The menu animates 150 ms ease-out from the indicator. Clicking indicators and shortcuts never animate.
- When the clicked line is inside the selection, the menu header reads the range and acts on it. Selection bar above the selection stays. Shortcuts `Mod-Alt-1..4`.

**Maintainer decisions and rejections**
- Focus must dim everything except the selected lines, and be repeatable.
- "manca un mark che ti permetta di disattivarlo velocemente". Quick unmark next to the line.
- "1. mi convince ... 3. passaggio del mouse direi". Variant B (gutter + menu) chosen. Hover-only empty indicator.
- No export option for the gutter indicator (agent proposed, maintainer unsure, agent decided).

---

## 8. Esplorare nuovi stili per la finestra codice

`7c295394-d391-46fd-8941-f2e103d88522`, 2026-11-14. Archived. PR #732 (merged into the new UI), VS Code 2026 themes #730.

**Components and patterns built**
- Window styles Card, Editor, Terminal. Surface as a separate choice: Flat, Accent wash. Hairline as a border (1 px ring plus a top light line, coloured from the theme text, replaces "Glass"). Ambient as a background suggestion.
- Prototype route used the Emil `prototype` picker pill.

**Maintainer decisions and rejections**
- "Dot grid -> evitiamo. Accent wash in teoria mi piace".
- "Cosa molto importante: assicuriamoci che quello che stiamo facendo funzionerá anche per takumi". Anything rendered in the frame must render in Takumi with near pixel parity to Chrome.

**Kit complaints**
- Rendering in Node SSR failed with the new styles until a server-unsafe call was removed (agent). Frame components must stay SSR-safe and inside Takumi's CSS subset.

---

## 9. Fix Kobalte keyboard freeze (Sol)

Subagent of `10ec5855`, 2026-11-16. PR #784, branch `fix/kobalte-scroll-freeze`, open.

**Finding**
- Pressing Enter, Space or ArrowDown on a DropdownMenu trigger inside a scrollable ancestor froze the tab forever. Cause: infinite loop in `scrollIntoViewport` in `@kobalte/utils@0.9.1`. The page root has `overflow: hidden`, Kobalte takes a fallback branch, and `getScrollParent()` keeps returning the same element.
- Published `@kobalte/utils@0.9.2` (with `@kobalte/core@0.13.14`) still has the loop. The upstream fix, kobaltedev/kobalte PR #750, is open and unmerged.
- Fix: `pnpm patch` of `@kobalte/utils@0.9.1`, ESM and CJS, so traversal starts at `parentElement`.
- Affected triggers: Preset menu, Saved signatures, and Selects for Avatar source, Padding, Border, Shadow, Language, Theme/Syntax theme, Font, Font weight.
- A verify-codeimage audit case now opens every menu/select trigger in a scroll container by keyboard, with a 5 s watchdog.

---

## Decisions that bind the kit

Deduplicated across threads. Each line names its source threads.

1. **The kit must serve the island layout.** Panels are unified islands with large radii (measured 22 px), not compact bordered boxes. Group headings must separate clearly from content. (5, 4)
2. **One component per pattern, used everywhere.** "non abbia 800 versioni diverse della stessa cosa". Containers may differ, content and controls may not. Today `@codeimage/ui`, `@codeui/kit`, `solid-headless` and direct Kobalte overlap. (4, 5)
3. **vanilla-extract stays, and must be production ready.** Styles must compile at build time; today the app uses `unstable_mode: 'transform'` with about 69 kB runtime because `.css.ts` files import a package entry that drags Solid client code into the compiler. The kit must ship styles that extract cleanly. (5)
4. **Kobalte keyboard paths must never freeze.** `@kobalte/utils` 0.9.1 and 0.9.2 loop forever in `scrollIntoViewport` for triggers inside scroll containers. The kit must patch, upgrade past a fixed release, or avoid that path. (9, 3)
5. **Popovers and menus open as overlays, never push content.** Inner dropdowns overlay the panel. Dock and its menus overlay the canvas. No dimmed modal over the frame the user is editing. (5)
6. **Popover content must not be wrapped in `<p>`.** The kit Popover's `<p>` wrapper broke grid layouts and let a SegmentedField in `adapt` mode take 200 px of height. SegmentedControl height must be stable in any container. (3, 5)
7. **Sizing floor.** Hit targets at least 28 px desktop and 40 px phone. Text at least 11 px, labels 12 to 13 px. (1, 3)
8. **Motion rules.** Strong ease-out, short durations (150 to 260 ms, 400 ms only for a corner entrance). No animation for keyboard-triggered, frequent or continuous actions. Interruptible. Reduced motion keeps only fades. Hover only on fine pointers. WAAPI, no motion library. The kit's 200 ms button press is considered too slow. (1, 5, 6, 7)
9. **Kit Tooltip is the tooltip.** Icon buttons and segmented items use the kit Tooltip, and it must cover the whole item, not only the icon. (1)
10. **Every draggable or visual value also has a typed input.** Timeline durations get number fields. Curves are read-only, with a text field for custom values. (3)
11. **Segmented control for view and mode switches that are used while working.** Not a dropdown option and not a global setting. (1, 4)
12. **Accordion pattern:** one section open at a time, icon plus title plus current-value summary plus right chevron, animated expand, all options visible when open. (4, 5)
13. **Settings dialog pattern:** two columns, left navigation, search, an "Experiments" section, cards with illustrations for layout preferences, deep-linkable from the command palette. (5, 4, 6)
14. **Command palette (`Cmd+K`) is a first-class component** available in every layout. (5)
15. **Toasts and dialogs:** toast actions are small inline text actions; tertiary dialog actions are ghost icon buttons on the left of the footer; no full-width blocks. (2)
16. **Scrollbars must be themed consistently.** Do not mix `scrollbar-width` with `::-webkit-scrollbar`. (5)
17. **Keyboard reachability.** Every picker and card opens with Enter and Space and is Tab-reachable. Esc on a nested control must not close the parent dialog. (3, 5, 9)
18. **Components rendered in the export frame must be SSR-safe and Takumi-safe.** No client-only calls at module load; CSS inside Takumi's subset. (2, 8)
19. **Chrome is the reference browser.** Firefox and Safari are tested once and noted, not chased. (3)
20. **Dropdowns are rejected for step management.** Prefer direct manipulation with inline affordances such as ghost "+ Step" cards. (1)
21. **The classic editor is gone.** No kit API needs to exist only for `pages/Editor`. (2, 5)
22. **`DESIGN.md` on CodeImage main records the visual decisions.** The kit should align with it and read it before setting tokens. (5)
