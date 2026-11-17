// Nitro prerenders the Cloudflare Pages build by running its preview command and
// appending `--port <n> --host localhost`.
//
// This runs `wrangler dev`, not `wrangler pages dev`. Pages dev bundles `_worker.js` again with
// esbuild `keepNames` and no way to turn it off. That adds `__name()` calls to functions that
// libraries serialize into inline scripts (the theme script), so every prerendered page threw
// `__name is not defined`. `wrangler dev` reads `keep_names: false` from its config.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const dist = path.join(import.meta.dirname, '../dist');
const config = path.join(import.meta.dirname, '../node_modules/.cache/prerender-wrangler.json');
mkdirSync(path.dirname(config), { recursive: true });
writeFileSync(
  config,
  JSON.stringify({
    name: 'codeui-docs-prerender',
    main: path.join(dist, '_worker.js/index.js'),
    compatibility_date: '2026-11-01',
    keep_names: false,
    assets: { directory: dist, binding: 'ASSETS' },
  }),
);

const args = process.argv.slice(2).map((arg) => (arg === '--host' ? '--ip' : arg));
const child = spawn('wrangler', ['dev', '--config', config, ...args], { stdio: 'inherit', shell: process.platform === 'win32' });

// Nitro stops the preview with SIGTERM once prerendering ends. That is a clean stop.
let stopping = false;
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => {
    stopping = true;
    child.kill(signal);
  });
}
child.on('exit', (code) => process.exit(stopping ? 0 : (code ?? 1)));
