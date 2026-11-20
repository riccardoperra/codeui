import { createSignal, onSettled } from "solid-js";
import { type CommandItem, CommandMenu, Kbd } from "@codeui/kit";

const commands: CommandItem[] = [
	{ id: "export-png", textValue: "Export as PNG", label: "Export as PNG", group: "Export" },
	{ id: "copy-link", textValue: "Copy share link", label: "Copy share link", group: "Export" },
	{ id: "new-snippet", textValue: "New snippet", label: "New snippet", group: "Snippet" },
];

export default function ShortcutDemo() {
	const [open, setOpen] = createSignal(false);
	const [last, setLast] = createSignal("");

	// An app binds the shortcut once, on `window`. This page already uses Cmd+K for its search, so
	// the demo acts only while the menu is open or focus is in the demo, and listens in the capture
	// phase to stop the event before the search sees it.
	let root!: HTMLDivElement;
	onSettled(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.isComposing || event.repeat) return;
			if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
			if (!open() && !root.contains(document.activeElement)) return;
			event.preventDefault();
			event.stopPropagation();
			setOpen(value => !value);
		};
		window.addEventListener("keydown", onKeyDown, true);
		return () => window.removeEventListener("keydown", onKeyDown, true);
	});

	return (
		<div
			ref={root}
			tabindex={-1}
			style={{ display: "grid", gap: "var(--cui-space-3)", "justify-items": "start" }}
		>
			<p style={{ margin: 0 }}>
				Click here, then press <Kbd>⌘</Kbd> <Kbd>K</Kbd> or <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> to open the menu.
			</p>
			<p aria-live="polite" style={{ margin: 0, color: "var(--cui-text-hint)" }}>
				{last()}
			</p>
			<CommandMenu
				open={open()}
				onOpenChange={setOpen}
				items={commands}
				title="Search commands"
				placeholder="Search commands"
				hint="↑↓ preview · ↵ apply · esc cancel"
				emptyContent="No command matches"
				onSelect={item => setLast(`Ran ${item.textValue}`)}
			/>
		</div>
	);
}
