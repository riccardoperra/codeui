import "./layout.css";
import { VirtualizedListbox } from "@codeui/kit";
export default function Empty() {
	return <div><VirtualizedListbox class="virtualized-demo" aria-label="Matching snippets" options={[]} /><p>No matching snippets.</p></div>;
}
