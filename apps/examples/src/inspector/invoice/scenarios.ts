import { type PanelId, takeSnapshot } from "../devtools";
import type { Editor } from "../editor";
import {
	addInvalidLineItem,
	applyDiscountToAll,
	duplicateSelectedRows,
	findQuery,
	loadStressInvoice,
	repriceDispatchLimit,
	repriceInOneTransaction,
	repriceRowByRow,
	selectAcrossPages,
	selectFirstRow,
	setSlowPlugin,
	setStatus,
	undo,
} from "./commands";

export interface Scenario {
	readonly id: string;
	readonly title: string;
	readonly description: string;
	/** False when the command had nothing to do. */
	run(editor: Editor): boolean;
	/** The inspector panel that shows the result, and what to look for there. */
	readonly panel: PanelId;
	readonly observe: string;
}

export const scenarios: readonly Scenario[] = [
	{
		id: "row-node-selection",
		title: "Select a row as a node",
		description: "Creates a NodeSelection around the first line item.",
		run: selectFirstRow,
		panel: "selection",
		observe: "A node selection whose node is lineItem, with the lineItems section as its parent.",
	},
	{
		id: "cross-page-selection",
		title: "Select across a page boundary",
		description: "A TextSelection from the last row of one page into the first row of the next.",
		run: selectAcrossPages,
		panel: "selection",
		observe: "Anchor and head resolve into different page ancestors.",
	},
	{
		id: "duplicate-normalize",
		title: "Duplicate a row",
		description: "Copies the first row, then the id normalizer rewrites the duplicate id.",
		run: editor => selectFirstRow(editor) && duplicateSelectedRows(editor),
		panel: "history",
		observe: "A root transaction followed by an appended one from lineItemIds that sets a new id.",
	},
	{
		id: "validation-state",
		title: "Add an invalid row",
		description: "Adds an empty row with no quantity, which fails two validation rules.",
		run: addInvalidLineItem,
		panel: "inspection-context",
		observe: "Under Technical details, the invoice-validation projection counts one more invalid row.",
	},
	{
		id: "slow-plugin",
		title: "Slow validation plugin",
		description: "Makes every validation recompute busy-wait 40 ms, then recomputes once.",
		run: editor => setSlowPlugin(editor, 40),
		panel: "performance",
		observe: "lineItemValidation’s apply hook tops the plugin ranking, next to a Validation marker.",
	},
	{
		id: "decoration-flood",
		title: "Decoration flood",
		description: "Searches for the letter e. On a stress invoice that is thousands of inline decorations.",
		run: editor => findQuery(editor, "e"),
		panel: "decorations",
		observe: "The find plugin’s decoration source, with one inline range per match.",
	},
	{
		id: "bulk-single",
		title: "Reprice in one transaction",
		description: "Raises every unit price by 5% with a single dispatch.",
		run: editor => repriceInOneTransaction(editor, 5),
		panel: "performance",
		observe: "One dispatch with a Bulk reprice marker that reports the row count.",
	},
	{
		id: "bulk-many",
		title: "Reprice row by row",
		description: `Raises up to ${repriceDispatchLimit} unit prices by 5% with one dispatch per row.`,
		run: editor => repriceRowByRow(editor, 5),
		panel: "performance",
		observe: "Dozens of dispatches, each paying for validation. Compare the total with one transaction.",
	},
	{
		id: "undo-bulk",
		title: "Undo a bulk edit",
		description: "Applies a 10% discount to every row in one transaction, then undoes it.",
		run: editor => applyDiscountToAll(editor, 10) && undo(editor),
		panel: "history",
		observe: "The undo dispatch restores every discount in one history step: undo depth drops by one, redo depth rises by one.",
	},
	{
		id: "snapshot-restore",
		title: "Snapshot before a bulk edit",
		description: "Saves a snapshot named Before reprice, then raises every unit price by 5%.",
		run: editor => takeSnapshot(editor.view, "Before reprice") && repriceInOneTransaction(editor, 5),
		panel: "snapshots",
		observe: "Before reprice is listed. Restore previews the difference, then puts the old prices back in one transaction.",
	},
	{
		id: "nodeview-stress",
		title: "Node views under load",
		description: "Replaces the line items with 1,000 generated rows on 40 pages.",
		run: editor => loadStressInvoice(editor, 1000, 25),
		panel: "performance",
		observe: "One dispatch whose view update dominates while 1,000 row node views mount. Rendering counts them.",
	},
	{
		id: "status-paid",
		title: "Mark the invoice paid",
		description: "Moves the status to sent, then to paid. A paid invoice is read-only.",
		run: editor => setStatus(editor, "paid"),
		panel: "plugins",
		observe: "invoiceReadOnly exposes the editable prop, which now resolves to false, and filters every later edit.",
	},
];
