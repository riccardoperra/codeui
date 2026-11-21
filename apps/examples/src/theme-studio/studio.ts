import type { ToastController } from "@codeui/kit";
import { createContext, createEffect, createMemo, createSignal, useContext } from "solid-js";
import type { LanguageId } from "./highlight";
import { findPreset, presets, startPreset } from "./presets";
import { findSample } from "./samples";
import { type ColorKey, deriveId, fromObject, parseTheme, sameTheme, type SectionId, slot, type SlotKey, type Theme, toJson, toObject, toTypeScript, withSlot } from "./theme";

/** The theme, and the shipped theme it started from: what "Reset" goes back to. */
type Document = { theme: Theme; origin: string };
export type ExportFormat = "ts" | "json";
export type View = "frame" | "card";

const storageKey = "codeui.examples.theme-studio.v1";
/** Changes to one value within this time are one step of the history: a typed label, a dragged angle. */
const coalesceMs = 1000;

type Stored = { theme?: unknown; origin?: unknown; sample?: unknown; view?: unknown };

/** The last session. Storage can be blocked or hold an older shape; then the app starts fresh. */
function load(): (Document & { sample?: string; view?: View }) | null {
	try {
		const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null") as Stored | null;
		const result = stored && fromObject(stored.theme);
		if (!stored || !result || "errors" in result) return null;
		const origin = typeof stored.origin === "string" && findPreset(stored.origin) ? stored.origin : startPreset.id;
		return { theme: result.theme, origin, sample: typeof stored.sample === "string" ? stored.sample : undefined, view: stored.view === "card" ? "card" : "frame" };
	} catch {
		return null;
	}
}

export const sectionOf = (key: SlotKey): SectionId => (key.startsWith("previewBackground") ? "window" : slot(key as ColorKey).section);

/** The app's state. The preview, the panel, the command menu and the export all read it, so they always agree. */
export function createStudio(notifications: ToastController) {
	const stored = load();
	const [committed, setCommitted] = createSignal<Document>(stored ?? { theme: startPreset, origin: startPreset.id });
	// A preview sits over the committed theme and never enters the history.
	const [preview, setPreview] = createSignal<Theme | null>(null);
	const [past, setPast] = createSignal<Document[]>([]);
	const [future, setFuture] = createSignal<Document[]>([]);
	const [sample, setSample] = createSignal<LanguageId>(findSample(stored?.sample ?? "ts").id);
	const [view, setView] = createSignal<View>(stored?.view ?? "frame");
	const [section, setSection] = createSignal<SectionId>("theme");
	/** The row whose picker is open. */
	const [picker, setPicker] = createSignal<SlotKey | null>(null);
	/** The row under the pointer or the focus: the preview dims everything that does not use it. */
	const [spotlight, setSpotlight] = createSignal<SlotKey | null>(null);
	const [panelOpen, setPanelOpen] = createSignal(false);
	const [exportOpen, setExportOpen] = createSignal(false);
	const [importOpen, setImportOpen] = createSignal(false);
	const [format, setFormat] = createSignal<ExportFormat>("ts");

	const theme = createMemo(() => preview() ?? committed().theme);
	const saved = () => committed().theme;

	let lastKey: string | undefined;
	let lastTime = 0;
	/** Commits a theme. Give `key` to fold a run of changes to one value into one history step. */
	const commit = (next: Theme, key?: string, origin = committed().origin) => {
		const changed = !sameTheme(next, saved()) || origin !== committed().origin;
		const folded = key !== undefined && key === lastKey && performance.now() - lastTime < coalesceMs;
		setPreview(null);
		if (changed) {
			const previous = committed();
			if (!folded) setPast(list => [...list.slice(-99), previous]);
			setFuture([]);
			setCommitted({ theme: next, origin });
		}
		lastKey = key;
		lastTime = performance.now();
	};
	const step = (from: () => Document[], setFrom: (list: Document[]) => void, setTo: (update: (list: Document[]) => Document[]) => void) => {
		const target = from().at(-1);
		if (!target) return;
		lastKey = undefined;
		const previous = committed();
		setFrom(from().slice(0, -1));
		setTo(list => [...list, previous]);
		setCommitted(target);
		setPreview(null);
		setPicker(null);
	};
	const undo = () => step(past, setPast, setFuture);
	const redo = () => step(future, setFuture, setPast);

	createEffect(
		() => ({ theme: toObject(saved()), origin: committed().origin, sample: sample(), view: view() }),
		state => {
		try {
			localStorage.setItem(storageKey, JSON.stringify(state));
		} catch {
			// A private window can refuse storage. The work stays for this visit.
		}
	});

	const origin = () => findPreset(committed().origin) ?? startPreset;
	const patch = (change: Partial<Theme>, key?: string) => commit({ ...saved(), ...change }, key);
	/** The id follows the label until someone types an id of their own: while it is still the derived one, or the shipped theme's. */
	const setLabel = (label: string) => {
		const follows = saved().id === deriveId(saved().label) || saved().id === origin().id;
		patch({ label, ...(follows && label.trim() ? { id: deriveId(label) } : {}) }, "label");
	};
	const setColor = (key: SlotKey, value: string | undefined) => commit(withSlot(saved(), key, value));
	const startFrom = (id: string) => {
		const preset = findPreset(id);
		if (preset) commit(preset, undefined, id);
	};

	const isOrigin = () => sameTheme(saved(), origin());
	const undoAction = { label: "Undo", onClick: (toast: { dismiss: () => void }) => (undo(), toast.dismiss()) };
	const reset = () => {
		commit(origin());
		notifications.show({ description: `Back to ${origin().label}.`, action: undoAction });
	};

	/** Brings the row of a colour on screen: its section, and on a phone the sheet that holds it. */
	const reveal = (key: SlotKey) => {
		setSection(sectionOf(key));
		setPanelOpen(true);
	};

	/** Ends a picker: its preview becomes one history step, or is dropped. */
	const closePicker = (keep: boolean) => {
		const draft = preview();
		setPicker(null);
		if (keep && draft) commit(draft);
		else setPreview(null);
	};

	const source = (as: ExportFormat = format()) => (as === "ts" ? toTypeScript(saved()) : toJson(saved()));
	const fileName = (as: ExportFormat = format()) => `${saved().id}.${as}`;
	const copy = async (as: ExportFormat = format()) => {
		try {
			await navigator.clipboard.writeText(source(as));
			notifications.show({ tone: "success", description: `${as === "ts" ? "TypeScript" : "JSON"} copied.` });
		} catch {
			notifications.show({ tone: "danger", title: "Nothing was copied", description: "The browser blocked the clipboard. Download the file instead." });
		}
	};
	const download = (as: ExportFormat = format()) => {
		const link = document.createElement("a");
		link.href = URL.createObjectURL(new Blob([source(as)], { type: as === "ts" ? "text/typescript" : "application/json" }));
		link.download = fileName(as);
		link.click();
		URL.revokeObjectURL(link.href);
		notifications.show({ tone: "success", description: `${fileName(as)} downloaded.` });
	};
	/** Applies a pasted theme as one history step, or returns what is wrong with it. */
	const importTheme = (text: string): string[] => {
		const result = parseTheme(text);
		if ("errors" in result) return result.errors;
		const known = presets.find(preset => preset.id === result.theme.id);
		commit(result.theme, undefined, known ? known.id : committed().origin);
		notifications.show({ tone: "success", description: `${result.theme.label} imported.`, action: undoAction });
		return [];
	};

	return {
		notifications,
		theme,
		saved,
		preview,
		setPreview,
		commit,
		patch,
		setLabel,
		setColor,
		startFrom,
		origin,
		originId: () => committed().origin,
		isOrigin,
		reset,
		undo,
		redo,
		canUndo: () => past().length > 0,
		canRedo: () => future().length > 0,
		sample,
		setSample,
		view,
		setView,
		section,
		setSection,
		picker,
		setPicker,
		closePicker,
		spotlight,
		setSpotlight,
		panelOpen,
		setPanelOpen,
		reveal,
		exportOpen,
		setExportOpen,
		importOpen,
		setImportOpen,
		format,
		setFormat,
		source,
		fileName,
		copy,
		download,
		importTheme,
	};
}

export type Studio = ReturnType<typeof createStudio>;

export const StudioContext = createContext<Studio>();

export function useStudio() {
	const studio = useContext(StudioContext);
	if (!studio) throw new Error("useStudio needs the StudioContext provider.");
	return studio;
}
