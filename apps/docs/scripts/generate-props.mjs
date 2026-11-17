#!/usr/bin/env node
// Generates the props tables rendered by <PropsTable name="..." />.
//
// Reads every exported type alias in packages/docs-demos/src/props/*.ts. Each alias is a projection
// of a public kit type, such as `export type Badge = Pick<BadgeProps, "tone" | "size">`, so the
// table lists the props the kit owns and leaves out inherited Kobalte props. An optional
// `export const notes` adds authored defaults and descriptions.
//
// Writes apps/docs/.generated/props.json. Requires `pnpm build:kit` first.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createGenerator } from 'fumadocs-typescript';

const docsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const propsDir = path.resolve(docsDir, '../../packages/docs-demos/src/props');
const outFile = path.join(docsDir, '.generated/props.json');

const UNION = 134217728;
const UNDEFINED = 4;
const LITERAL = 15360;

// A union is spelled out only while it stays short. Longer types show the name the source wrote.
const MAX_MEMBERS = 6;
const MAX_UNION = 60;
// The build fails when a shown type is longer than this. Shorten it here, or with a note.
const MAX_TYPE = 80;

/**
 * Picks the type a reader sees. A short literal union, such as `BadgeSize`, is spelled out.
 * Anything else shows the shortest of the type as the declaration wrote it (`keyof Option`,
 * `Placement`), the union, and the resolved type. The resolved type moves to `fullType`, which
 * the table shows on demand.
 */
function transform(entry, type, symbol) {
	const resolved = entry.required ? entry.type : unwrap(entry.type.replace(/ \| undefined$/, ''));
	let expanded;
	if (type.flags & UNION) {
		const members = type.getTypes().filter(m => !(m.flags & UNDEFINED));
		if (members.every(m => m.flags & LITERAL)) {
			const values = members.map(m => this.checker.typeToString(m));
			const bool = values.includes('true') && values.includes('false');
			const shown = [...(bool ? ['boolean'] : []), ...values.filter(v => !bool || (v !== 'true' && v !== 'false'))];
			expanded = { text: shown.join(' | '), members: shown.length };
		}
	}
	const declared = symbol.declarations?.[0]?.resolve(this.program)?.type?.getText();
	const written = declared && unwrap(tidy(declared).replace(/ \| undefined$/, ''));
	let shown;
	// Kobalte declares the polymorphic prop as `T | ValidComponent`. T is the same component.
	if (entry.name === 'as') shown = 'ValidComponent';
	else if (expanded && expanded.members <= MAX_MEMBERS && expanded.text.length <= MAX_UNION) shown = expanded.text;
	else {
		// The shortest faithful form. Source text that uses a type parameter (`T`) is not one.
		const forms = [written, expanded?.text, resolved].filter(f => f && !/(?<![\w"])[A-Z](?![\w"])/.test(f));
		shown = forms.reduce((a, b) => (b.length < a.length ? b : a));
	}
	entry.type = shown;
	const full = expanded?.text ?? resolved;
	entry.fullType = full !== shown ? full : undefined;
}

/**
 * Source text as a reader would write it: one line, no `A.` namespace prefix from
 * `import * as A from "../parts/..."`, and `Exclude<Option, null>` as `Option`.
 */
const tidy = (text) =>
	text
		.replace(/\s+/g, ' ')
		.replace(/^\| /, '')
		.replace(/\b[A-Z]\.(?=[A-Z])/g, '')
		.replace(/Exclude<(\w+), null>/g, '$1');

/** `((e: Event) => void)` to `(e: Event) => void`, when the outer parentheses wrap the whole type. */
function unwrap(type) {
	if (!type.startsWith('(') || !type.endsWith(')')) return type;
	let depth = 0;
	for (let i = 0; i < type.length; i++) {
		depth += type[i] === '(' ? 1 : type[i] === ')' ? -1 : 0;
		if (depth === 0 && i < type.length - 1) return type;
	}
	return type.slice(1, -1);
}

// A shown type that names a kit alias links to its declaration.
const kitSrc = path.resolve(docsDir, '../../packages/kit/src');
const aliases = new Map();
for (const file of readdirSync(kitSrc, { recursive: true }).filter(f => /\.tsx?$/.test(f) && !f.includes('.css.')).sort()) {
	readFileSync(path.join(kitSrc, file), 'utf8').split('\n').forEach((line, i) => {
		const name = /^export (?:type|interface) (\w+)/.exec(line)?.[1];
		if (name && !aliases.has(name)) aliases.set(name, `https://github.com/riccardoperra/codeui/blob/main/packages/kit/src/${file}#L${i + 1}`);
	});
}
const aliasLink = (type) => aliases.get(/^(?:keyof )?(\w+)$/.exec(type)?.[1]);

const generator = createGenerator({ tsconfigPath: path.resolve(propsDir, '../../tsconfig.json') });
const tables = {};
const errors = [];

for (const file of readdirSync(propsDir).filter(f => f.endsWith('.ts') && f !== 'notes.ts').sort()) {
	const source = readFileSync(path.join(propsDir, file), 'utf8');
	const { notes = {} } = await import(pathToFileURL(path.join(propsDir, file)).href);
	for (const [, name] of source.matchAll(/^export type (\w+)/gm)) {
		if (tables[name]) { errors.push(`${file}: ${name} is already defined in ${tables[name].source}. Names are global.`); continue; }
		const [doc] = await generator.generateDocumentation({ path: path.join(propsDir, file) }, name, { transform });
		if (!doc) { errors.push(`${file}: no documentation generated for ${name}.`); continue; }
		const authored = notes[name] ?? {};
		for (const prop of Object.keys(authored))
			if (!doc.entries.some(e => e.name === prop)) errors.push(`${file}: notes.${name}.${prop} names a prop that ${name} does not have.`);
		tables[name] = {
			source: `packages/docs-demos/src/props/${file}`,
			rows: doc.entries.map(e => {
				const tag = e.tags.find(t => t.name === 'default' || t.name === 'defaultValue')?.text;
				const type = authored[e.name]?.type ?? e.type;
				const fullType = authored[e.name]?.type ? (e.fullType ?? e.type) : e.fullType;
				return {
					name: e.name,
					type,
					fullType: fullType && fullType !== type ? fullType : null,
					typeLink: aliasLink(type) ?? null,
					default: authored[e.name]?.default ?? tag ?? null,
					required: e.required,
					deprecated: e.deprecated,
					description: authored[e.name]?.description ?? e.description,
				};
			}),
		};
	}
	for (const name of Object.keys(notes))
		if (!tables[name]) errors.push(`${file}: notes.${name} has no exported type ${name}.`);
}

for (const [name, table] of Object.entries(tables))
	for (const row of table.rows)
		if (row.type.length > MAX_TYPE) errors.push(`${table.source}: ${name}.${row.name} shows a ${row.type.length}-character type. Keep it under ${MAX_TYPE}: ${row.type}`);

if (errors.length) {
	console.error(errors.join('\n'));
	process.exit(1);
}
mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(tables, null, '\t') + '\n');
console.log(`Generated ${Object.keys(tables).length} props tables in ${path.relative(process.cwd(), outFile)}.`);
process.exit(0);
