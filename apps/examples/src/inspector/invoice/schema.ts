import { type DOMOutputSpec, type Node as ProseMirrorNode, Schema } from "prosemirror-model";
import { formatDate, type PageKind, pageTitles, statusLabels, type InvoiceStatus } from "./model";

const columns = ["Description", "Qty", "Unit price", "VAT", "Amount"];

/** Chrome inside the paper that the caret must skip. */
const fixed = { contenteditable: "false" };

function metaDOM(node: ProseMirrorNode): DOMOutputSpec {
	const { number, issueDate, dueDate, status } = node.attrs;
	const fact = (label: string, value: string): DOMOutputSpec => ["div", ["dt", label], ["dd", value]];
	return [
		"header",
		{ class: "pmi-meta", "data-status": status, ...fixed },
		["div", ["p", { class: "pmi-meta-kicker" }, "Invoice"], ["p", { class: "pmi-meta-number" }, number]],
		["dl", fact("Issued", formatDate(issueDate)), fact("Due", formatDate(dueDate)), fact("Status", statusLabels[status as InvoiceStatus])],
	];
}

/**
 * `doc` holds pages, and a page holds invoice sections and prose blocks. Line items carry their
 * numbers as attributes and their description as text, so a row is one node to select, move or validate.
 */
export const schema = new Schema({
	nodes: {
		doc: { content: "page+" },
		page: {
			content: "(block | section)+",
			attrs: { kind: { default: "continued" } },
			isolating: true,
			// The running title is a pseudo-element, and the page number a CSS counter: neither is stored.
			toDOM: node => ["section", { class: "pmi-sheet", "data-title": pageTitles[node.attrs.kind as PageKind] ?? pageTitles.continued }, 0],
		},
		paragraph: { group: "block", content: "inline*", parseDOM: [{ tag: "p" }], toDOM: () => ["p", 0] },
		heading: {
			group: "block",
			content: "inline*",
			attrs: { level: { default: 2 } },
			defining: true,
			parseDOM: [
				{ tag: "h1", attrs: { level: 2 } },
				{ tag: "h2", attrs: { level: 2 } },
				{ tag: "h3", attrs: { level: 3 } },
			],
			toDOM: node => [`h${node.attrs.level}`, 0],
		},
		blockquote: { group: "block", content: "paragraph+", defining: true, parseDOM: [{ tag: "blockquote" }], toDOM: () => ["blockquote", 0] },
		bullet_list: { group: "block", content: "list_item+", parseDOM: [{ tag: "ul" }], toDOM: () => ["ul", 0] },
		ordered_list: { group: "block", content: "list_item+", parseDOM: [{ tag: "ol" }], toDOM: () => ["ol", 0] },
		list_item: { content: "paragraph block*", defining: true, parseDOM: [{ tag: "li" }], toDOM: () => ["li", 0] },
		invoiceMeta: {
			group: "section",
			atom: true,
			attrs: { number: {}, issueDate: {}, dueDate: {}, status: { default: "draft" } },
			toDOM: metaDOM,
		},
		parties: { group: "section", content: "party party", isolating: true, toDOM: () => ["div", { class: "pmi-parties" }, 0] },
		party: {
			content: "paragraph+",
			attrs: { role: { default: "seller" } },
			isolating: true,
			toDOM: node => ["div", { class: "pmi-party", "data-label": node.attrs.role === "seller" ? "From" : "Bill to" }, 0],
		},
		lineItems: {
			group: "section",
			content: "lineItem+",
			isolating: true,
			toDOM: () => [
				"div",
				{ class: "pmi-items" },
				["div", { class: "pmi-items-head", "aria-hidden": "true", ...fixed }, ...columns.map(label => ["span", label] as DOMOutputSpec)],
				["div", { class: "pmi-items-body" }, 0],
			],
		},
		// Rendered by a node view. This is what the clipboard gets.
		lineItem: {
			content: "text*",
			marks: "",
			attrs: { id: { default: "" }, quantity: { default: 1 }, unitPrice: { default: 0 }, vatRate: { default: 22 }, discountPercent: { default: 0 } },
			isolating: true,
			toDOM: () => ["div", { class: "pmi-row" }, 0],
		},
		totals: { group: "section", atom: true, toDOM: () => ["div", { class: "pmi-totals" }] },
		text: { group: "inline" },
	},
	marks: {
		strong: { parseDOM: [{ tag: "strong" }, { tag: "b" }], toDOM: () => ["strong", 0] },
		em: { parseDOM: [{ tag: "em" }, { tag: "i" }], toDOM: () => ["em", 0] },
	},
});

export const { nodes, marks } = schema;
