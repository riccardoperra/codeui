import type { Node as ProseMirrorNode } from "prosemirror-model";
import { cents, type InvoiceMeta, type LineItem, type PageKind, vatRates } from "./model";
import { schema } from "./schema";

type Json = { type: string; attrs?: Record<string, unknown>; content?: Json[]; text?: string; marks?: { type: string }[] };

export const rowsPerPage = 22;
/** Stress pages hold a few more rows, as a dense statement would. */
export const stressRowsPerPage = 25;

const meta: InvoiceMeta = { number: "INV-2026-0142", issueDate: "2026-11-14", dueDate: "2026-12-14", status: "draft" };

// The last row fails two validation rules, so the outline and the paper start with something to fix.
const featuredRows: readonly LineItem[] = [
	{ id: "li-design", description: "Editor architecture review", quantity: 2, unitPrice: cents(120_000), vatRate: 22, discountPercent: 0 },
	{ id: "li-plugins", description: "Custom ProseMirror plugins, per plugin", quantity: 4, unitPrice: cents(45_000), vatRate: 22, discountPercent: 5 },
	{ id: "li-training", description: "On-site team training (half day)", quantity: 1, unitPrice: cents(80_000), vatRate: 10, discountPercent: 0 },
	{ id: "li-books", description: "Printed reference manuals", quantity: 6, unitPrice: cents(3_500), vatRate: 4, discountPercent: 0 },
	{ id: "li-travel", description: "", quantity: 0, unitPrice: cents(18_000), vatRate: 0, discountPercent: 0 },
];

const generatedDescriptions = [
	"Consulting hours",
	"Content migration batch",
	"Schema review",
	"Accessibility audit",
	"Performance profiling session",
	"Collaboration backend support",
	"Release engineering",
];

/** Deterministic rows. `invalidEvery` plants rows that fail validation, so decorations appear throughout. */
export function generateLineItems(count: number, invalidEvery = 0): LineItem[] {
	return Array.from({ length: count }, (_, index) => ({
		id: `li-gen-${index + 1}`,
		description: `${generatedDescriptions[index % generatedDescriptions.length]} #${index + 1}`,
		quantity: invalidEvery && index % invalidEvery === invalidEvery - 1 ? 0 : (index % 7) + 1,
		unitPrice: cents(2_500 + ((index * 1_337) % 40_000)),
		vatRate: vatRates[index % vatRates.length],
		discountPercent: index % 9 === 0 ? 10 : 0,
	}));
}

const text = (value: string, ...marks: string[]): Json => ({ type: "text", text: value, ...(marks.length ? { marks: marks.map(type => ({ type })) } : {}) });
const paragraph = (...content: Json[]): Json => ({ type: "paragraph", content });
const heading = (level: number, value: string): Json => ({ type: "heading", attrs: { level }, content: [text(value)] });
const list = (type: "bullet_list" | "ordered_list", items: string[]): Json => ({
	type,
	content: items.map(item => ({ type: "list_item", content: [paragraph(text(item))] })),
});
const page = (kind: PageKind, ...content: Json[]): Json => ({ type: "page", attrs: { kind }, content });
const lineItem = ({ description, ...attrs }: LineItem): Json => ({ type: "lineItem", attrs, ...(description ? { content: [text(description)] } : {}) });

/** Explicit pagination: a fixed number of rows per page, with the totals closing the last one. */
function lineItemPagesJson(items: readonly LineItem[], perPage: number): Json[] {
	const result: Json[] = [];
	for (let start = 0; start < Math.max(items.length, 1); start += perPage) {
		result.push(page("lineItems", { type: "lineItems", content: items.slice(start, start + perPage).map(lineItem) }));
	}
	result.at(-1)!.content!.push({ type: "totals" });
	return result;
}

export const lineItemPages = (items: readonly LineItem[], perPage: number): ProseMirrorNode[] =>
	lineItemPagesJson(items, perPage).map(json => schema.nodeFromJSON(json));

export const createInitialDoc = (): ProseMirrorNode =>
	schema.nodeFromJSON({
		type: "doc",
		content: [
			page(
				"cover",
				{ type: "invoiceMeta", attrs: { ...meta } },
				{
					type: "parties",
					content: [
						{
							type: "party",
							attrs: { role: "seller" },
							content: [paragraph(text("Northwind Editorial Studio S.r.l.")), paragraph(text("Via Solferino 12, 20121 Milano, Italy")), paragraph(text("VAT IT 01234567890"))],
						},
						{
							type: "party",
							attrs: { role: "buyer" },
							content: [paragraph(text("Acme Logistics GmbH")), paragraph(text("Speicherstadt 4, 20457 Hamburg, Germany")), paragraph(text("Attn. Accounts payable"))],
						},
					],
				},
				paragraph(text("Dear Acme Logistics, this dossier covers the "), text("editor platform engagement", "strong"), text(" for October 2026.")),
			),
			...lineItemPagesJson([...featuredRows, ...generateLineItems(60)], rowsPerPage),
			page(
				"terms",
				heading(2, "Terms"),
				list("ordered_list", [
					"Payment by bank transfer to IBAN IT60 X054 2811 1010 0000 0123 456.",
					"Late payments accrue statutory interest under Legislative Decree 231/2002.",
					"Disputes must be raised in writing within 15 days of the issue date.",
				]),
				heading(3, "Notes"),
				paragraph(text("Please pay the amount due by 14 Dec 2026. "), text("Travel expenses are billed at cost.", "em")),
				list("bullet_list", ["Rates include project management and code review.", "Hardware and third-party licences are not included."]),
				{ type: "blockquote", content: [paragraph(text("Thank you for trusting us with your editor. ", "em"), text("Northwind Editorial Studio"))] },
			),
		],
	});
