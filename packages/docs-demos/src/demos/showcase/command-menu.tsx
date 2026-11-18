import { Button, type CommandItem, CommandMenu, Kbd } from "@codeui/kit";
import { createSignal } from "solid-js";
import "./showcase.css";

const commands: CommandItem[] = [
	{ id: "create", textValue: "Create project", label: "Create project", group: "Projects" },
	{ id: "import", textValue: "Import from file", label: "Import from file", group: "Projects" },
	{ id: "invite", textValue: "Invite member", label: "Invite member", group: "Team" },
	{ id: "roles", textValue: "Manage roles", label: "Manage roles", group: "Team" },
	{ id: "billing", textValue: "Open billing", label: "Open billing", group: "Account" },
	{ id: "sign-out", textValue: "Sign out", label: "Sign out", group: "Account" },
];

export default function Commands() {
	const [open, setOpen] = createSignal(false);
	const [last, setLast] = createSignal("None yet");
	return (
		<div class="showcase-stack">
			<div class="showcase-row" style={{ "justify-content": "space-between" }}>
				<p class="showcase-meta" aria-live="polite">
					Last command: {last()}
				</p>
				<Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
					Search commands
				</Button>
			</div>
			<p class="showcase-meta">
				<Kbd>↑</Kbd> <Kbd>↓</Kbd> to move, <Kbd>↵</Kbd> to run, <Kbd>Esc</Kbd> to close.
			</p>
			<CommandMenu
				open={open()}
				onOpenChange={setOpen}
				items={commands}
				title="Search commands"
				placeholder="Search commands"
				hint="↑↓ move · ↵ run · esc close"
				emptyContent="No command matches"
				onSelect={item => setLast(item.textValue)}
			/>
		</div>
	);
}
