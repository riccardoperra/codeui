import { createSignal } from "solid-js";
import { Button, type CommandItem, CommandMenu } from "@codeui/kit";

const snippets: CommandItem[] = [
	{ id: "hello", textValue: "hello-world.ts", label: "hello-world.ts", group: "Recent snippets" },
	{ id: "fetch", textValue: "fetch-user.ts", label: "fetch-user.ts", group: "Recent snippets" },
	{ id: "styles", textValue: "button.css.ts", label: "button.css.ts", group: "Recent snippets" },
];

export default function EmptyDemo() {
	const [open, setOpen] = createSignal(false);
	return (
		<>
			<Button theme="secondary" onClick={() => setOpen(true)}>
				Open snippet
			</Button>
			<CommandMenu
				open={open()}
				onOpenChange={setOpen}
				items={snippets}
				title="Search snippets"
				placeholder="Type a name, such as kiwi"
				emptyContent="No snippet matches. Clear the search to see recent snippets."
				onSelect={() => {}}
			/>
		</>
	);
}
