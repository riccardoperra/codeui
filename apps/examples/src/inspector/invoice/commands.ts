import { setBlockType, toggleMark as pmToggleMark } from "prosemirror-commands";
import { redo as pmRedo, undo as pmUndo } from "prosemirror-history";
import { Fragment, type MarkType } from "prosemirror-model";
import { liftListItem, wrapInList } from "prosemirror-schema-list";
import { type Command, type EditorState, NodeSelection, Selection, TextSelection, type Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import { tagDomainEvent } from "../devtools";
import type { Editor } from "../editor";
import { createLineItemId, findSection, lineItemRows, pages, readLineItem, readMeta, rowsInRange, sections } from "./document";
import { createInitialDoc, generateLineItems, lineItemPages, stressRowsPerPage } from "./fixture";
import { cents, type InvoiceStatus, type LineItem, reprice, statusPath } from "./model";
import type { OutlineEntry } from "./outline";
import { allowWhenLocked, getFindState, setFindQuery, setSpotlight, setValidationDelay, type SpotlightRange } from "./plugins";
import { nodes } from "./schema";

type Build = (state: EditorState) => Transaction | null;

/** False when the transaction changed nothing: the read-only filter rejects edits to a paid invoice. */
function dispatch(view: EditorView, tr: Transaction): boolean {
	const before = view.state;
	view.dispatch(tr);
	if (view.state === before) return false;
	if (tr.scrolledIntoView) scrollToSelection(view);
	return true;
}

function run(editor: Editor, name: string, build: Build): boolean {
	return editor.trace(name, () => {
		const tr = build(editor.view.state);
		return tr ? dispatch(editor.view, tr) : false;
	});
}

/** Runs a stock ProseMirror command from the toolbar, and hands the caret back to the document. */
function exec(editor: Editor, name: string, command: Command): boolean {
	const done = editor.trace(name, () => command(editor.view.state, editor.view.dispatch, editor.view));
	editor.view.focus();
	return done;
}

/**
 * ProseMirror scrolls to the DOM selection, which an editor without focus does not have. A
 * scenario leaves the focus on its button, so the scroll is done here from the document position.
 */
function scrollToSelection(view: EditorView, block: "nearest" | "start" = "nearest") {
	const scroller = view.dom.closest<HTMLElement>(".pmi-scroll");
	if (!scroller) return;
	const { selection } = view.state;
	const node = selection instanceof NodeSelection ? view.nodeDOM(selection.from) : null;
	const rect = node instanceof HTMLElement ? node.getBoundingClientRect() : view.coordsAtPos(selection.head);
	const frame = scroller.getBoundingClientRect();
	// The floating toolbar covers the top of the scroller, and the inspector may cover its bottom.
	const top = frame.top + 72;
	const bottom = frame.bottom - (Number.parseFloat(getComputedStyle(scroller).paddingBottom) || 0) - 24;
	if (block === "nearest" && rect.top >= top && rect.bottom <= bottom) return;
	// Never animated: a jump across a 2,000-row invoice would take seconds.
	scroller.scrollBy({ top: rect.top - top - (block === "start" ? 0 : (bottom - top) / 3) });
}

// --- Rows -------------------------------------------------------------------------------------

const newRow = (state: EditorState) =>
	nodes.lineItem.create({ id: createLineItemId(), quantity: 1, unitPrice: cents(0), vatRate: 22, discountPercent: 0 }, state.schema.text("New line item"));

/** Appends a row to the last table, with its placeholder text selected so typing replaces it. */
export function addLineItem(editor: Editor): boolean {
	const added = run(editor, "Add line item", state => {
		const container = sections(state.doc).findLast(({ node }) => node.type === nodes.lineItems);
		if (!container) return null;
		const end = container.pos + container.node.nodeSize - 1;
		const row = newRow(state);
		const tr = state.tr.insert(end, row);
		return tr.setSelection(TextSelection.create(tr.doc, end + 1, end + 1 + row.content.size)).scrollIntoView();
	});
	if (added) editor.view.focus();
	return added;
}

/** An empty row with no quantity, which fails two validation rules. */
export function addInvalidLineItem(editor: Editor): boolean {
	return run(editor, "Add invalid line item", state => {
		const container = sections(state.doc).findLast(({ node }) => node.type === nodes.lineItems);
		if (!container) return null;
		const end = container.pos + container.node.nodeSize - 1;
		const tr = state.tr.insert(end, nodes.lineItem.create({ id: createLineItemId(), quantity: 0, unitPrice: cents(0) }));
		return tr.setSelection(NodeSelection.create(tr.doc, end)).scrollIntoView();
	});
}

/** Enter in a row starts the next one, as in a spreadsheet. */
export const insertRowAfter: Command = (state, dispatch) => {
	const { $from, empty } = state.selection;
	if (!empty || $from.parent.type !== nodes.lineItem) return false;
	if (dispatch) {
		const after = $from.after();
		const row = newRow(state);
		const tr = state.tr.insert(after, row);
		dispatch(tr.setSelection(TextSelection.create(tr.doc, after + 1, after + 1 + row.content.size)).scrollIntoView());
	}
	return true;
};

export function duplicateSelectedRows(editor: Editor): boolean {
	return run(editor, "Duplicate rows", state => {
		const rows = rowsInRange(state.doc, state.selection.from, state.selection.to);
		const last = rows.at(-1);
		return last ? state.tr.insert(last.pos + last.node.nodeSize, Fragment.from(rows.map(({ node }) => node))) : null;
	});
}

export function deleteRow(editor: Editor, pos: number): boolean {
	return run(editor, "Delete row", state => {
		const row = state.doc.nodeAt(pos);
		// Each table keeps one row.
		if (row?.type !== nodes.lineItem || state.doc.resolve(pos).parent.childCount < 2) return null;
		return state.tr.delete(pos, pos + row.nodeSize);
	});
}

export function editRow(editor: Editor, pos: number, attrs: Partial<LineItem>): boolean {
	return run(editor, "Edit line item", state => {
		const row = state.doc.nodeAt(pos);
		return row?.type === nodes.lineItem ? state.tr.setNodeMarkup(pos, undefined, { ...row.attrs, ...attrs }) : null;
	});
}

export function selectRow(editor: Editor, pos: number): boolean {
	const selected = run(editor, "Select row", state => state.tr.setSelection(NodeSelection.create(state.doc, pos)));
	editor.view.focus();
	return selected;
}

// --- Bulk edits -------------------------------------------------------------------------------

export function applyDiscountToAll(editor: Editor, percent: number): boolean {
	return run(editor, "Apply discount", state => {
		const tr = state.tr;
		const rows = lineItemRows(state.doc);
		for (const { pos } of rows) tr.setNodeAttribute(pos, "discountPercent", percent);
		return tagDomainEvent(tr, { label: "Discount applied", tone: "success", data: { percent, rows: rows.length } });
	});
}

export function repriceInOneTransaction(editor: Editor, percent: number): boolean {
	return run(editor, "Reprice rows (one transaction)", state => {
		const tr = state.tr;
		const rows = lineItemRows(state.doc);
		for (const { node, pos } of rows) tr.setNodeAttribute(pos, "unitPrice", reprice(readLineItem(node), percent));
		return tagDomainEvent(tr, { label: "Bulk reprice", data: { mode: "single transaction", rows: rows.length, percent } });
	});
}

export const repriceDispatchLimit = 200;

/** One dispatch per row costs a validation pass per row, so the comparison caps the row count. */
export function repriceRowByRow(editor: Editor, percent: number): boolean {
	return editor.trace("Reprice rows (one dispatch each)", () => {
		const { view } = editor;
		const rows = lineItemRows(view.state.doc).slice(0, repriceDispatchLimit);
		let changed = false;
		for (const [index, { pos }] of rows.entries()) {
			// An attribute change keeps every position, so the positions read up front stay valid.
			const node = view.state.doc.nodeAt(pos);
			if (!node) continue;
			const tr = view.state.tr.setNodeAttribute(pos, "unitPrice", reprice(readLineItem(node), percent));
			if (index === 0) tagDomainEvent(tr, { label: "Bulk reprice", data: { mode: "one dispatch per row", rows: rows.length, percent } });
			changed = dispatch(view, tr) || changed;
		}
		return changed;
	});
}

export function loadStressInvoice(editor: Editor, count: number, invalidEvery: number): boolean {
	return run(editor, "Load stress invoice", state => {
		const itemPages = pages(state.doc).filter(({ node }) => node.attrs.kind === "lineItems");
		const first = itemPages[0];
		const last = itemPages.at(-1);
		if (!first || !last) return null;
		const replacement = lineItemPages(generateLineItems(count, invalidEvery), stressRowsPerPage);
		const tr = state.tr.replaceWith(first.pos, last.pos + last.node.nodeSize, replacement);
		return tagDomainEvent(tr, { label: "Stress invoice loaded", tone: "warning", data: { rows: count, pages: replacement.length } });
	});
}

export function setSlowPlugin(editor: Editor, delayMs: number): boolean {
	return run(editor, "Set validation delay", state =>
		tagDomainEvent(setValidationDelay(state.tr, delayMs), { label: "Slow plugin configured", tone: delayMs > 0 ? "warning" : "neutral", data: { delayMs } }),
	);
}

/** Replaces the whole document, so one undo brings the previous invoice back. */
export function resetDocument(editor: Editor): boolean {
	return run(editor, "Reset document", state => {
		const tr = state.tr.replaceWith(0, state.doc.content.size, createInitialDoc().content);
		return allowWhenLocked(setValidationDelay(setFindQuery(tr, ""), 0));
	});
}

// --- Status -----------------------------------------------------------------------------------

/** Walks the status to `next`, one dispatch per step: draft reaches paid through sent. */
export function setStatus(editor: Editor, next: InvoiceStatus): boolean {
	let changed = false;
	for (const step of statusPath(readMeta(editor.view.state.doc).status, next)) {
		changed =
			run(editor, `Mark as ${step}`, state => {
				const meta = findSection(state.doc, nodes.invoiceMeta);
				if (!meta) return null;
				const tr = allowWhenLocked(state.tr.setNodeAttribute(meta.pos, "status", step));
				return tagDomainEvent(tr, { label: "Status changed", data: { from: meta.node.attrs.status, to: step } });
			}) || changed;
	}
	return changed;
}

// --- Selections -------------------------------------------------------------------------------

export function selectFirstRow(editor: Editor): boolean {
	return run(editor, "Select first row", state => {
		const first = lineItemRows(state.doc)[0];
		return first ? state.tr.setSelection(NodeSelection.create(state.doc, first.pos)).scrollIntoView() : null;
	});
}

/** From the last row of one line-item page into the first row of the next one. */
export function selectAcrossPages(editor: Editor): boolean {
	return run(editor, "Select across pages", state => {
		const rows = lineItemRows(state.doc);
		const pageOf = (pos: number) => state.doc.resolve(pos).index(0);
		const boundary = rows.findIndex((row, index) => index > 0 && pageOf(row.pos) !== pageOf(rows[index - 1].pos));
		if (boundary < 1) return null;
		const from = rows[boundary - 1].pos + 1;
		const to = rows[boundary].pos + rows[boundary].node.nodeSize - 1;
		const tr = state.tr.setSelection(TextSelection.create(state.doc, from, to)).scrollIntoView();
		return setSpotlight(tr, { kind: "text", from, to });
	});
}

/** Selects, spotlights and scrolls to an outline entry, then gives the editor the focus. */
export function revealOutlineEntry(editor: Editor, entry: OutlineEntry): boolean {
	return editor.trace("Jump to outline entry", () => {
		const { view } = editor;
		const node = view.state.doc.nodeAt(entry.pos);
		if (!node) return false;
		const { doc } = view.state;
		const selection = entry.target.kind === "node" ? NodeSelection.create(doc, entry.target.pos) : Selection.near(doc.resolve(entry.target.pos));
		const spotlight: SpotlightRange = { kind: "node", from: entry.pos, to: entry.pos + node.nodeSize };
		view.dispatch(setSpotlight(view.state.tr.setSelection(selection), spotlight));
		view.focus();
		view.dom.querySelector(".pmi-spotlit")?.scrollIntoView({ block: "start" });
		return true;
	});
}

// --- Find -------------------------------------------------------------------------------------

export const findQuery = (editor: Editor, query: string) => run(editor, "Find", state => setFindQuery(state.tr, query));

export function findStep(editor: Editor, direction: 1 | -1): boolean {
	return run(editor, direction === 1 ? "Find next" : "Find previous", state => {
		const { matches } = getFindState(state);
		const { from } = state.selection;
		const match = direction === 1 ? (matches.find(candidate => candidate.from > from) ?? matches[0]) : (matches.findLast(candidate => candidate.from < from) ?? matches.at(-1));
		if (!match) return null;
		const tr = state.tr.setSelection(TextSelection.create(state.doc, match.from, match.to)).scrollIntoView();
		return setSpotlight(tr, { kind: "text", ...match });
	});
}

// --- Text -------------------------------------------------------------------------------------

export const undo = (editor: Editor) => exec(editor, "Undo", pmUndo);
export const redo = (editor: Editor) => exec(editor, "Redo", pmRedo);
export const toggleMark = (editor: Editor, mark: MarkType) => exec(editor, `Toggle ${mark.name}`, pmToggleMark(mark));

export const blockKinds = {
	paragraph: "Text",
	heading: "Heading",
	subheading: "Subheading",
	bullet_list: "Bulleted list",
	ordered_list: "Numbered list",
} as const;
export type BlockKind = keyof typeof blockKinds;

const listTypes = [nodes.bullet_list, nodes.ordered_list];

/** The kind of the block that holds the caret, or null where the block cannot change: a row, a party, an atom. */
export function currentBlock(state: EditorState): BlockKind | null {
	const { $from, $to } = state.selection;
	if (!$from.sameParent($to) || !$from.parent.isTextblock || $from.parent.type === nodes.lineItem) return null;
	for (let depth = $from.depth - 1; depth > 0; depth -= 1) {
		const type = $from.node(depth).type;
		if (type === nodes.party) return null;
		if (listTypes.includes(type)) return type.name as BlockKind;
	}
	if ($from.parent.type === nodes.heading) return $from.parent.attrs.level === 2 ? "heading" : "subheading";
	return "paragraph";
}

export function setBlock(editor: Editor, kind: BlockKind): boolean {
	const current = currentBlock(editor.view.state);
	if (!current || current === kind) return false;
	const isList = (value: BlockKind) => value === "bullet_list" || value === "ordered_list";
	const steps: Command[] = [];
	if (isList(current) && isList(kind)) {
		// The other list type is the same structure, so only the list node changes.
		steps.push((state, dispatch) => {
			const { $from } = state.selection;
			for (let depth = $from.depth; depth > 0; depth -= 1) {
				if (!listTypes.includes($from.node(depth).type)) continue;
				dispatch?.(state.tr.setNodeMarkup($from.before(depth), nodes[kind]));
				return true;
			}
			return false;
		});
	} else {
		if (isList(current)) steps.push(liftListItem(nodes.list_item));
		else if (current !== "paragraph") steps.push(setBlockType(nodes.paragraph));
		if (isList(kind)) steps.push(wrapInList(nodes[kind]));
		else if (kind !== "paragraph") steps.push(setBlockType(nodes.heading, { level: kind === "heading" ? 2 : 3 }));
	}
	return exec(editor, `Set block to ${blockKinds[kind].toLowerCase()}`, (_state, _dispatch, view) => {
		let done = false;
		for (const step of steps) done = step(view!.state, view!.dispatch, view) || done;
		return done;
	});
}

export const markActive = (state: EditorState, mark: MarkType) => {
	const { from, $from, to, empty } = state.selection;
	return empty ? !!mark.isInSet(state.storedMarks ?? $from.marks()) : state.doc.rangeHasMark(from, to, mark);
};
