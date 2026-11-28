import { baseKeymap, chainCommands, selectParentNode, toggleMark } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { liftListItem, sinkListItem, splitListItem } from "prosemirror-schema-list";
import { EditorState, Plugin, PluginKey, Selection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { createPluginStateInspector } from "prosemirror-inspector/core";
import { createHistoryInspector } from "prosemirror-inspector/inspectors/history";
import { type Accessor, createSignal } from "solid-js";
import { createSession } from "./devtools";
import { deleteRow, editRow, insertRowAfter, selectRow } from "./invoice/commands";
import { createInitialDoc } from "./invoice/fixture";
import { createNodeViewsPlugin } from "./invoice/nodeviews";
import { activeRowPlugin, domainEventsPlugin, findPlugin, lineItemIdsPlugin, readOnlyPlugin, spotlightPlugin, validationPlugin } from "./invoice/plugins";
import { marks, nodes } from "./invoice/schema";

/** What the chrome and the commands share: the view, its state as a signal, and command tracing. */
export interface Editor {
	readonly view: EditorView;
	readonly state: Accessor<EditorState>;
	/** Names one synchronous command in the inspector's Events & commands panel. */
	trace<T>(name: string, run: () => T): T;
	destroy(): void;
}

const validationInspector = createPluginStateInspector({
	id: "invoice-validation",
	label: "Line item validation",
	plugin: validationPlugin,
	serialize: value => ({
		delayMs: value.delayMs,
		invalidRows: value.invalid.length,
		rows: value.invalid.slice(0, 20).map(row => ({ id: row.id, pos: row.pos, issues: row.issues.map(issue => issue.code) })),
	}),
});

export function createEditor(options: { onFind(): void }): Editor {
	// The session comes first: it replaces each plugin with an instrumented copy before the state exists.
	const session = createSession([createHistoryInspector(), validationInspector]);

	// The chrome follows the editor one microtask late, so a scenario of 200 dispatches updates it
	// once, and none of Solid's work is timed as part of a dispatch.
	let scheduled = false;
	const bridge = new Plugin({
		key: new PluginKey("solidBridge"),
		view: () => ({
			update(view) {
				if (scheduled) return;
				scheduled = true;
				queueMicrotask(() => {
					scheduled = false;
					if (!view.isDestroyed) setState(view.state);
				});
			},
		}),
	});

	const plugins = session.instrumentPlugins([
		history(),
		keymap({
			"Mod-z": undo,
			"Mod-Shift-z": redo,
			"Mod-y": redo,
			"Mod-b": toggleMark(marks.strong),
			"Mod-i": toggleMark(marks.em),
			"Mod-f": () => (options.onFind(), true),
			Enter: chainCommands(insertRowAfter, splitListItem(nodes.list_item)),
			// Tab leaves the editor, as it leaves any field. Lists nest with the bracket keys.
			"Mod-]": sinkListItem(nodes.list_item),
			"Mod-[": liftListItem(nodes.list_item),
			Escape: selectParentNode,
		}),
		keymap(baseKeymap),
		lineItemIdsPlugin,
		validationPlugin,
		findPlugin,
		spotlightPlugin,
		activeRowPlugin,
		domainEventsPlugin,
		readOnlyPlugin,
		createNodeViewsPlugin({
			edit: (pos, attrs) => editRow(editor, pos, attrs),
			select: pos => selectRow(editor, pos),
			remove: pos => deleteRow(editor, pos),
		}),
		bridge,
	]);

	const doc = createInitialDoc();
	const view = new EditorView(
		{ mount: document.createElement("div") },
		{
			// The caret starts in the first text, not on the invoice details atom that opens the document.
			state: EditorState.create({ doc, selection: Selection.findFrom(doc.resolve(0), 1, true) ?? undefined, plugins }),
			attributes: { class: "pmi-paper", role: "textbox", "aria-multiline": "true", "aria-label": "Invoice" },
		},
	);
	const [state, setState] = createSignal(view.state, { equals: false });
	session.attach(view);

	const editor: Editor = {
		view,
		state,
		trace: (name, run) => (session.diagnostics ? session.diagnostics.traceCommand(name, run) : run()),
		destroy() {
			session.dispose();
			view.destroy();
		},
	};
	return editor;
}
