import { Accordion, createAccordionItems, type AccordionEntry } from "@codeui/kit";
import { createSignal, For } from "solid-js";
export default function Demo() {
	const [entries] = createSignal<readonly AccordionEntry[]>([
		{
			value: "export",
			title: "Export",
			summary: "PNG",
			content: "Export your snippet as a PNG image.",
		},
	]);
	const metadata = createAccordionItems(entries);
	return (
		<>
			<nav aria-label="Settings sections">
				<For each={metadata()}>{entry => <span>{entry.title}</span>}</For>
			</nav>
			<Accordion items={entries()} defaultValue="export" />
		</>
	);
}
