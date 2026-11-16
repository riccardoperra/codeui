import { createSignal } from "solid-js";
import { Button, type CommandItem, CommandMenu, filterCommandItems } from "@codeui/kit";

type AppCommand = CommandItem & { aliases: string[] };

const commands: AppCommand[] = [
	{ id: "export-png", textValue: "Export as PNG", label: "Export as PNG", group: "Export", aliases: ["image", "download", "save"] },
	{ id: "copy-link", textValue: "Copy share link", label: "Copy share link", group: "Export", aliases: ["url", "share"] },
	{ id: "line-numbers", textValue: "Toggle line numbers", label: "Toggle line numbers", group: "View", aliases: ["gutter"] },
];

// The default filter, plus a match on any alias.
const filter = (items: readonly AppCommand[], query: string) => {
	const matched = new Set(filterCommandItems(items, query));
	const words = query.toLowerCase().split(/\s+/).filter(Boolean);
	return items.filter(
		item => matched.has(item) || words.every(word => item.aliases.some(alias => alias.includes(word))),
	);
};

export default function AliasesDemo() {
	const [open, setOpen] = createSignal(false);
	const [last, setLast] = createSignal("");
	return (
		<div style={{ display: "grid", gap: "var(--cui-space-3)", "justify-items": "start" }}>
			<Button theme="secondary" onClick={() => setOpen(true)}>
				Open commands
			</Button>
			<p aria-live="polite" style={{ margin: 0, color: "var(--cui-text-hint)" }}>
				{last()}
			</p>
			<CommandMenu
				open={open()}
				onOpenChange={setOpen}
				items={commands}
				filter={filter}
				title="Search commands"
				placeholder="Try download or gutter"
				emptyContent="No command matches"
				onSelect={item => setLast(`Ran ${item.textValue}`)}
			/>
		</div>
	);
}
