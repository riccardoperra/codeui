#!/usr/bin/env node
// Checks that every public @codeui/kit export has a docs anchor.
//
//   node tools/docs/coverage.mjs                 check, fail on errors, list draft pages
//   node tools/docs/coverage.mjs --strict        also fail while any page is a draft
//   node tools/docs/coverage.mjs --page <slug>   list the anchors one page must have
//   node tools/docs/coverage.mjs --add           propose entries for unmapped exports
//
// Requires `pnpm build:kit`: exports are read from the emitted declarations.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { allPages } from './ia.mjs';
import { listKitExports, root } from './kit-exports.mjs';
import { contentDir, propose, readManifest, slug, writeManifest } from './manifest.mjs';

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const onlyPage = args.includes('--page') ? args[args.indexOf('--page') + 1] : null;

const exports = listKitExports();
const manifest = readManifest();

if (args.includes('--add')) {
	const proposed = propose(exports);
	let added = 0;
	for (const { entry, symbol } of exports) {
		if (manifest.exports[entry]?.[symbol] !== undefined) continue;
		(manifest.exports[entry] ??= {})[symbol] = proposed[entry][symbol];
		console.log(`added ${entry} ${symbol} -> ${proposed[entry][symbol]}`);
		added++;
	}
	writeManifest(manifest);
	console.log(`${added} entries added. Review them in apps/docs/export-manifest.json.`);
	process.exit(0);
}

/** Heading ids of a page, the way the docs site builds them. */
export function headingIds(source) {
	const ids = new Set();
	const seen = new Map();
	const body = source.replace(/^```[\s\S]*?^```/gm, '');
	for (const [, text] of body.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)) {
		const custom = /\[#([^\]]+)\]$/.exec(text);
		if (custom) { ids.add(custom[1]); continue; }
		const base = slug(text.replace(/`/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1'));
		const n = seen.get(base) ?? 0;
		seen.set(base, n + 1);
		ids.add(n ? `${base}-${n}` : base);
	}
	return ids;
}

const pages = new Map(allPages().map(p => [p.slug, p]));
const files = new Map();
const readPage = slugName => {
	if (!files.has(slugName)) {
		const file = path.join(contentDir, `${slugName}.mdx`);
		const source = existsSync(file) ? readFileSync(file, 'utf8') : null;
		files.set(slugName, source && {
			file: path.relative(root, file),
			ids: headingIds(source),
			draft: /^---[\s\S]*?^status:\s*draft\s*$[\s\S]*?^---/m.test(source),
			todos: (source.match(/TODO\(docs\)/g) ?? []).length,
		});
	}
	return files.get(slugName);
};

const errors = [];
const missingByPage = new Map();
const exported = new Set(exports.map(e => `${e.entry}:${e.symbol}`));

for (const { entry, symbol } of exports) {
	const target = manifest.exports[entry]?.[symbol];
	if (target === undefined) { errors.push(`${entry} ${symbol}: no manifest entry. Run with --add, then review.`); continue; }
	if (!target) { errors.push(`${entry} ${symbol}: manifest entry is empty.`); continue; }
	const [pageSlug, anchor] = target.split('#');
	if (!pages.has(pageSlug)) { errors.push(`${entry} ${symbol}: ${pageSlug} is not a page in tools/docs/ia.mjs.`); continue; }
	const page = readPage(pageSlug);
	if (!page) { errors.push(`${entry} ${symbol}: ${pageSlug}.mdx does not exist. Run node tools/docs/scaffold.mjs.`); continue; }
	if (!anchor || page.ids.has(anchor)) continue;
	const list = missingByPage.get(pageSlug) ?? [];
	list.push(`#${anchor} (${entry} ${symbol})`);
	missingByPage.set(pageSlug, list);
}

for (const [entry, symbols] of Object.entries(manifest.exports))
	for (const symbol of Object.keys(symbols))
		if (!exported.has(`${entry}:${symbol}`)) errors.push(`${entry} ${symbol}: stale manifest entry, the symbol is not exported.`);

const packageExports = Object.keys(JSON.parse(readFileSync(path.join(root, 'packages/kit/package.json'), 'utf8')).exports)
	.map(key => (key === '.' ? '@codeui/kit' : `@codeui/kit/${key.slice(2)}`));
const entries = new Set(exports.map(e => e.entry));
for (const key of packageExports)
	if (!entries.has(key) && !manifest.ignore[key]) errors.push(`${key}: package export with no declarations and no ignore reason.`);
for (const [key, reason] of Object.entries(manifest.ignore)) {
	if (!packageExports.includes(key) && !exported.has(key)) errors.push(`${key}: stale ignore, it is not exported.`);
	if (!reason) errors.push(`${key}: ignore needs a reason.`);
}
for (const key of Object.keys(manifest.review ?? {}))
	if (!exported.has(key)) errors.push(`${key}: stale review note, it is not exported.`);

if (onlyPage) {
	const anchors = new Map();
	for (const [entry, symbols] of Object.entries(manifest.exports))
		for (const [symbol, target] of Object.entries(symbols)) {
			const [pageSlug, anchor] = target?.split('#') ?? [];
			if (pageSlug === onlyPage) anchors.set(anchor, [...(anchors.get(anchor) ?? []), `${entry} ${symbol}`]);
		}
	const page = readPage(onlyPage);
	for (const [anchor, symbols] of anchors)
		console.log(`${page?.ids.has(anchor) ? 'ok     ' : 'MISSING'} #${anchor}  ${symbols.join(', ')}`);
	process.exit(0);
}

const drafts = [];
for (const slugName of pages.keys()) {
	const page = readPage(slugName);
	if (!page) { errors.push(`${slugName}: page in tools/docs/ia.mjs has no file. Run node tools/docs/scaffold.mjs.`); continue; }
	const missing = missingByPage.get(slugName) ?? [];
	if (page.draft) { drafts.push(`${slugName} (${missing.length} anchors missing, ${page.todos} TODO markers)`); continue; }
	for (const m of missing) errors.push(`${page.file}: missing anchor ${m}.`);
	if (page.todos) errors.push(`${page.file}: ${page.todos} TODO(docs) markers left on a page that is not a draft.`);
}

for (const [key, note] of Object.entries(manifest.review ?? {})) console.log(`review  ${key}: ${note}`);
const total = exports.length;
console.log(`\n${total} public exports in ${entries.size} entries, ${Object.keys(manifest.ignore).length} ignored.`);
console.log(`${pages.size} pages, ${drafts.length} drafts.`);
if (drafts.length) console.log(`Incomplete (status: draft):\n  ${drafts.join('\n  ')}`);
if (errors.length) console.error(`\n${errors.length} errors:\n  ${errors.join('\n  ')}`);
if (errors.length || (strict && drafts.length)) process.exit(1);
console.log('Every public export has a docs anchor in the manifest.');
