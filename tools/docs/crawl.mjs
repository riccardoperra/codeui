// Loads every prerendered docs page in a browser and fails on what a reader would see broken:
// console errors, demos that render nothing, block demos the card shrink-wraps, and
// horizontal scroll at phone width.
//
//   node tools/docs/crawl.mjs <base-url> [--only <path-substring>] [--json <file>]
//
// Serve apps/docs/dist first, e.g. `pnpm --filter @codeui/docs exec wrangler pages dev dist --port 8799`.
// Playwright comes from tools/baseline (`npm ci --prefix tools/baseline`).
import { createRequire } from 'node:module';
import { globSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const { chromium } = createRequire(path.join(root, 'tools/baseline/package.json'))('playwright');

const args = process.argv.slice(2);
const base = args[0]?.replace(/\/$/, '');
if (!base) throw new Error('usage: crawl.mjs <base-url> [--only <substring>] [--json <file>]');
const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const only = flag('--only');
const jsonOut = flag('--json');

const dist = path.join(root, 'apps/docs/dist');
const pages = globSync('docs/**/*.html', { cwd: dist })
  .concat(globSync('docs.html', { cwd: dist }))
  .map((f) => `/${f.replace(/\.html$/, '')}`)
  .filter((p) => !only || p.includes(only))
  .sort();
if (!pages.length) throw new Error(`no prerendered pages in ${dist}; build the docs first`);

const configs = [
  { theme: 'dark', width: 1440, height: 900 },
  { theme: 'light', width: 1440, height: 900 },
  { theme: 'dark', width: 390, height: 844 },
  { theme: 'light', width: 390, height: 844 },
];

const browser = await chromium.launch();
const problems = [];
const report = (page, config, message) => problems.push(`${page} [${config.theme} ${config.width}] ${message}`);

async function visit(pagePath, config) {
  const context = await browser.newContext({ viewport: { width: config.width, height: config.height }, colorScheme: config.theme });
  await context.addInitScript((theme) => localStorage.setItem('theme', theme), config.theme);
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)));
  page.on('pageerror', (e) => errors.push(`pageerror: ${String(e).slice(0, 200)}`));
  const response = await page.goto(base + pagePath, { waitUntil: 'networkidle', timeout: 60_000 });
  if (response?.status() !== 200) report(pagePath, config, `HTTP ${response?.status()}`);
  await page.waitForTimeout(300);
  const state = await page.evaluate(() => {
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 2 && r.height > 2;
    };
    const demos = [...document.querySelectorAll('[data-solid-demo]')].map((el) => {
      const child = el.firstElementChild;
      // A block root must be as wide in the demo card as in normal block flow. A flex card that
      // shrink-wraps it collapses grids to one column and resolves width: 100% children to 0.
      let shrunk = 0;
      if (child?.matches('div,section,form,nav,ul,ol,dl,table,fieldset,article,header,footer,aside,figure')) {
        const inCard = child.getBoundingClientRect().width;
        const style = getComputedStyle(el);
        const content = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        el.style.display = 'block';
        shrunk = Math.min(child.getBoundingClientRect().width, content) - inCard;
        el.style.display = '';
      }
      return {
        name: el.dataset.solidDemo,
        blank: ![...el.querySelectorAll('*')].some(visible),
        shrunk,
        overflow: el.scrollWidth - el.clientWidth,
      };
    });
    return { demos, scroll: document.documentElement.scrollWidth - window.innerWidth, dark: document.documentElement.classList.contains('dark') };
  });
  if (state.dark !== (config.theme === 'dark')) report(pagePath, config, 'theme did not apply');
  for (const e of errors) report(pagePath, config, `console: ${e}`);
  if (state.scroll > 0) report(pagePath, config, `page scrolls horizontally by ${state.scroll}px`);
  for (const d of state.demos) {
    if (d.blank) report(pagePath, config, `demo ${d.name} renders nothing`);
    if (d.shrunk > 1) report(pagePath, config, `demo ${d.name} is block content shrunk by ${Math.round(d.shrunk)}px`);
    if (d.overflow > 1) report(pagePath, config, `demo ${d.name} overflows its card by ${d.overflow}px`);
  }
  await context.close();
  return state.demos.length;
}

let demoCount = 0;
const queue = pages.flatMap((p) => configs.map((c) => [p, c]));
await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let job = queue.shift(); job; job = queue.shift()) {
      try {
        const demos = await visit(...job);
        demoCount += demos;
      } catch (e) {
        report(job[0], job[1], `crawl failed: ${e.message.split('\n')[0]}`);
      }
    }
  }),
);
await browser.close();

problems.sort();
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(problems, null, 1));
for (const p of problems) console.log(p);
console.log(`${pages.length} pages x ${configs.length} configs, ${demoCount} demo renders, ${problems.length} problems`);
process.exit(problems.length ? 1 : 0);
