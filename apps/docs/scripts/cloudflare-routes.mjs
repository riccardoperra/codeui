// Cloudflare Pages runs `_worker.js` for every path `_routes.json` includes. Nitro includes `/*`,
// which sent each prerendered page through the worker and hit the CPU limit (error 1102).
// After the prerender, only search and the client-navigation server function stay dynamic.
// The build fails if a docs page has no static file, because Pages would answer it with a 404,
// or if a page carries a bundler `__name()` helper, which throws in the browser.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { docsUrls, staticFiles } from './docs-urls.mjs';

const dist = 'dist';
if (!existsSync(`${dist}/_worker.js`)) process.exit(0);

const expected = ['index.html', 'examples.html', 'llms.txt', 'llms-full.txt', ...docsUrls().flatMap((url) => staticFiles(url).map((f) => f.slice(1)))];
const missing = expected.filter((file) => !existsSync(`${dist}/${file}`));
if (missing.length) {
  console.error(`cloudflare-routes: ${missing.length} pages were not prerendered:\n${missing.join('\n')}`);
  process.exit(1);
}

const broken = expected.filter((file) => file.endsWith('.html') && readFileSync(`${dist}/${file}`, 'utf8').includes('__name('));
if (broken.length) {
  console.error(`cloudflare-routes: ${broken.length} pages call __name(), which is undefined in the browser:\n${broken.join('\n')}`);
  process.exit(1);
}

const routes = { version: 1, include: ['/api/*', '/_serverFn/*'], exclude: [] };
writeFileSync(`${dist}/_routes.json`, `${JSON.stringify(routes, null, 2)}\n`);
console.log(`cloudflare-routes: ${expected.length} static files, worker routes ${routes.include.join(' ')}`);
