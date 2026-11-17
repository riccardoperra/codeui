#!/usr/bin/env node
// Fails when a Markdown link to /docs/... in the docs content has no page.
//
//   node tools/docs/lint-links.mjs
import { globSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const content = path.join(root, 'apps/docs/content/docs');
const files = globSync('**/*.mdx', { cwd: content }).sort();
const urls = new Set(
	files.map(f => `/docs/${f.replace(/\(.*?\)\//g, '').replace(/\.mdx$/, '').replace(/(^|\/)index$/, '')}`.replace(/\/$/, '')),
);

let bad = 0;
for (const file of files) {
	for (const [, href] of readFileSync(path.join(content, file), 'utf8').matchAll(/\]\((\/docs[^)#\s]*)/g)) {
		if (!urls.has(href.replace(/\/$/, '').replace(/\.md$/, ''))) { console.log(`BROKEN ${file} -> ${href}`); bad++; }
	}
}
console.log(bad ? `${bad} broken links` : `links ok (${files.length} pages)`);
process.exit(bad ? 1 : 0);
