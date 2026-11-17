import type { Node as ProseMirrorNode } from "prosemirror-model";
import { Plugin, PluginKey } from "prosemirror-state";
import type { EditorView, NodeView, ViewMutationRecord } from "prosemirror-view";
import { readInvoice, readLineItem } from "./document";
import { cents, computeTotals, formatCents, type LineItem, lineNet } from "./model";

/** What a row asks of the editor. The commands live elsewhere, so a row never imports them. */
export interface RowActions {
	edit(pos: number, attrs: Partial<LineItem>): void;
	select(pos: number): void;
	remove(pos: number): void;
}

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className: string, attrs: Record<string, string> = {}) => {
	const node = document.createElement(tag);
	node.className = className;
	for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
	return node;
};

const parseNumber = (value: string) => Number(value.trim().replace(",", "."));

/** One line item: its description is editable text, its numbers are fields, its amount is derived. */
class RowView implements NodeView {
	readonly dom = el("div", "pmi-row");
	readonly contentDOM = el("div", "pmi-row-text");
	private readonly quantity = el("input", "pmi-row-field", { "aria-label": "Quantity", inputmode: "decimal" });
	private readonly price = el("input", "pmi-row-field", { "aria-label": "Unit price", inputmode: "decimal" });
	private readonly vat = el("span", "pmi-row-vat");
	private readonly amount = el("span", "pmi-row-amount");

	constructor(
		private node: ProseMirrorNode,
		view: EditorView,
		getPos: () => number | undefined,
		actions: RowActions,
		private readonly rows: Set<RowView>,
	) {
		// The handle and the delete button stay out of the Tab order: 2,000 rows would bury the page.
		// From the keyboard, Escape selects the row and Backspace deletes it.
		const handle = el("button", "pmi-row-handle", { type: "button", tabindex: "-1", "aria-label": "Select row", contenteditable: "false" });
		handle.textContent = "⋮⋮";
		const remove = el("button", "pmi-row-remove", { type: "button", tabindex: "-1", "aria-label": "Delete row", contenteditable: "false" });
		remove.textContent = "×";
		const fixed = [this.quantity, this.price, this.vat, this.amount];
		for (const node of fixed) node.contentEditable = "false";
		this.dom.append(handle, this.contentDOM, ...fixed, remove);

		const at = (run: (pos: number) => void) => () => {
			const pos = getPos();
			if (pos !== undefined && view.editable) run(pos);
		};
		handle.addEventListener("click", at(pos => actions.select(pos)));
		remove.addEventListener("click", at(pos => actions.remove(pos)));
		const commit = (input: HTMLInputElement, toAttrs: (value: number) => Partial<LineItem>) => {
			input.addEventListener("change", () => {
				const value = parseNumber(input.value);
				const pos = getPos();
				if (Number.isFinite(value) && pos !== undefined && view.editable) actions.edit(pos, toAttrs(value));
				// A rejected edit, or a value that rounds to the old one, never reaches `update`.
				this.render();
			});
			input.addEventListener("keydown", event => event.key === "Enter" && input.blur());
		};
		commit(this.quantity, quantity => ({ quantity }));
		commit(this.price, price => ({ unitPrice: cents(price * 100) }));

		this.setEditable(view.editable);
		this.render();
		rows.add(this);
	}

	private render() {
		const item = readLineItem(this.node);
		this.dom.dataset.rowId = item.id;
		this.quantity.value = String(item.quantity);
		this.price.value = (item.unitPrice / 100).toFixed(2);
		this.vat.textContent = `${item.vatRate}%`;
		this.amount.textContent = formatCents(lineNet(item));
		this.amount.dataset.discount = item.discountPercent ? `−${item.discountPercent}%` : "";
	}

	setEditable(editable: boolean) {
		this.quantity.readOnly = this.price.readOnly = !editable;
	}

	update(node: ProseMirrorNode) {
		if (node.type !== this.node.type) return false;
		const attrsChanged = node.attrs !== this.node.attrs;
		this.node = node;
		if (attrsChanged) this.render();
		return true;
	}

	// The fields and buttons handle their own events, and their DOM is not the document's.
	stopEvent(event: Event) {
		return event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement;
	}

	ignoreMutation(mutation: ViewMutationRecord) {
		return !this.contentDOM.contains(mutation.target);
	}

	destroy() {
		this.rows.delete(this);
	}
}

/** The totals are never stored: the node is an empty atom, and its view reads them from the rows. */
class TotalsView implements NodeView {
	readonly dom = el("dl", "pmi-totals", { contenteditable: "false" });

	constructor(
		view: EditorView,
		private readonly all: Set<TotalsView>,
	) {
		this.render(view.state.doc);
		all.add(this);
	}

	render(doc: ProseMirrorNode) {
		const totals = computeTotals(readInvoice(doc).items);
		const line = (label: string, amount: number, className = "") => {
			const row = el("div", className);
			const term = el("dt", "");
			term.textContent = label;
			const value = el("dd", "");
			value.textContent = formatCents(amount);
			row.append(term, value);
			return row;
		};
		this.dom.replaceChildren(
			line("Net", totals.net),
			...totals.vatByRate.filter(bucket => bucket.rate > 0).map(bucket => line(`VAT ${bucket.rate}%`, bucket.tax)),
			line("Amount due", totals.gross, "pmi-totals-due"),
		);
	}

	ignoreMutation() {
		return true;
	}

	destroy() {
		this.all.delete(this);
	}
}

export const nodeViewsKey = new PluginKey("invoiceNodeViews");

/**
 * Node views are registered through a plugin, not on the view, so the inspector's instrumentation
 * wraps them and Rendering can count them. The plugin view keeps what depends on other nodes in
 * step: the totals follow the rows, and the row fields follow the editable state.
 */
export function createNodeViewsPlugin(actions: RowActions) {
	const rows = new Set<RowView>();
	const totals = new Set<TotalsView>();
	return new Plugin({
		key: nodeViewsKey,
		props: {
			nodeViews: {
				lineItem: (node, view, getPos) => new RowView(node, view, getPos, actions, rows),
				totals: (_node, view) => new TotalsView(view, totals),
			},
		},
		view(view) {
			let editable = view.editable;
			return {
				update(view, previous) {
					if (previous.doc !== view.state.doc) for (const item of totals) item.render(view.state.doc);
					if (editable !== view.editable) {
						editable = view.editable;
						for (const row of rows) row.setEditable(editable);
					}
				},
			};
		},
	});
}
