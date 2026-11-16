import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { replaceSource } from 'fumadocs-core/mdx-plugins/stringifier';

// Build-time expansion of the kit's MDX components, so the page and its Markdown route
// (`/docs/<page>.md`) carry the same readable content.
//
// - <PropsTable name="Badge" /> becomes a Markdown table from apps/docs/.generated/props.json.
// - <SolidDemo name="badge/basic" /> fails the build when the demo file is missing or the name
//   repeats on the page, and gets the demo source printed under it as a code block.
//   In the Markdown route the demo tag is replaced by that code block.
//
// The Markdown route is built from the authored source, so each expansion also registers its
// Markdown with replaceSource().

type VFile = Parameters<typeof replaceSource>[0];
type Node = { type: string; name?: string; children?: Node[]; attributes?: { name: string; value: unknown }[]; [key: string]: unknown };
type Row = { name: string; type: string; default: string | null; required: boolean; deprecated: boolean; description: string };

const docsDir = path.resolve(import.meta.dirname, '../..');
const demosDir = path.resolve(docsDir, '../../packages/docs-demos/src/demos');
const propsFile = path.join(docsDir, '.generated/props.json');

const text = (value: string): Node => ({ type: 'text', value });
const code = (value: string): Node => ({ type: 'inlineCode', value });
const cell = (...children: Node[]): Node => ({ type: 'tableCell', children });

/** Text with `code` spans, as JSDoc writes it. */
const phrasing = (value: string): Node[] =>
	value.split(/`([^`]+)`/).flatMap((part, i) => (part ? [i % 2 ? code(part) : text(part)] : []));

function propsTable(rows: Row[]): Node {
	const header = ['Prop', 'Type', 'Default', 'Required', 'Description'];
	return {
		type: 'table',
		align: header.map(() => null),
		children: [
			{ type: 'tableRow', children: header.map(h => cell(text(h))) },
			...rows.map(r => ({
				type: 'tableRow',
				children: [
					cell(code(r.name)),
					cell(code(r.type)),
					cell(r.default ? code(r.default) : text('')),
					cell(text(r.required ? 'Yes' : 'No')),
					cell(...(r.deprecated ? [{ type: 'strong', children: [text('Deprecated.')] }, text(' ')] : []), ...phrasing(r.description)),
				],
			})),
		],
	};
}

const escapeCell = (value: string) => value.replace(/\|/g, '\\|').replace(/\n/g, ' ');

function propsMarkdown(rows: Row[]) {
	const line = (cells: string[]) => `| ${cells.join(' | ')} |`;
	return [
		line(['Prop', 'Type', 'Default', 'Required', 'Description']),
		line(['---', '---', '---', '---', '---']),
		...rows.map(r => line([
			`\`${r.name}\``,
			`\`${escapeCell(r.type)}\``,
			r.default ? `\`${escapeCell(r.default)}\`` : '',
			r.required ? 'Yes' : 'No',
			escapeCell(`${r.deprecated ? '**Deprecated.** ' : ''}${r.description}`),
		])),
	].join('\n');
}

const fence = (name: string, source: string) => {
	const ticks = '`'.repeat(Math.max(3, ...[...source.matchAll(/`+/g)].map(m => m[0].length + 1)));
	return `${ticks}tsx title="${name}.tsx"\n${source}\n${ticks}`;
};

const attribute = (node: Node, name: string) => {
	const value = node.attributes?.find(a => a.name === name)?.value;
	return typeof value === 'string' ? value : undefined;
};

export function remarkKit() {
	return (tree: Node, file: VFile) => {
		const where = path.relative(docsDir, file.path ?? 'unknown file');
		let tables: Record<string, { rows: Row[] }> | undefined;
		const demos = new Set<string>();
		const visit = (parent: Node) => {
			const children = parent.children;
			if (!children) return;
			for (let i = 0; i < children.length; i++) {
				const node = children[i];
				if (node.type === 'mdxJsxFlowElement' && node.name === 'PropsTable') {
					const name = attribute(node, 'name');
					if (!existsSync(propsFile)) throw new Error(`${where}: run node scripts/generate-props.mjs before building the docs.`);
					tables ??= JSON.parse(readFileSync(propsFile, 'utf8'));
					const table = name && tables![name];
					if (!table) throw new Error(`${where}: <PropsTable name="${name}" /> has no projection. Export type ${name} from packages/docs-demos/src/props/<page>.ts.`);
					replaceSource(file, node as never, propsMarkdown(table.rows));
					children[i] = propsTable(table.rows);
					continue;
				}
				if (node.type === 'mdxJsxFlowElement' && node.name === 'SolidDemo') {
					const name = attribute(node, 'name');
					const demo = path.join(demosDir, `${name}.tsx`);
					if (!name || !existsSync(demo)) throw new Error(`${where}: <SolidDemo name="${name}" /> has no file at packages/docs-demos/src/demos/${name}.tsx.`);
					if (demos.has(name)) throw new Error(`${where}: <SolidDemo name="${name}" /> appears twice. Hydration needs one name per page.`);
					demos.add(name);
					const source = readFileSync(demo, 'utf8').trimEnd();
					// A node without a position reaches the Markdown route only through replaceSource.
					children[i] = { ...node, position: undefined };
					if (attribute(node, 'source') === 'hidden') {
						replaceSource(file, node as never, '');
					} else {
						replaceSource(file, node as never, fence(name, source));
						children.splice(i + 1, 0, { type: 'code', lang: 'tsx', meta: `title="${name}.tsx"`, value: source });
						i++;
					}
					continue;
				}
				visit(node);
			}
		};
		visit(tree);
	};
}
