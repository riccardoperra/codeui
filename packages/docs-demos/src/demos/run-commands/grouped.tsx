import { createSignal } from "solid-js";
import { Button, type CommandItem, CommandMenu } from "@codeui/kit";

type Action = { id: string; name: string; shortcut?: string };
type AppCommand = CommandItem & { run: () => void };

export default function GroupedDemo() {
	const [open, setOpen] = createSignal(false);
	const [log, setLog] = createSignal("");

	// One list of actions. The toolbar, the menus and the command menu read it.
	const actions: Record<"export" | "snippet" | "view", Action[]> = {
		export: [
			{ id: "export-png", name: "Export as PNG", shortcut: "⌘ E" },
			{ id: "export-svg", name: "Export as SVG" },
		],
		snippet: [
			{ id: "duplicate", name: "Duplicate snippet", shortcut: "⌘ D" },
			{ id: "rename", name: "Rename snippet" },
		],
		view: [{ id: "line-numbers", name: "Toggle line numbers" }],
	};

	// Items with the same group must be next to each other to share a heading.
	const items: AppCommand[] = [
		...actions.export.map(action => ({ ...action, group: "Export" })),
		...actions.snippet.map(action => ({ ...action, group: "Snippet" })),
		...actions.view.map(action => ({ ...action, group: "View" })),
	].map(action => ({
		id: action.id,
		textValue: action.name,
		label: action.name,
		group: action.group,
		shortcut: action.shortcut,
		run: () => setLog(`Ran ${action.name}`),
	}));

	return (
		<div style={{ display: "grid", gap: "var(--cui-space-3)", "justify-items": "start" }}>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Open commands
			</Button>
			<p aria-live="polite" style={{ margin: 0, color: "var(--cui-text-hint)" }}>
				{log()}
			</p>
			<CommandMenu
				open={open()}
				onOpenChange={setOpen}
				items={items}
				title="Search commands"
				placeholder="Search commands"
				hint="↑↓ preview · ↵ apply · esc cancel"
				emptyContent="No command matches"
				onSelect={item => item.run()}
			/>
		</div>
	);
}
