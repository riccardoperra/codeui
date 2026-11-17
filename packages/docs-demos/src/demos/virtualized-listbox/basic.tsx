import "./layout.css";
import { VirtualizedListbox } from "@codeui/kit";
import { createSignal } from "solid-js";
const topics = ["Authentication", "Cache", "Database", "Export", "File upload", "GraphQL", "HTTP", "Image resize", "JSON", "Keyboard"];
const operations = ["validation", "retry", "timeout", "pagination", "serialization", "logging", "streaming", "cancellation", "error handling", "configuration"];
const languages = ["TypeScript", "Rust", "Python", "Go", "Kotlin"];
const snippets = languages.flatMap(language => topics.flatMap(topic => operations.map(operation => ({
	value: `${language}-${topic}-${operation}`,
	label: `${language}: ${topic} ${operation}`,
}))));
export default function Basic() {
	const [selected, setSelected] = createSignal(new Set<string>());
	return <div><VirtualizedListbox aria-label="500 code snippets" options={snippets} selectionMode="single" value={selected()} onChange={setSelected} size="sm" virtualizerOptions={{ overscan: 8 }} class="virtualized-demo" classes={{ itemLabel: "snippet-title" }} /><p>Selected: {Array.from(selected()).join(", ") || "None"}</p></div>;
}
