import type { Item, Node, Root } from 'fumadocs-core/page-tree';
import kit from '../../../../packages/kit/package.json';
import { docsLlms, source } from './source';

// The curated /llms.txt index and the /llms-full.txt bundle for @codeui/kit.
// Both walk the kit sidebar. The full bundle also includes the Inkstone colour rules.

const subpaths = Object.keys(kit.exports)
	.filter(key => key !== '.' && key !== './package.json' && key !== './tokens')
	.map(key => `@codeui/kit/${key.slice(2)}`);

const markdownUrl = (url: string) => `${url.replace(/\/$/, '')}.md`;
const colourGuide = source.getPage(['design', 'color']);

function pageLine(node: Node) {
	if (node.type !== 'page') return [];
	const page = source.getNodePage(node);
	if (!page) return [];
	const description = page.data.description ? `: ${page.data.description}` : '';
	return [`- [${page.data.title}](${markdownUrl(page.url)})${description}`];
}

/** Lines of one sidebar root: separators become headings, pages become links. */
function section(nodes: Node[], depth: number): string[] {
	const out: string[] = [];
	for (const node of nodes) {
		if (node.type === 'separator') out.push('', `${'#'.repeat(depth)} ${node.name}`, '');
		else if (node.type === 'folder') out.push(...(node.index ? pageLine(node.index) : []), ...section(node.children, depth + 1));
		else out.push(...pageLine(node));
	}
	return out;
}

function roots(tree: Root) {
	const folders = tree.children.filter(n => n.type === 'folder');
	const isDesign = (n: Node) => n.type === 'folder' && n.$id?.includes('design');
	return { kitRoot: folders.find(n => !isDesign(n)), designRoot: folders.find(isDesign) };
}

export function kitIndex() {
	const { kitRoot, designRoot } = roots(source.getPageTree());
	return [
		`# CodeUI kit (@codeui/kit ${kit.version})`,
		'',
		'> Accessible Solid components with the CodeImage look, built on Kobalte. Every color, radius, and spacing value is a --cui-* CSS custom property.',
		'',
		`- Install: \`pnpm add @codeui/kit solid-js\`. Peer dependency: solid-js ${kit.peerDependencies['solid-js']}. Styles are vanilla-extract modules, so the app build needs @vanilla-extract/vite-plugin. See Installation.`,
		'- Ready components import from `@codeui/kit`. Use them first.',
		`- Styled parts import from a component subpath, for custom layouts: ${subpaths.map(s => `\`${s}\``).join(', ')}. No other subpath exists.`,
		'- Token objects import from `@codeui/kit` or `@codeui/kit/tokens`.',
		...(colourGuide ? [`- Use the [Inkstone colour rules](${markdownUrl(colourGuide.url)}) when styling an interface.`] : []),
		'- Each link below is the Markdown of one page. [All kit pages in one file](/llms-full.txt).',
		...(kitRoot?.type === 'folder' ? section(kitRoot.children, 2) : []),
		'',
		'## Optional',
		'',
		'The Inkstone design language behind the kit. Read it before changing a visual rule.',
		'',
		...(designRoot?.type === 'folder' ? [
			...(designRoot.index ? pageLine(designRoot.index) : []),
			...designRoot.children.filter(node => node.type !== 'page' || node.url !== colourGuide?.url).flatMap(pageLine),
		] : []),
		'',
	].join('\n');
}

export async function kitFull() {
	const { kitRoot } = roots(source.getPageTree());
	const pages: Item[] = [];
	const visit = (node: Node) => {
		if (node.type === 'page') pages.push(node);
		if (node.type === 'folder') {
			if (node.index) pages.push(node.index);
			node.children.forEach(visit);
		}
	};
	if (kitRoot) visit(kitRoot);
	const content = [...pages.map(node => source.getNodePage(node)), colourGuide];
	const rendered = await Promise.all(content.filter(page => page !== undefined).map(page => docsLlms.page(page)));
	return rendered.join('\n\n');
}

export const text = (body: string, type = 'text/plain') =>
	new Response(body, { headers: { 'Content-Type': `${type}; charset=utf-8` } });
