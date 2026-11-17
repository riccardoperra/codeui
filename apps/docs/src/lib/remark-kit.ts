import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { replaceSource } from 'fumadocs-core/mdx-plugins/stringifier';
import type { PropRow } from '../components/props-table';

// Build-time expansion of the kit's MDX components, so the page and its Markdown route
// (`/docs/<page>.md`) carry the same readable content.
//
// - <PropsTable name="Badge" /> gets its rows from apps/docs/.generated/props.json and renders as
//   Fumadocs' TypeTable. Its Markdown route gets a Markdown table.
// - <SolidDemo name="badge/basic" /> fails the build when the demo file is missing, the name
//   repeats on the page, or the tag sits inside a paragraph, and gets the demo source printed under it as a code block.
//   In the Markdown route the demo tag is replaced by that code block.
//
// The Markdown route is built from the authored source, so each expansion also registers its
// Markdown with replaceSource().

type VFile = Parameters<typeof replaceSource>[0];
type Node = { type: string; name?: string; children?: Node[]; attributes?: { name: string; value: unknown }[]; [key: string]: unknown };
type Row = PropRow;

const docsDir = path.resolve(import.meta.dirname, '../..');
const demosDir = path.resolve(docsDir, '../../packages/docs-demos/src/demos');
const propsFile = path.join(docsDir, '.generated/props.json');

/** A JSON value as an ESTree expression, so MDX can pass it to a component as a prop. */
const estree = (value: unknown): unknown => {
	if (Array.isArray(value)) return { type: 'ArrayExpression', elements: value.map(estree) };
	if (value && typeof value === 'object')
		return {
			type: 'ObjectExpression',
			properties: Object.entries(value).map(([key, v]) => ({
				type: 'Property', kind: 'init', method: false, shorthand: false, computed: false,
				key: { type: 'Literal', value: key }, value: estree(v),
			})),
		};
	return { type: 'Literal', value };
};

const expressionAttribute = (name: string, value: unknown) => ({
	type: 'mdxJsxAttribute',
	name,
	value: {
		type: 'mdxJsxAttributeValueExpression',
		value: JSON.stringify(value),
		data: { estree: { type: 'Program', sourceType: 'module', body: [{ type: 'ExpressionStatement', expression: estree(value) }] } },
	},
});

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
				// MDX wraps a tag that shares a line with text in a <p>. Both render <div>s, and a <div>
				// inside a <p> makes the server HTML and React's tree differ (hydration error #418).
				if (node.type === 'mdxJsxTextElement' && (node.name === 'SolidDemo' || node.name === 'PropsTable')) {
					const line = (node.position as { start?: { line: number } } | undefined)?.start?.line;
					throw new Error(`${where}:${line}: <${node.name}> sits inside a paragraph. Put it on its own line with a blank line around it.`);
				}
				if (node.type === 'mdxJsxFlowElement' && node.name === 'PropsTable') {
					const name = attribute(node, 'name');
					if (!existsSync(propsFile)) throw new Error(`${where}: run node scripts/generate-props.mjs before building the docs.`);
					tables ??= JSON.parse(readFileSync(propsFile, 'utf8'));
					const table = name && tables![name];
					if (!table) throw new Error(`${where}: <PropsTable name="${name}" /> has no projection. Export type ${name} from packages/docs-demos/src/props/<page>.ts.`);
					replaceSource(file, node as never, propsMarkdown(table.rows));
					children[i] = { ...node, position: undefined, attributes: [...(node.attributes ?? []), expressionAttribute('rows', table.rows)] };
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
