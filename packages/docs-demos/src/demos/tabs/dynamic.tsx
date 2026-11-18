import { Button, Tabs, TabsList, TabsHeader, TabsContent } from "@codeui/kit";
import { createSignal, For } from "solid-js";
export default function Dynamic() {
	const [tabs, setTabs] = createSignal([{ id: "snippet-1", title: "Fetch with retries" }]);
	const [value, setValue] = createSignal("snippet-1");
	let nextId = 2;
	function add() {
		const id = `snippet-${nextId++}`;
		setTabs(previous => [...previous, { id, title: `Untitled snippet ${nextId - 1}` }]);
		setValue(id);
	}
	function remove() {
		const remaining = tabs().filter(tab => tab.id !== value());
		const next = remaining[0];
		if (next) { setValue(next.id); setTabs(remaining); }
	}
	return <div><Button variant="secondary" onClick={add}>Add snippet</Button><Button variant="secondary" disabled={tabs().length === 1} onClick={remove}>Close selected</Button>
		<Tabs variant="inline" value={value()} onChange={setValue} class="snippet-tabs"><TabsList aria-label="Open snippets"><For each={tabs()}>{tab => <TabsHeader value={tab.id}>{tab.title}</TabsHeader>}</For></TabsList><For each={tabs()}>{tab => <TabsContent value={tab.id}>Editing {tab.title}</TabsContent>}</For></Tabs>
	</div>;
}
