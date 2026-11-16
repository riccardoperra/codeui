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

/** Expands a union of literals, such as `BadgeSize`, into its values. Drops `undefined` from optional props. */
function transform(entry, type) {
	if (type.flags & UNION) {
		const members = type.getTypes().filter(m => !(m.flags & UNDEFINED));
		if (members.every(m => m.flags & LITERAL)) {
			const values = members.map(m => this.checker.typeToString(m));
			const bool = values.includes('true') && values.includes('false');
			entry.type = [...(bool ? ['boolean'] : []), ...values.filter(v => !bool || (v !== 'true' && v !== 'false'))].join(' | ');
		}
	}
	if (!entry.required) entry.type = unwrap(entry.type.replace(/ \| undefined$/, ''));
}

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
				return {
					name: e.name,
					type: e.type,
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

if (errors.length) {
	console.error(errors.join('\n'));
	process.exit(1);
}
mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(tables, null, '\t') + '\n');
console.log(`Generated ${Object.keys(tables).length} props tables in ${path.relative(process.cwd(), outFile)}.`);
process.exit(0);
