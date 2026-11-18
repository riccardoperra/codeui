import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { replaceSource } from 'fumadocs-core/mdx-plugins/stringifier';
import type { PropRow } from '../components/props-table';
import type { ColourPaletteData } from '../components/inkstone/colour-palette';

// Build-time expansion of the kit's MDX components, so the page and its Markdown route
// (`/docs/<page>.md`) carry the same readable content.
//
// - <PropsTable name="Badge" /> gets its rows from apps/docs/.generated/props.json and renders as
//   Fumadocs' TypeTable. Its Markdown route gets a Markdown table.
// - <SolidDemo name="badge/basic" /> fails the build when the demo file is missing, the name
//   repeats on the page, or the tag sits inside a paragraph, and gets the demo source printed under it as a code block.
//   In the Markdown route the demo tag is replaced by that code block.
// - <HtmlDemo name="button/themes" /> renders apps/docs/html-demos/button/themes.html in a frame that
//   loads only @codeui/styles, and gets the HTML printed under it the same way.
// - <Anatomy demo="select/anatomy" /> gets its parts from the Anatomy table that follows it in the
//   same section (rows with a `data-cui`). Its Markdown route drops the tag and keeps the table.
//
// The Markdown route is built from the authored source, so each expansion also registers its
// Markdown with replaceSource().

type VFile = Parameters<typeof replaceSource>[0];
type Node = { type: string; name?: string; children?: Node[]; attributes?: { name: string; value: unknown }[]; [key: string]: unknown };
type Row = PropRow;

const docsDir = path.resolve(import.meta.dirname, '../..');
const demosDir = path.resolve(docsDir, '../../packages/docs-demos/src/demos');
const htmlDemosDir = path.join(docsDir, 'html-demos');
const propsFile = path.join(docsDir, '.generated/props.json');
const paletteFile = path.join(docsDir, '.generated/inkstone-palette.json');

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

function colourPaletteMarkdown({ ramps, roles }: ColourPaletteData) {
	const codeCell = (value: string) => `\`${value}\``;
	const line = (cells: string[]) => `| ${cells.join(' | ')} |`;
	const value = (swatch: ColourPaletteData['roles'][number]['light']) =>
		`${codeCell(swatch.id)} ${codeCell(swatch.hex)}`;
	const rampTables = ramps.map(({ label, swatches }) => [
		`**${escapeCell(label)}**`,
		'',
		line(['Step', 'sRGB', 'OKLCH']),
		line(['---', '---', '---']),
		...swatches.map(({ id, hex, oklch }) => line([id, hex, oklch].map(codeCell))),
	].join('\n'));
	return [
		...rampTables,
		[
			'**Theme roles**',
			'',
			line(['Role', 'CSS token', 'Light', 'Dark']),
			line(['---', '---', '---', '---']),
			...roles.map(({ name, cssToken, light, dark }) => line([
				codeCell(name), codeCell(cssToken), value(light), value(dark),
			])),
		].join('\n'),
	].join('\n\n');
}

function paletteMatrixMarkdown({ ramps }: ColourPaletteData) {
	const aliasesCell = (aliases: string[]) => aliases.map(token => `\`${token}\``).join(', ') || '—';
	return ramps.map(({ label, swatches }) => [
		`**${escapeCell(label)}**`,
		'',
		'| Ramp step | sRGB | Light | Dark |',
		'| --- | --- | --- | --- |',
		...swatches.map(({ id, hex, aliases }) =>
			`| \`${id}\` | \`${hex}\` | ${aliasesCell(aliases.light)} | ${aliasesCell(aliases.dark)} |`,
		),
	].join('\n')).join('\n\n');
}

const fence = (name: string, source: string, lang = 'tsx') => {
	const ticks = '`'.repeat(Math.max(3, ...[...source.matchAll(/`+/g)].map(m => m[0].length + 1)));
	return `${ticks}${lang} title="${name}.${lang}"\n${source}\n${ticks}`;
};

/** The text of an mdast node: `inlineCode` and `text` leaves joined. */
const text = (node: Node): string =>
	typeof node.value === 'string' ? node.value : (node.children ?? []).map(text).join('');

/** The first `code` span of a table cell, or the cell text when it has none. */
const code = (cell: Node) => (cell.children ?? []).find(c => c.type === 'inlineCode')?.value as string | undefined;

const humanize = (key: string) => {
	const words = key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/-/g, ' ').toLowerCase();
	return words.charAt(0).toUpperCase() + words.slice(1);
};

/**
 * Parts of an Anatomy table, in table order: rows whose `data-cui` cell holds a marker. The name is
 * the export when the row has one, or the `classes` key, or the marker.
 */
export function anatomyParts(table: Node) {
	const [head, ...rows] = table.children ?? [];
	const columns = (head.children ?? []).map(c => text(c).toLowerCase());
	const at = (match: (h: string) => boolean) => columns.findIndex(match);
	const cuiAt = at(h => h.includes('data-cui'));
	const keyAt = at(h => h.includes('classes'));
	const exportAt = at(h => h === 'export' || h === 'part');
	if (cuiAt < 0) return [];
	return rows.flatMap(row => {
		const cells = row.children ?? [];
		const cui = code(cells[cuiAt]);
		if (!cui || !/^[a-z][\w-]*$/i.test(cui)) return [];
		const key = keyAt >= 0 ? code(cells[keyAt]) ?? null : null;
		const named = exportAt >= 0 ? code(cells[exportAt]) : undefined;
		return [{ name: named ?? humanize(key ?? cui), cui, key }];
	});
}

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
				if (node.type === 'mdxJsxTextElement' && ['SolidDemo', 'HtmlDemo', 'CssPlayground', 'PropsTable', 'Anatomy'].includes(node.name ?? '')) {
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
				if (node.type === 'mdxJsxFlowElement' && (node.name === 'ColourPalette' || node.name === 'PaletteMatrix')) {
					if (!existsSync(paletteFile)) throw new Error(`${where}: run pnpm palette before building the docs.`);
					const data: ColourPaletteData = JSON.parse(readFileSync(paletteFile, 'utf8'));
					const matrix = node.name === 'PaletteMatrix';
					replaceSource(file, node as never, matrix ? paletteMatrixMarkdown(data) : colourPaletteMarkdown(data));
					children[i] = { ...node, position: undefined, attributes: [matrix ? expressionAttribute('ramps', data.ramps) : expressionAttribute('data', data)] };
					continue;
				}
				if (node.type === 'mdxJsxFlowElement' && node.name === 'PaletteComparison') {
					replaceSource(file, node as never, '');
					children[i] = { ...node, position: undefined };
					continue;
				}
				if (node.type === 'mdxJsxFlowElement' && node.name === 'Anatomy') {
					const name = attribute(node, 'demo');
					if (!name || !existsSync(path.join(demosDir, `${name}.tsx`))) throw new Error(`${where}: <Anatomy demo="${name}" /> has no file at packages/docs-demos/src/demos/${name}.tsx.`);
					if (demos.has(name)) throw new Error(`${where}: demo "${name}" appears twice. Hydration needs one name per page.`);
					demos.add(name);
					let table: Node | undefined;
					for (let j = i + 1; j < children.length && children[j].type !== 'heading'; j++) {
						if (children[j].type === 'table') { table = children[j]; break; }
					}
					const parts = table ? anatomyParts(table) : [];
					if (!parts.length) throw new Error(`${where}: <Anatomy demo="${name}" /> needs an Anatomy table with a data-cui column after it, in the same section.`);
					replaceSource(file, node as never, '');
					children[i] = { ...node, position: undefined, attributes: [...(node.attributes ?? []), expressionAttribute('parts', parts)] };
					continue;
				}
				if (node.type === 'mdxJsxFlowElement' && node.name === 'HtmlDemo') {
					const name = attribute(node, 'name');
					const demo = path.join(htmlDemosDir, `${name}.html`);
					if (!name || !existsSync(demo)) throw new Error(`${where}: <HtmlDemo name="${name}" /> has no file at apps/docs/html-demos/${name}.html.`);
					if (demos.has(name)) throw new Error(`${where}: <HtmlDemo name="${name}" /> appears twice.`);
					demos.add(name);
					const source = readFileSync(demo, 'utf8').trim();
					children[i] = { ...node, position: undefined };
					replaceSource(file, node as never, fence(name, source, 'html'));
					children.splice(i + 1, 0, { type: 'code', lang: 'html', meta: `title="${name}.html"`, value: source });
					i++;
					continue;
				}
				if (node.type === 'mdxJsxFlowElement' && node.name === 'CssPlayground') {
					replaceSource(file, node as never, 'The interactive playground runs in the browser. Every demo on the CSS pages is available in it as a preset.');
					children[i] = { ...node, position: undefined };
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
