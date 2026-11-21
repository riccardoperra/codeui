import { createEffect, createSignal } from "solid-js";
import { Button, type CommandItem, CommandMenu } from "@codeui/kit";

const library = [
	"hello-world.ts",
	"fetch-user.ts",
	"button.css.ts",
	"use-debounce.ts",
	"router.tsx",
	"schema.sql",
	"deploy.yml",
];

// Stands in for a request to your server.
function searchSnippets(query: string): Promise<CommandItem[]> {
	const words = query.toLowerCase().split(/\s+/).filter(Boolean);
	const names = library.filter(name => words.every(word => name.includes(word)));
	return new Promise(resolve =>
		setTimeout(
			() =>
				resolve(
					names.map(name => ({
						id: name,
						textValue: name,
						label: name,
						group: query ? "Results" : "Recent snippets",
					})),
				),
			400,
		),
	);
}

export default function AsyncDemo() {
	const [open, setOpen] = createSignal(false);
	const [query, setQuery] = createSignal("");
	const [results, setResults] = createSignal<CommandItem[]>([]);
	const [loading, setLoading] = createSignal(false);
	const [opened, setOpened] = createSignal("");

	createEffect(() => open() ? query() : undefined, current => {
		if (current === undefined) return;
		let stale = false;
		setLoading(true);
		// Wait for a pause in typing before the request.
		const timer = setTimeout(() => {
			searchSnippets(current).then(items => {
				if (stale) return;
				setResults(items);
				setLoading(false);
			});
		}, 150);
		return () => {
			stale = true;
			clearTimeout(timer);
		};
	});

	return (
		<div style={{ display: "grid", gap: "var(--cui-space-3)", "justify-items": "start" }}>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Open snippet
			</Button>
			<p aria-live="polite" style={{ margin: 0, color: "var(--cui-text-hint)" }}>
				{opened()}
			</p>
			<CommandMenu
				open={open()}
				onOpenChange={setOpen}
				items={results()}
				// The server already matched the query. Keep its order.
				filter={items => items}
				query={query()}
				onQueryChange={setQuery}
				title="Search snippets"
				placeholder="Search snippets"
				emptyContent={loading() ? "Searching…" : "No snippet matches"}
				onSelect={item => setOpened(`Opened ${item.textValue}`)}
			/>
		</div>
	);
}
