# @codeui/docs

The documentation site for `@codeui/kit`, built with [Fumadocs](https://fumadocs.dev) on TanStack Start.

The site is React. The kit demos are Solid. They meet only through built files:

- `packages/docs-demos` holds one Solid component per demo in `src/demos/<name>.tsx`. Its build makes an ESM client bundle with `mount(name, el)` and an SSR bundle with `renderDemo(name)`.
- `src/components/solid-demo.tsx` renders `renderDemo(name)` on the server and calls `mount` in the browser, so each demo is in the HTML and then hydrates.
- The site has no Solid or vanilla-extract config. The demos package is a `workspace:*` dependency. Do not change it to `file:`, because pnpm then copies a snapshot and the site keeps serving old demos.

## Develop

```bash
pnpm install
pnpm turbo run build --filter=@codeui/docs-demos...   # kit + demos
pnpm --filter @codeui/docs dev                         # http://localhost:6150
```

The site reads the built demos. After you change a demo or the kit, rebuild the demos and reload the page.

## Add a demo

1. Add `packages/docs-demos/src/demos/<name>.tsx` with a default-exported Solid component.
2. Write `<SolidDemo name="<name>" />` in any page under `content/docs`.
3. Rebuild the demos.

## Build and preview

```bash
pnpm turbo run build --filter=@codeui/docs...
pnpm --filter @codeui/docs start                       # serves .output on port 6150
```

The build needs Node 22.12 or later, which TanStack Start and Nitro require.

## Hosting

The repository's `netlify.toml` deploys Storybook, and this site does not change it.
The build prerenders every docs page into `.output/public`, and `.output/server` holds a Node server for search and the Markdown routes.
To host the docs on Netlify as a separate site, use:

- Base directory: `/`
- Build command: `pnpm turbo run build --filter=@codeui/docs...`
- Publish directory: `apps/docs/.output/public`

The static publish serves the prerendered pages. Search and the `.md` routes need the Node server or a Netlify Nitro preset.
