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
    nitro({ preset: 'node-server' }),
  ],
  resolve: { tsconfigPaths: true },
});
