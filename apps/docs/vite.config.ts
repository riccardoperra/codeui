import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { nitro } from 'nitro/vite';

export default defineConfig({
  preview: { port: 6150 },
  server: { port: 6150 },
  plugins: [
    fumadocsMdx(),
    tailwindcss(),
    tanstackStart({ prerender: { enabled: true } }),
    react(),
    nitro({
      // Cloudflare deploys build with NITRO_PRESET=cloudflare-pages; local builds stay on Node.
      preset: process.env.NITRO_PRESET ?? 'node-server',
      compatibilityDate: '2026-11-01',
      cloudflare: { wrangler: { name: 'codeui-docs' } },
      // The prerender step serves the build through this command. See the script for why.
      commands: { preview: 'node scripts/wrangler-pages-dev.mjs' },
    }),
  ],
  resolve: { tsconfigPaths: true },
});
