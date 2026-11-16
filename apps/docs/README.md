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

The site deploys to Cloudflare Pages from `.github/workflows/docs.yml`:

- A push to `main` deploys to production.
- A pull request from this repository deploys a preview and comments its URL on the pull request.
- The workflow runs only when the docs, the kit, the demos, the lockfile or `turbo.json` change. Run it by hand with `workflow_dispatch`.

The Cloudflare build uses Nitro's `cloudflare-pages` preset. It prerenders every docs page into `dist/` and puts the server in `dist/_worker.js`, which Pages runs as an advanced-mode Function. Search, the `.md` routes, `llms.txt` and the TanStack server functions that client-side navigation calls run in that Worker.

Build and preview the Cloudflare output locally:

```bash
NITRO_PRESET=cloudflare-pages pnpm turbo run build --filter=@codeui/docs...
pnpm --filter @codeui/docs exec wrangler pages dev
```

Without `NITRO_PRESET`, the build uses the `node-server` preset and writes `.output/`, as above.

Prerendering serves the build through Nitro's preview command. For Cloudflare presets Nitro runs that command with `--host`, which `wrangler pages dev` rejects, so `scripts/wrangler-pages-dev.mjs` maps it to `--ip`.

### Setup

The workflow needs two repository secrets:

- `CLOUDFLARE_API_TOKEN`: an API token with the **Account > Cloudflare Pages > Edit** permission.
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID.

The workflow creates the `codeui-docs` Pages project, with `main` as the production branch, if it does not exist yet.

The repository's `netlify.toml` still deploys Storybook, and this site does not change it.
