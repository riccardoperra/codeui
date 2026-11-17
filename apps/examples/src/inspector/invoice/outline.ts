import type { Node as ProseMirrorNode } from "prosemirror-model";
import { readLineItem } from "./document";
import { type PageKind, pageTitles, validateLineItem } from "./model";
import { nodes } from "./schema";

export interface OutlineEntry {
	/** Index path, stable while typing, so a row keeps its DOM node. */
	readonly id: string;
	readonly label: string;
	/** The node that the spotlight outlines and the scroll brings into view. */
	readonly pos: number;
	/** Selections in [from, to) belong to this entry. A heading owns the blocks up to the next entry. */
	readonly from: number;
	readonly to: number;
	/** Where a jump puts the selection: on a node, or at the nearest text position. */
	readonly target: { readonly kind: "node" | "text"; readonly pos: number };
	readonly issues: number;
	readonly children: readonly OutlineEntry[];
}

/** Typing changes one block, so every other block's count is reused across documents. */
const issuesByBlock = new WeakMap<ProseMirrorNode, number>();

function blockIssues(block: ProseMirrorNode): number {
	const cached = issuesByBlock.get(block);
	if (cached !== undefined) return cached;
	let issues = 0;
	if (block.type === nodes.lineItems) block.forEach(row => (issues += validateLineItem(readLineItem(row)).length > 0 ? 1 : 0));
	issuesByBlock.set(block, issues);
	return issues;
}

type Rule = { label(node: ProseMirrorNode): string; target: "node" | "firstChild" | "inside" };

const rules: Record<string, Rule> = {
	invoiceMeta: { label: () => "Invoice details", target: "node" },
	parties: { label: () => "Parties", target: "inside" },
	lineItems: { label: node => `Line items · ${node.childCount} ${node.childCount === 1 ? "row" : "rows"}`, target: "firstChild" },
	totals: { label: () => "Totals", target: "node" },
	heading: { label: node => node.textContent || "Untitled heading", target: "inside" },
};

function readPage(page: ProseMirrorNode, pagePos: number, pageIndex: number): OutlineEntry {
	const blocks: { node: ProseMirrorNode; pos: number }[] = [];
	page.forEach((node, offset) => blocks.push({ node, pos: pagePos + 1 + offset }));
	const listed = blocks.flatMap((block, index) => (Object.hasOwn(rules, block.node.type.name) ? [index] : []));
	const children = listed.map((blockIndex, order): OutlineEntry => {
		const { node, pos } = blocks[blockIndex];
		const rule = rules[node.type.name];
		const lastIndex = node.type === nodes.heading ? (listed[order + 1] ?? blocks.length) - 1 : blockIndex;
		const last = blocks[lastIndex];
		return {
			id: `${pageIndex}.${blockIndex}`,
			label: rule.label(node),
			pos,
			from: pos,
			to: last.pos + last.node.nodeSize,
			target: rule.target === "node" ? { kind: "node", pos } : rule.target === "firstChild" ? { kind: "node", pos: pos + 1 } : { kind: "text", pos: pos + 1 },
			issues: blockIssues(node),
			children: [],
		};
	});
	return {
		id: String(pageIndex),
		label: `Page ${pageIndex + 1} · ${pageTitles[page.attrs.kind as PageKind] ?? pageTitles.continued}`,
		pos: pagePos,
		from: pagePos,
		to: pagePos + page.nodeSize,
		target: { kind: "text", pos: pagePos + 1 },
		issues: children.reduce((sum, child) => sum + child.issues, 0),
		children,
	};
}

const outlines = new WeakMap<ProseMirrorNode, readonly OutlineEntry[]>();

/** Pages, then the sections and headings inside each, with the count of invalid rows. */
export function readOutline(doc: ProseMirrorNode): readonly OutlineEntry[] {
	const cached = outlines.get(doc);
	if (cached) return cached;
	const entries: OutlineEntry[] = [];
	doc.forEach((page, pos, index) => entries.push(readPage(page, pos, index)));
	outlines.set(doc, entries);
	return entries;
}

/** Everything the outline shows, so the list skips the updates where only positions moved. */
export const outlineSignature = (outline: readonly OutlineEntry[]) =>
	outline.map(page => [page, ...page.children].map(entry => `${entry.id}\u0000${entry.label}\u0000${entry.issues}`).join("\u0001")).join("\u0001");

/** The deepest entry whose range holds the position. */
export function findOutlineEntry(outline: readonly OutlineEntry[], pos: number): OutlineEntry | null {
	const page = outline.find(entry => pos >= entry.from && pos < entry.to);
	return page ? (page.children.find(entry => pos >= entry.from && pos < entry.to) ?? page) : null;
}

export function outlineEntryById(outline: readonly OutlineEntry[], id: string): OutlineEntry | null {
	const page = outline[Number(id.split(".")[0])];
	if (!page) return null;
	return page.id === id ? page : (page.children.find(entry => entry.id === id) ?? null);
}
