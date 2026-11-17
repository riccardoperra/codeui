// Loads every prerendered docs page in a browser and fails on what a reader would see broken:
// console errors, demos that render nothing, block demos the card shrink-wraps, horizontal scroll
// at phone width, and Anatomy callouts that do not land on their part.
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
      // A single block root must be as wide in the demo card as in normal block flow. A flex card
      // that shrink-wraps it collapses grids to one column and resolves width: 100% children to 0.
      // Several roots, such as five Selects, form a row on purpose.
      let shrunk = 0;
      if (el.childElementCount === 1 && child.matches('div,section,form,nav,ul,ol,dl,table,fieldset,article,header,footer,aside,figure')) {
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
  for (const m of await anatomyDrift(page)) report(pagePath, config, m);
  await context.close();
  return state.demos.length;
}

/**
 * An Anatomy figure must draw each callout on its part after the page settles. Scrolling to the
 * figure moves overlays that Kobalte positions on scroll, which once left the callouts behind. A wide
 * figure draws every callout; a narrow one draws a part when its legend row has focus.
 */
async function anatomyDrift(page) {
  const figures = page.locator('figure[data-anatomy]');
  const out = [];
  for (let f = 0; f < (await figures.count()); f++) {
    const figure = figures.nth(f);
    await figure.evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(300);
    const check = (fig, only) => {
      const stage = fig.querySelector('.cui-anatomy__stage').getBoundingClientRect();
      const frame = fig.getBoundingClientRect();
      const bad = [];
      for (const g of fig.querySelectorAll('.cui-anatomy__lines g[data-part]')) {
        if (only && g.dataset.part !== only) continue;
        const el = fig.querySelector(`[data-solid-demo] [data-cui="${g.dataset.part}"]`);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const dot = g.querySelector('circle');
        const box = g.querySelector('rect');
        if (dot) {
          const x = stage.left + Number(dot.getAttribute('cx'));
          const y = stage.top + Number(dot.getAttribute('cy'));
          const edge = Math.abs(x - r.left) < 2 || Math.abs(x - r.right) < 2;
          if (!edge || y < r.top - 1 || y > r.bottom + 1) bad.push(`${g.dataset.part} callout is ${Math.round(x - r.left)},${Math.round(y - r.top)}px from its part`);
        } else if (box) {
          const x = stage.left + Number(box.getAttribute('x'));
          const y = stage.top + Number(box.getAttribute('y'));
          if (Math.abs(x - r.left) > 2 || Math.abs(y - r.top) > 2) bad.push(`${g.dataset.part} outline is ${Math.round(x - r.left)},${Math.round(y - r.top)}px from its part`);
        }
      }
      for (const m of fig.querySelectorAll('.cui-anatomy__marker')) {
        const r = m.getBoundingClientRect();
        if (r.left < frame.left || r.right > frame.right || r.top < frame.top || r.bottom > frame.bottom) bad.push(`marker ${m.textContent} is clipped by the figure`);
      }
      return bad;
    };
    const name = await figure.getAttribute('data-anatomy');
    const narrow = await figure.evaluate((fig) => !fig.querySelector('.cui-anatomy__lines path'));
    if (!narrow) {
      out.push(...(await figure.evaluate(check)).map((m) => `anatomy ${name}: ${m}`));
      continue;
    }
    const rows = figure.locator('.cui-anatomy__legend li[data-part]:not([data-hidden])');
    for (let k = 0; k < (await rows.count()); k++) {
      const row = rows.nth(k);
      await row.focus();
      const part = await row.getAttribute('data-part');
      await page.waitForTimeout(20);
      out.push(...(await figure.evaluate(check, part)).map((m) => `anatomy ${name}: ${m}`));
    }
  }
  return [...new Set(out)];
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
