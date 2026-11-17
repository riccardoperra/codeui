#!/usr/bin/env node
// Keeps each component page's Anatomy figure and table in step with the kit.
//
// For every page in components/ with an `## Anatomy` section:
// 1. the section opens with <Anatomy demo="<page>/anatomy" />, and the demo file exists;
// 2. the demo, rendered in jsdom from the built @codeui/docs-demos client, contains every `data-cui`
//    the section's table lists, inside the demo's own element (an overlay must render open and inline).
//
//   node tools/docs/lint-anatomy.mjs            (needs `pnpm --filter @codeui/docs-demos build`)
import { existsSync, globSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '../..');
const pages = path.join(root, 'apps/docs/content/docs/(kit)/components');
const demos = path.join(root, 'packages/docs-demos/src/demos');
const client = path.join(root, 'packages/docs-demos/dist/client/client.js');


const problems = [];
const cells = (line) => line.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim());
const firstCode = (cell) => cell.match(/`([^`]+)`/)?.[1];

/** The section's Anatomy tag and the `data-cui` markers of its first table. */
function readSection(file) {
  const source = readFileSync(path.join(pages, file), 'utf8');
  const section = source.split(/^## Anatomy\s*$/m)[1]?.split(/^## /m)[0];
  if (section === undefined) return null;
  const tag = section.trimStart().match(/^<Anatomy\s+demo="([^"]+)"\s*\/>/);
  const lines = section.split('\n');
  const start = lines.findIndex((l) => l.trimStart().startsWith('|'));
  const table = [];
  for (let i = start; start >= 0 && i < lines.length && lines[i].trimStart().startsWith('|'); i++) table.push(cells(lines[i]));
  const cuiAt = table[0]?.findIndex((h) => h.toLowerCase().includes('data-cui')) ?? -1;
  const parts = cuiAt < 0 ? [] : table.slice(2).map((row) => firstCode(row[cuiAt] ?? '')).filter((c) => c && /^[a-z][\w-]*$/i.test(c));
  return { demo: tag?.[1], parts };
}

const sections = globSync('*.mdx', { cwd: pages })
  .sort()
  .map((file) => ({ page: file.replace(/\.mdx$/, ''), ...readSection(file) }))
  .filter((s) => s.parts);

for (const s of sections) {
  if (!s.demo) problems.push(`${s.page}: "## Anatomy" does not open with <Anatomy demo="${s.page}/anatomy" />`);
  else if (!existsSync(path.join(demos, `${s.demo}.tsx`))) problems.push(`${s.page}: no demo file packages/docs-demos/src/demos/${s.demo}.tsx`);
  if (!s.parts.length) problems.push(`${s.page}: the Anatomy table lists no data-cui markers`);
}

if (!existsSync(client)) {
  problems.push('packages/docs-demos is not built; run `pnpm --filter @codeui/docs-demos build` to check the rendered parts');
} else {
  // jsdom comes with the kit's Jest environment.
  const kitRequire = createRequire(path.join(root, 'packages/kit/package.json'));
  const { JSDOM } = createRequire(kitRequire.resolve('jest-environment-jsdom'))('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true, url: 'http://localhost/' });
  const { window } = dom;
  for (const key of Object.getOwnPropertyNames(window)) {
    if (!(key in globalThis)) Object.defineProperty(globalThis, key, { configurable: true, get: () => window[key] });
  }
  // Node has its own Event classes; Kobalte's events must be jsdom's.
  const own = Object.getOwnPropertyNames(window).filter((key) => /Event(Target)?$/.test(key));
  for (const key of ['navigator', 'document', 'window', ...own]) Object.defineProperty(globalThis, key, { configurable: true, value: key === 'window' ? window : window[key] });
  // jsdom has no layout. Give every element a size, so virtualized lists render rows.
  window.Element.prototype.getBoundingClientRect = () => ({ x: 0, y: 0, top: 0, left: 0, right: 300, bottom: 300, width: 300, height: 300, toJSON() {} });
  for (const key of ['offsetWidth', 'offsetHeight', 'clientWidth', 'clientHeight']) Object.defineProperty(window.HTMLElement.prototype, key, { configurable: true, get: () => 300 });
  window.matchMedia ??= () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
  window.ResizeObserver = globalThis.ResizeObserver;
  // Kit errors that jsdom cannot render (layout, Web Animations) are not anatomy drift.
  const consoleError = console.error;
  console.error = () => {};
  const { mount } = await import(pathToFileURL(client).href);
  for (const s of sections.filter((s) => s.demo && existsSync(path.join(demos, `${s.demo}.tsx`)))) {
    const host = document.createElement('div');
    document.body.append(host);
    let dispose;
    try {
      dispose = await mount(s.demo, host);
      await new Promise((r) => setTimeout(r, 30));
      const rendered = new Set([...host.querySelectorAll('[data-cui]')].map((el) => el.getAttribute('data-cui')));
      const missing = s.parts.filter((p) => !rendered.has(p));
      if (missing.length) problems.push(`${s.page}: ${s.demo} renders no ${missing.join(', ')}`);
    } catch (error) {
      problems.push(`${s.page}: ${s.demo} failed to render: ${error.message}`);
    }
    dispose?.();
    host.remove();
  }
  console.error = consoleError;
}

for (const p of problems) console.log(`ANATOMY ${p}`);
console.log(problems.length ? `${problems.length} anatomy problems` : `anatomy ok (${sections.length} pages)`);
process.exit(problems.length ? 1 : 0);
