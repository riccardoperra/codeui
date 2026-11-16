import { createSignal } from "solid-js";
import { Button, type CommandItem, CommandMenu } from "@codeui/kit";

function Swatch(props: { colors: [string, string] }) {
	return (
		<span
			style={{
				width: "16px",
				height: "16px",
				"border-radius": "50%",
				background: `linear-gradient(135deg, ${props.colors[0]} 50%, ${props.colors[1]} 50%)`,
				"box-shadow": "inset 0 0 0 1px rgb(127 127 127 / 35%)",
			}}
		/>
	);
}

// Consecutive items with the same group and section share one heading.
const items: CommandItem[] = [
	{ id: "export-png", textValue: "Export as PNG", label: "Export as PNG", group: "Export", shortcut: "⌘ E" },
	{ id: "export-svg", textValue: "Export as SVG", label: "Export as SVG", group: "Export" },
	{ id: "copy-link", textValue: "Copy share link", label: "Copy share link", group: "Export", shortcut: "⌘ ⇧ C" },
	{
		id: "vercel",
		textValue: "Vercel",
		label: "Vercel",
		group: "Themes",
		leading: <Swatch colors={["#0a0a0a", "#52a8ff"]} />,
		current: true,
	},
	{ id: "dracula", textValue: "Dracula", label: "Dracula", group: "Themes", leading: <Swatch colors={["#282a36", "#ff79c6"]} /> },
	{
		id: "legacy",
		textValue: "Legacy light",
		label: "Legacy light",
		group: "Themes",
		leading: <Swatch colors={["#ffffff", "#999999"]} />,
		disabled: true,
	},
	{
		id: "jetbrains",
		textValue: "JetBrains Mono",
		label: "JetBrains Mono",
		description: "Monospace with ligatures",
		group: "Font",
		section: "Editor",
		current: true,
	},
	{
		id: "fira",
		textValue: "Fira Code",
		label: "Fira Code",
		description: "Monospace with ligatures",
		group: "Font",
		section: "Editor",
	},
];

export default function GroupsDemo() {
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
				items={items}
				title="Search commands"
				placeholder="Search commands, themes and fonts"
				hint="↑↓ preview · ↵ apply · esc cancel"
				emptyContent="No command matches"
				onSelect={item => setLast(`Ran ${item.textValue}`)}
			/>
		</div>
	);
}
