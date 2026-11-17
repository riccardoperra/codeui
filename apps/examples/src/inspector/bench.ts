import type { ToastController } from "@codeui/kit";
import { createContext, createMemo, createSignal, onCleanup, useContext } from "solid-js";
import { dispatchCount, type PanelId } from "./devtools";
import { createEditor } from "./editor";
import { lineItemRows, readMeta } from "./invoice/document";
import { isLocked } from "./invoice/model";
import { validationKey } from "./invoice/plugins";

export interface Outcome {
	/** False when the command had nothing to do, or the read-only filter rejected it. */
	readonly applied: boolean;
	readonly dispatches: number;
	readonly ms: number;
}

const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

/** The workbench: the editor, what the chrome reads from its state, and the inspector's place on the page. */
export function createBench(notifications: ToastController) {
	const [findOpen, setFindOpen] = createSignal(false);
	const [inspectorOpen, setInspectorOpen] = createSignal(false);
	const [panel, setPanel] = createSignal<string>("history");
	const [sheetOpen, setSheetOpen] = createSignal(false);
	const [busy, setBusy] = createSignal<string | null>(null);

	// True when a click opened the inspector, which then takes the focus. From the keyboard shortcut
	// the focus stays where it was, so typing in the document carries on.
	let focusDock = false;
	const openInspector = (focus: boolean) => {
		focusDock = focus;
		setInspectorOpen(true);
	};

	const editor = createEditor({ onFind: () => setFindOpen(true) });
	onCleanup(editor.destroy);

	const doc = createMemo(() => editor.state().doc);
	const status = createMemo(() => readMeta(doc()).status);
	const rows = createMemo(() => lineItemRows(doc()).length);
	const validation = createMemo(() => validationKey.getState(editor.state()), undefined, { equals: (a, b) => a === b });

	/** Counts the dispatches and the main-thread time of one synchronous run. */
	const measure = (run: () => boolean): Outcome => {
		const dispatches = dispatchCount();
		const start = performance.now();
		const applied = run();
		return { applied, dispatches: dispatchCount() - dispatches, ms: performance.now() - start };
	};

	return {
		editor,
		notifications,
		doc,
		status,
		locked: () => isLocked(status()),
		rows,
		pages: () => doc().childCount,
		invalidRows: () => validation()?.invalid.length ?? 0,
		validationDelay: () => validation()?.delayMs ?? 0,
		findOpen,
		setFindOpen,
		inspectorOpen,
		openInspector,
		closeInspector: () => setInspectorOpen(false),
		/** Read once by the dock when it mounts. */
		takeDockFocus: () => [focusDock, (focusDock = false)][0],
		panel,
		setPanel,
		/** The phone sheet that holds the side panel's sections. */
		sheetOpen,
		setSheetOpen,
		/** Opens the inspector on one of its panels. On a phone the sheet leaves, or it would cover it. */
		inspect(id: PanelId) {
			setPanel(id);
			setSheetOpen(false);
			openInspector(true);
		},
		/** The id of the long run in progress, which its button shows as a spinner. */
		busy,
		/**
		 * A stress run blocks the main thread for a while. Two frames let the button paint its
		 * loading state first, so the page never looks frozen without a reason.
		 */
		async perform(id: string, run: () => boolean): Promise<Outcome> {
			setBusy(id);
			await nextFrame();
			await nextFrame();
			try {
				return measure(run);
			} finally {
				setBusy(null);
			}
		},
	};
}

export type Bench = ReturnType<typeof createBench>;

export const BenchContext = createContext<Bench>();

export const useBench = () => useContext(BenchContext)!;

const precise = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** `1 dispatch · 12.4 ms`. A tenth of a millisecond only matters below a hundred. */
export const formatOutcome = (outcome: Outcome) =>
	`${outcome.dispatches} ${outcome.dispatches === 1 ? "dispatch" : "dispatches"} · ${(outcome.ms < 100 ? precise : whole).format(outcome.ms)} ms`;
