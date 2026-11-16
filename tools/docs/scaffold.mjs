#!/usr/bin/env node
// Writes the docs sidebar and the draft stub of every planned page.
//
//   node tools/docs/scaffold.mjs                 write meta.json files, the components overview, and missing stubs
//   node tools/docs/scaffold.mjs --print <slug>  print the template stub of one page, without writing
//
// Safe to rerun. It never overwrites a page that exists. It marks an existing page that has no
// `status` field as a draft, so the coverage check reports it until a lane finishes it.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { allPages, families, groups } from './ia.mjs';
import { contentDir, readManifest, slug } from './manifest.mjs';

const manifest = readManifest();

/** anchor -> symbols, per page */
const anchorsByPage = new Map();
for (const [entry, symbols] of Object.entries(manifest.exports))
	for (const [symbol, target] of Object.entries(symbols)) {
		const [page, anchor] = target.split('#');
		const anchors = anchorsByPage.get(page) ?? new Map();
		anchors.set(anchor, [...(anchors.get(anchor) ?? []), { entry, symbol }]);
		anchorsByPage.set(page, anchors);
	}

const todo = text => {
	// Fumadocs fails to compile an MDX comment that contains angle brackets.
	if (/[<>]/.test(text)) throw new Error(`TODO text must not contain < or >: ${text}`);
	return `{/* TODO(docs): ${text} */}`;
};

/** The component page template. Order and wording follow the docs plan, section 2. */
const componentSections = [
	['When to use', 'One short paragraph: the job this component does in an app.'],
	['When to choose another component', 'Name the nearest alternatives and the deciding difference, such as Select versus Combobox.'],
	['Live demo', 'Add packages/docs-demos/src/demos/PAGE/basic.tsx and render it with a SolidDemo named PAGE/basic. The build prints the demo source under it.'],
	['Anatomy', 'Table with columns Export, Renders, `classes` key, `data-cui`, Role. Root and Portal without DOM get none. Copy data-cui names from the source, never derive them from export names.'],
	['Variants', 'One named demo per variant axis or distinct mode, each a SolidDemo named PAGE/AXIS. Use a size gallery, not every combination.'],
	['States', 'Only the states this component supports: disabled, readOnly, required, invalid, empty, loading, selected, open, controlled. Never invent states for presentational components.'],
	['Ready API', null],
	['Styled parts API', null],
	['Styles export', null],
	['Accessibility', 'H3 Keyboard, ARIA, and Focus where relevant. For layout and text, state the semantic element instead of an empty keyboard map.'],
	['SSR notes', 'Portal availability, deterministic IDs, request-local state, hydration, and client-only effects, as they apply.'],
	['Theming hooks', 'The --cui-* properties this component reads, directly or through shared field and button styles. Link the defaults in Foundations.'],
	['Composition examples', 'Link complete examples. Keep long procedures in Patterns.'],
	['Related', 'Links to related pages, each with the one difference that matters.'],
];

const sectionIds = new Set(componentSections.map(([title]) => slug(title)));
const display = (symbols, anchor) => `\`${(symbols.find(s => slug(s.symbol) === anchor) ?? symbols[0]).symbol}\``;

function componentStub(page) {
	const anchors = anchorsByPage.get(page.slug) ?? new Map();
	const placed = new Set(sectionIds);
	const h3 = anchor => {
		placed.add(anchor);
		return `### ${display(anchors.get(anchor), anchor)}`;
	};
	const subEntry = page.subpath && `@codeui/kit/${page.subpath}`;
	const ready = page.owns.map(s => slug(s));
	const parts = [...anchors].filter(([anchor, symbols]) => !sectionIds.has(anchor) && !ready.includes(anchor) && !/styles$/.test(anchor) && symbols.some(s => s.entry === subEntry)).map(([a]) => a);
	const styles = [...anchors.keys()].filter(a => /styles$/.test(a));
	const out = [];
	for (const [title, guidance] of componentSections) {
		if (title === 'Styled parts API' && !parts.length) continue;
		if (title === 'Styles export' && !styles.length) continue;
		out.push(`## ${title}`, '');
		if (title === 'Ready API') {
			out.push(todo('One H3 per ready export below. Under each, one sentence on what it renders, then a PropsTable of a projection exported from packages/docs-demos/src/props/PAGE.ts. Add a short inherited-props table and link the Kobalte contract for the rest.'), '');
			for (const anchor of ready) out.push(h3(anchor), '', todo(`Props of ${display(anchors.get(anchor), anchor)}, and the types listed in export-manifest.json for this anchor.`), '');
		} else if (title === 'Styled parts API') {
			out.push(`Import the parts from \`${subEntry}\`.`, '', todo('One H3 per part: what it renders, its props, and the matching Kobalte primitive. Document namespace aliases where they are exported.'), '');
			for (const anchor of parts) out.push(h3(anchor), '', todo(`Document ${anchors.get(anchor).map(s => `${s.entry} ${s.symbol}`).join(', ')}.`), '');
		} else if (title === 'Styles export') {
			out.push(todo('What each part function returns, which variants it takes, and when to call it instead of rendering a part.'), '');
			for (const anchor of styles) out.push(h3(anchor), '', todo(`Document ${anchors.get(anchor).map(s => `${s.entry} ${s.symbol}`).join(', ')}.`), '');
		} else {
			out.push(todo(guidance), '');
		}
	}
	const leftover = [...anchors.keys()].filter(a => !placed.has(a));
	if (leftover.length) throw new Error(`${page.slug}: no template slot for anchors ${leftover.join(', ')}`);
	return out.join('\n');
}

function utilityStub(page) {
	const anchors = anchorsByPage.get(page.slug) ?? new Map();
	const order = [...new Set([...page.owns.map(s => slug(s)), ...anchors.keys()])];
	const out = [];
	if (page.slug === 'utilities/token-exports') out.push('## The `@codeui/kit/tokens` entry', '', todo('Named exports, parity with the root entry, side effects, and packed-consumer behavior.'), '');
	for (const anchor of order) {
		const symbols = anchors.get(anchor);
		out.push(`## ${display(symbols, anchor)}`, '', todo(`Import path, signature, parameters, return value, one example, and edge cases. Covers ${symbols.map(s => `${s.entry} ${s.symbol}`).join(', ')}.`), '');
	}
	return out.join('\n');
}

export function stub(page) {
	const description = page.description ? `\ndescription: ${JSON.stringify(page.description)}` : '';
	const header = `---\ntitle: ${JSON.stringify(page.title)}${description}\nstatus: draft\n---\n\n${todo(`Scope from the docs plan. ${page.todo} Follow apps/docs/CONTRIBUTING-DOCS.md. Delete each TODO(docs) as you finish its section, and delete status: draft when the page is done.`)}\n\n`;
	if (page.kind === 'component') return header + componentStub(page);
	if (page.kind === 'utility') return header + utilityStub(page);
	return header.trimEnd() + '\n';
}

function writeIfChanged(file, content) {
	mkdirSync(path.dirname(file), { recursive: true });
	if (existsSync(file) && readFileSync(file, 'utf8') === content) return;
	writeFileSync(file, content);
	console.log(`wrote ${path.relative(process.cwd(), file)}`);
}

const args = process.argv.slice(2);
if (args.includes('--print')) {
	const target = args[args.indexOf('--print') + 1];
	const page = allPages().find(p => p.slug === target);
	if (!page) throw new Error(`Unknown page ${target}. See tools/docs/ia.mjs.`);
	process.stdout.write(stub(page));
	process.exit(0);
}

const rootPages = groups.flatMap(g => [
	`---${g.title}---`,
	...(g.folder ? ['...components'] : g.pages.map(p => (typeof p === 'string' ? p : p.slug))),
]);
writeIfChanged(path.join(contentDir, 'meta.json'), JSON.stringify({
	title: 'Kit',
	description: 'Solid components with the CodeImage look',
	icon: 'Package',
	root: true,
	pages: rootPages,
}, null, 2) + '\n');

writeIfChanged(path.join(contentDir, 'components/meta.json'), JSON.stringify({
	title: 'Components',
	pages: ['index', ...families.flatMap(f => [`---${f.title}---`, ...f.pages.map(p => p.slug.slice('components/'.length))])],
}, null, 2) + '\n');

writeIfChanged(path.join(contentDir, 'components/index.mdx'), [
	'---',
	'title: Overview',
	'description: Every kit component, grouped by the job it does.',
	'---',
	'',
	'{/* Generated by tools/docs/scaffold.mjs from tools/docs/ia.mjs. Edit those, not this file. */}',
	'',
	...families.flatMap(f => [
		`## ${f.title}`,
		'',
		...[...f.pages].sort((a, b) => a.title.localeCompare(b.title)).map(p => `- [${p.title}](/docs/${p.slug}): ${p.description}`),
		'',
	]),
].join('\n'));

for (const page of allPages()) {
	const file = path.join(contentDir, `${page.slug}.mdx`);
	if (!existsSync(file)) {
		writeIfChanged(file, stub(page));
		continue;
	}
	const source = readFileSync(file, 'utf8');
	if (/^status:/m.test(/^---\n([\s\S]*?)\n---/.exec(source)?.[1] ?? '')) continue;
	writeIfChanged(file, source.replace(/^---\n([\s\S]*?)\n---\n/, (_, fm) => `---\n${fm}\nstatus: draft\n---\n\n${todo(`Rewrite into the page template. Run node tools/docs/scaffold.mjs --print ${page.slug} to see it, and keep the useful content below.`)}\n`));
}
