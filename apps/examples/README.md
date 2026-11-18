# @codeui/examples

Solid apps made with `@codeui/kit`. The docs site lists them at `/examples` and serves each one full screen at `/examples/<slug>/`.

| Slug | App | What it is |
| --- | --- | --- |
| `finance` | Ledger | Balances, cash flow, budgets and a transactions table |
| `dashboard` | Pulse | Product analytics with a navigation rail, a customers table and a settings dialog |
| `theme-studio` | Theme Studio | A theme builder for CodeImage that exports a `createTheme` module |
| `inspector` | Inspector playground | The [prosemirror-inspector](https://github.com/riccardoperra/prosemirror-devtools) invoice workbench, with plain ProseMirror |

Each app is a real consumer of the kit: Vite and `vite-plugin-solid`, as [Installation](../docs/content/docs/(kit)/installation.mdx) describes. The interface uses kit components and `--cui-*` tokens only, and follows [`packages/kit/DESIGN.md`](../../packages/kit/DESIGN.md).

## Develop

```bash
pnpm turbo run build --filter=@codeui/kit
pnpm --filter @codeui/examples dev        # http://localhost:6160
```

The build is one HTML page per app, with a relative base, so the same files run at `/` and under `/examples/` on the docs site.

## Layout

- `examples.json`: the list of apps. The docs gallery and the standalone index both read it.
- `<slug>/index.html`: the page of one app. It sets the theme before first paint, from the `theme` key the docs site also uses.
- `src/shared/`: what every app uses. The Inkstone page layout (`base.css`), the header menu with the theme and the links back (`ExampleMenu.tsx`), the SVG charts, and small helpers.
- `src/<slug>/`: one app. Nothing imports across apps.

## Add an example

1. Add `src/<slug>/main.tsx` and `<slug>/index.html` (copy an existing page).
2. Add the slug to `pages` in `vite.config.ts` and an entry to `examples.json`.
3. Render `<ExampleMenu slug="<slug>" />` as the last header control, and `<MadeWith />` once.
4. Run the review checklist in `DESIGN.md` §12: both themes at 1440×900, 1024×768 and 390×844.
5. Build, then run `pnpm --filter @codeui/examples screenshots` to capture the gallery images in `public/screenshots/`. It uses the Playwright in `tools/baseline` (`npm ci` there once).

## Workarounds for the kit

The apps keep a few workarounds, each commented where it lives. They are listed here so they can be removed when the kit changes.

- The progress track is invisible on white in the light theme (`shared/base.css`).
- `Accordion` handles the arrow keys, Home and End from inside an open section, and remounts the open section when `items` is a new array (`Section` in `finance/Planning.tsx`, and the same in the other apps).
- `Tooltip` defaults to an accent fill, which DESIGN.md §2.3 rules out, so every tooltip passes `theme="secondary"`.
- `Tabs` draws a line under its list and does not reset its buttons (`dashboard/dashboard.css`). On phones the apps use a `SegmentedControl` as the tab list.
- `Checkbox` draws nothing for `indeterminate` and does not forward `aria-label` (`dashboard/Customers.tsx`).
- `Dialog` and `Sheet` do not return focus when a menu item opened them (`onCloseAutoFocus` in each app).
