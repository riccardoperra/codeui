import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { InvoiceMeta, LineItem } from "./model";
import { nodes } from "./schema";

export interface PositionedNode {
	readonly node: ProseMirrorNode;
	readonly pos: number;
}

export function readLineItem(node: ProseMirrorNode): LineItem {
	const { id, quantity, unitPrice, vatRate, discountPercent } = node.attrs as Omit<LineItem, "description">;
	return { id, quantity, unitPrice, vatRate, discountPercent, description: node.textContent };
}

export function pages(doc: ProseMirrorNode): PositionedNode[] {
	const found: PositionedNode[] = [];
	doc.forEach((node, pos) => found.push({ node, pos }));
	return found;
}

/** Pages hold sections, so every invoice node lives at depth 2 and a scan never goes deeper. */
export function sections(doc: ProseMirrorNode): PositionedNode[] {
	const found: PositionedNode[] = [];
	doc.forEach((page, pagePos) => page.forEach((node, offset) => found.push({ node, pos: pagePos + 1 + offset })));
	return found;
}

export function lineItemRows(doc: ProseMirrorNode): PositionedNode[] {
	const rows: PositionedNode[] = [];
	for (const { node, pos } of sections(doc)) {
		if (node.type === nodes.lineItems) node.forEach((row, offset) => rows.push({ node: row, pos: pos + 1 + offset }));
	}
	return rows;
}

/** Rows touched by the range, so a text selection across rows acts on every row it crosses. */
export const rowsInRange = (doc: ProseMirrorNode, from: number, to: number): PositionedNode[] =>
	lineItemRows(doc).filter(({ node, pos }) => pos + node.nodeSize > from && pos < Math.max(to, from + 1));

export const findSection = (doc: ProseMirrorNode, type: ProseMirrorNode["type"]): PositionedNode | null =>
	sections(doc).find(({ node }) => node.type === type) ?? null;

export interface Invoice {
	readonly meta: InvoiceMeta;
	readonly items: readonly LineItem[];
}

const invoices = new WeakMap<ProseMirrorNode, Invoice>();

/**
 * The totals, the status control and the read-only plugin all read the invoice, so it is computed
 * once per document and a selection-only transaction costs nothing.
 */
export function readInvoice(doc: ProseMirrorNode): Invoice {
	const cached = invoices.get(doc);
	if (cached) return cached;
	let meta: InvoiceMeta = { number: "", issueDate: "", dueDate: "", status: "draft" };
	const items: LineItem[] = [];
	for (const { node } of sections(doc)) {
		if (node.type === nodes.invoiceMeta) meta = node.attrs as InvoiceMeta;
		if (node.type === nodes.lineItems) node.forEach(row => items.push(readLineItem(row)));
	}
	const invoice = { meta, items };
	invoices.set(doc, invoice);
	return invoice;
}

export const readMeta = (doc: ProseMirrorNode) => readInvoice(doc).meta;

export const createLineItemId = () => `li-${crypto.randomUUID().slice(0, 8)}`;
