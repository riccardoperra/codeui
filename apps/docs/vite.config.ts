import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { nitro } from 'nitro/vite';
import { remarkKit } from './src/lib/remark-kit';
import { docsUrls, staticFiles } from './scripts/docs-urls.mjs';

// Crawling from `/` finds the HTML pages. The Markdown routes are not linked as `<a>`, so they are listed.
const prerenderPages = ['/', '/llms.txt', '/llms-full.txt', ...docsUrls().flatMap((url) => staticFiles(url).filter((f) => !f.endsWith('.html')))];

export default defineConfig({
  preview: { port: 6150 },
  server: { port: 6150 },
  plugins: [
    fumadocsMdx({ globalOptions: { mdxOptions: { remarkPlugins: (plugins) => [remarkKit, ...plugins] } } }),
    tailwindcss(),
    tanstackStart({
      // `docs/button.html` rather than `docs/button/index.html`: Cloudflare Pages redirects `/x` to `/x/` for the latter.
      prerender: { enabled: true, autoSubfolderIndex: false },
      pages: prerenderPages.map((path) => ({ path })),
    }),
    react(),
    nitro({
      // Cloudflare deploys build with NITRO_PRESET=cloudflare-pages; local builds stay on Node.
      preset: process.env.NITRO_PRESET ?? 'node-server',
      compatibilityDate: '2026-11-01',
      // Pages that moved. Cloudflare reads these from the generated _redirects file.
      routeRules: {
        '/docs/theming': { redirect: { to: '/docs/foundations/theming', status: 301 } },
        '/docs/theming.md': { redirect: { to: '/docs/foundations/theming.md', status: 301 } },
      },
      // The prerender needs every path routed to the worker. `scripts/cloudflare-routes.mjs`
      // narrows `_routes.json` after it, once the pages are static files.
      cloudflare: { wrangler: { name: 'codeui-docs' } },
      // The prerender step serves the build through this command. See the script for why.
      commands: { preview: 'node scripts/prerender-server.mjs' },
    }),
  ],
  resolve: { tsconfigPaths: true },
});
