import "./layout.css";
import { VirtualizedListbox } from "@codeui/kit";
import { createSignal } from "solid-js";

const languages = ["TypeScript", "Rust", "Python", "Go", "Kotlin", "Swift", "Ruby", "Java"];

export default function VirtualizedListboxAnatomy() {
	const [selected, setSelected] = createSignal(new Set(["TypeScript"]));
	return (
		<VirtualizedListbox
			aria-label="Snippet language"
			options={languages.map(label => ({ value: label, label }))}
			selectionMode="single"
			value={selected()}
			onChange={setSelected}
			size="sm"
			class="virtualized-demo"
		/>
	);
}
