import type { Node as ProseMirrorNode } from "prosemirror-model";
import { type EditorState, NodeSelection, Plugin, PluginKey, type Transaction } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { mark, markDomainEvents, measure } from "../devtools";
import { lineItemRows, readLineItem, readMeta } from "./document";
import { isLocked, type Issue, validateLineItem } from "./model";
import { nodes } from "./schema";

// --- Validation -------------------------------------------------------------------------------

export interface InvalidRow {
	readonly id: string;
	readonly pos: number;
	readonly issues: readonly Issue[];
}

export interface ValidationState {
	/** Artificial cost per recompute, so the Performance panel has a hot plugin hook to show. */
	readonly delayMs: number;
	readonly invalid: readonly InvalidRow[];
	readonly decorations: DecorationSet;
}

function busyWait(ms: number) {
	const until = performance.now() + ms;
	while (performance.now() < until) {
		// Blocks on purpose: the slow-plugin scenario needs real main-thread time in the hook.
	}
}

function validate(doc: ProseMirrorNode, delayMs: number): ValidationState {
	return measure("Validate line items", "validation", () => {
		if (delayMs > 0) busyWait(delayMs);
		const invalid: InvalidRow[] = [];
		const decorations: Decoration[] = [];
		const rows = lineItemRows(doc);
		for (const { node, pos } of rows) {
			const item = readLineItem(node);
			const issues = validateLineItem(item);
			if (issues.length === 0) continue;
			invalid.push({ id: item.id, pos, issues });
			// The paper prints `data-issues` under the row, so the message needs no widget.
			decorations.push(Decoration.node(pos, pos + node.nodeSize, { class: "pmi-invalid", "data-issues": issues.map(issue => issue.message).join(" ") }));
		}
		mark("Validation", "validation", { rows: rows.length, invalid: invalid.length, delayMs });
		return { delayMs, invalid, decorations: DecorationSet.create(doc, decorations) };
	});
}

export const validationKey = new PluginKey<ValidationState>("lineItemValidation");

export const validationPlugin = new Plugin<ValidationState>({
	key: validationKey,
	state: {
		init: (_config, state) => validate(state.doc, 0),
		apply(tr, value, _oldState, newState) {
			const delay = tr.getMeta(validationKey) as { delayMs: number } | undefined;
			if (delay) return validate(newState.doc, delay.delayMs);
			return tr.docChanged ? validate(newState.doc, value.delayMs) : value;
		},
	},
	props: { decorations: state => validationKey.getState(state)?.decorations },
});

export const setValidationDelay = (tr: Transaction, delayMs: number) => tr.setMeta(validationKey, { delayMs });

// --- Line item ids ----------------------------------------------------------------------------

export const lineItemIdsKey = new PluginKey("lineItemIds");

/** A duplicate takes the first free `<id>-<n>`, so the result depends only on the document. */
function normalizeLineItemIds(state: EditorState): Transaction | null {
	const rows = lineItemRows(state.doc);
	const taken = new Set(rows.map(({ node }) => node.attrs.id as string));
	const seen = new Set<string>();
	let tr: Transaction | null = null;
	for (const { node, pos } of rows) {
		const id = node.attrs.id as string;
		if (id && !seen.has(id)) {
			seen.add(id);
			continue;
		}
		const base = id || "li";
		let suffix = 2;
		while (taken.has(`${base}-${suffix}`)) suffix += 1;
		const fresh = `${base}-${suffix}`;
		taken.add(fresh);
		seen.add(fresh);
		tr = (tr ?? state.tr).setNodeAttribute(pos, "id", fresh);
	}
	return tr;
}

export const lineItemIdsPlugin = new Plugin({
	key: lineItemIdsKey,
	appendTransaction(transactions, _oldState, state) {
		if (!transactions.some(tr => tr.docChanged)) return null;
		return measure("Normalize line item ids", "normalizer", () => normalizeLineItemIds(state));
	},
});

// --- Find -------------------------------------------------------------------------------------

export interface FindMatch {
	readonly from: number;
	readonly to: number;
}

export interface FindState {
	readonly query: string;
	readonly matches: readonly FindMatch[];
	readonly decorations: DecorationSet;
}

const noMatches: FindState = { query: "", matches: [], decorations: DecorationSet.empty };

function search(doc: ProseMirrorNode, query: string): FindState {
	if (!query) return noMatches;
	return measure("Find matches", "find", () => {
		const needle = query.toLocaleLowerCase();
		const matches: FindMatch[] = [];
		doc.descendants((node, pos) => {
			if (!node.isTextblock) return true;
			const haystack = node.textContent.toLocaleLowerCase();
			for (let index = haystack.indexOf(needle); index >= 0; index = haystack.indexOf(needle, index + needle.length)) {
				matches.push({ from: pos + 1 + index, to: pos + 1 + index + needle.length });
			}
			return false;
		});
		const decorations = DecorationSet.create(
			doc,
			matches.map(({ from, to }) => Decoration.inline(from, to, { class: "pmi-find-match" })),
		);
		mark("Find decorations", "find", { query, decorations: matches.length });
		return { query, matches, decorations };
	});
}

export const findKey = new PluginKey<FindState>("find");

export const setFindQuery = (tr: Transaction, query: string) => tr.setMeta(findKey, { query });

export const getFindState = (state: EditorState): FindState => findKey.getState(state) ?? noMatches;

export const findPlugin = new Plugin<FindState>({
	key: findKey,
	state: {
		init: () => noMatches,
		apply(tr, value, _oldState, newState) {
			const meta = tr.getMeta(findKey) as { query: string } | undefined;
			if (meta) return search(newState.doc, meta.query);
			return tr.docChanged && value.query ? search(newState.doc, value.query) : value;
		},
	},
	props: { decorations: state => findKey.getState(state)?.decorations },
});

// --- Spotlight --------------------------------------------------------------------------------

/** A node spotlight outlines one node. A text spotlight highlights an inline range. */
export interface SpotlightRange {
	readonly kind: "node" | "text";
	readonly from: number;
	readonly to: number;
}

export const spotlightKey = new PluginKey<SpotlightRange | null>("spotlight");

export const setSpotlight = (tr: Transaction, spotlight: SpotlightRange) => tr.setMeta(spotlightKey, spotlight);

/**
 * A jump from the outline or a scenario leaves the editor without focus, or read-only, so its
 * native selection is invisible. The spotlight is a decoration and shows until the selection moves.
 */
export const spotlightPlugin = new Plugin<SpotlightRange | null>({
	key: spotlightKey,
	state: {
		init: () => null,
		apply(tr, value) {
			const next = tr.getMeta(spotlightKey) as SpotlightRange | undefined;
			if (next) return next;
			if (!value || tr.selectionSet) return null;
			if (!tr.docChanged) return value;
			const from = tr.mapping.map(value.from, 1);
			const to = tr.mapping.map(value.to, -1);
			return from < to ? { ...value, from, to } : null;
		},
	},
	props: {
		decorations(state) {
			const spotlight = spotlightKey.getState(state);
			if (!spotlight) return null;
			const decoration =
				spotlight.kind === "node"
					? Decoration.node(spotlight.from, spotlight.to, { class: "pmi-spotlit" })
					: Decoration.inline(spotlight.from, spotlight.to, { class: "pmi-spotlight-text" });
			return DecorationSet.create(state.doc, [decoration]);
		},
	},
});

// --- Active row -------------------------------------------------------------------------------

function activeRow(state: EditorState): { from: number; to: number } | null {
	const { selection } = state;
	if (selection instanceof NodeSelection && selection.node.type === nodes.lineItem) return { from: selection.from, to: selection.to };
	const { $from } = selection;
	for (let depth = $from.depth; depth > 0; depth -= 1) {
		if ($from.node(depth).type === nodes.lineItem) return { from: $from.before(depth), to: $from.after(depth) };
	}
	return null;
}

export const activeRowKey = new PluginKey("activeRow");

export const activeRowPlugin = new Plugin({
	key: activeRowKey,
	props: {
		decorations(state) {
			const row = activeRow(state);
			return row ? DecorationSet.create(state.doc, [Decoration.node(row.from, row.to, { class: "pmi-active" })]) : null;
		},
	},
});

// --- Domain events ----------------------------------------------------------------------------

export const domainEventsKey = new PluginKey("invoiceDomainEvents");

export const domainEventsPlugin = new Plugin({
	key: domainEventsKey,
	appendTransaction(transactions) {
		markDomainEvents(transactions);
		return null;
	},
});

// --- Read-only --------------------------------------------------------------------------------

export const readOnlyKey = new PluginKey("invoiceReadOnly");

/** A status change or a reset is the way out of a locked invoice, so it carries this pass. */
export const allowWhenLocked = (tr: Transaction) => tr.setMeta(readOnlyKey, true);

/**
 * The status attribute is the single source of truth, so editability is derived from the state
 * on every read. `editable` stops the user, and the filter stops commands, scenarios and undo.
 */
export const readOnlyPlugin = new Plugin({
	key: readOnlyKey,
	props: { editable: state => !isLocked(readMeta(state.doc).status) },
	filterTransaction: (tr, state) => !tr.docChanged || tr.getMeta(readOnlyKey) === true || !isLocked(readMeta(state.doc).status),
});
