import { createSignal, For } from "solid-js";
import { filterCommandItems, TextField, type CommandItem } from "@codeui/kit";

const commands: CommandItem[] = [
	{ id: "export-png", textValue: "Export as PNG", label: "Export as PNG", group: "Export" },
	{ id: "export-svg", textValue: "Export as SVG", label: "Export as SVG", group: "Export" },
	{ id: "copy-link", textValue: "Copy share link", label: "Copy share link", group: "Share" },
	{
		id: "theme-dracula",
		textValue: "Dracula",
		label: "Dracula",
		description: "Dark theme",
		group: "Theme",
	},
];

export default function FilterCommandItemsDemo() {
	const [query, setQuery] = createSignal("");
	const results = () => filterCommandItems(commands, query());
	return (
		<>
			<TextField label="Search commands" placeholder="Try export png or dark" value={query()} onChange={setQuery} />
			<ul>
				<For each={results()} fallback={<li>No command matches.</li>}>
					{command => (
						<li>
							{command.group}: {command.label}
						</li>
					)}
				</For>
			</ul>
		</>
	);
}
