import {
	createProseMirrorDevtoolsSession,
	createProseMirrorDevtoolsStore,
	createSnapshot,
	type DevtoolsMarkerTone,
	loadSnapshots,
	markProseMirrorDevtools,
	measureProseMirrorDevtools,
	persistSnapshots,
	type ProseMirrorInspector,
} from "prosemirror-inspector/core";
import type { Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

/*
 * The docs site serves a production build, and the inspector is the point of this page, so the
 * session is created in every environment. An app that ships to users guards these calls with
 * `import.meta.env.DEV`, as the library's README shows.
 */
export const store = createProseMirrorDevtoolsStore();
export const sessionId = "invoice";

/** The inspector's panels, by the id its `activePanel` option takes and the name its tabs show. */
export const panels = {
	selection: "Document › Selection",
	history: "Timeline › Transactions",
	events: "Timeline › Events & commands",
	performance: "Performance",
	plugins: "Plugins",
	decorations: "Plugins › Rendering",
	snapshots: "Snapshots",
	"inspection-context": "Context",
} as const;
export type PanelId = keyof typeof panels;

export const createSession = (inspectors: readonly ProseMirrorInspector[]) =>
	createProseMirrorDevtoolsSession({ id: sessionId, label: "Invoice", store, diagnostics: { limit: 500 }, inspectors });

/** Measures synchronous plugin work as a span of the dispatch being recorded. */
export const measure = <T>(label: string, category: string, run: () => T): T => measureProseMirrorDevtools(sessionId, label, run, { store, category });

export const mark = (label: string, category: string, data: unknown) => markProseMirrorDevtools(sessionId, label, { store, category, data });

export interface DomainEvent {
	readonly label: string;
	readonly tone?: DevtoolsMarkerTone;
	readonly data?: unknown;
}

const domainEventMeta = "invoiceDomainEvent";

/** A marker only lands on the dispatch being recorded, so a command tags its transaction and a plugin marks it mid-dispatch. */
export const tagDomainEvent = (tr: Transaction, event: DomainEvent) => tr.setMeta(domainEventMeta, event);

export function markDomainEvents(transactions: readonly Transaction[]) {
	for (const tr of transactions) {
		const event = tr.getMeta(domainEventMeta) as DomainEvent | undefined;
		if (event) markProseMirrorDevtools(sessionId, event.label, { store, category: "invoice", tone: event.tone ?? "info", data: event.data });
	}
}

export const dispatchCount = () => store.getInstance(sessionId)?.dispatchCount ?? 0;

/** Saves the document and selection where the inspector's Snapshots panel lists them. */
export function takeSnapshot(view: EditorView, name: string): boolean {
	try {
		persistSnapshots(sessionId, [...loadSnapshots(sessionId), createSnapshot(sessionId, view, name)]);
		return true;
	} catch {
		// Snapshots live in localStorage, which a private window can refuse.
		return false;
	}
}
