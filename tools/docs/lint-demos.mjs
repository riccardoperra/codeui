#!/usr/bin/env node
// Fails when a page's SolidDemo names a demo file that does not exist, or names one demo twice.
// The docs build checks the same, but this runs in a second, without a kit build.
//
//   node tools/docs/lint-demos.mjs
import { existsSync, globSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const content = path.join(root, 'apps/docs/content/docs');
const demos = path.join(root, 'packages/docs-demos/src/demos');

let bad = 0;
for (const file of globSync('**/*.mdx', { cwd: content }).sort()) {
	const seen = new Set();
	for (const [, name] of readFileSync(path.join(content, file), 'utf8').matchAll(/<SolidDemo\s+name="([^"]+)"/g)) {
		if (seen.has(name)) { console.log(`DUP  ${file}: ${name}`); bad++; }
		seen.add(name);
		if (!existsSync(path.join(demos, `${name}.tsx`))) { console.log(`MISS ${file}: ${name}`); bad++; }
	}
}
console.log(bad ? `${bad} problems` : 'demo references ok');
process.exit(bad ? 1 : 0);
