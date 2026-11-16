import "./layout.css";
import { VirtualizedListbox } from "@codeui/kit";
import { For } from "solid-js";
const options = ["JetBrains Mono", "Fira Code", "Source Code Pro"].map(label => ({ value: label, label, disabled: label === "Source Code Pro" }));
export default function Sizes() {
	return <For each={["xs", "sm", "md"] as const}>{size => <div><p>{size}</p><VirtualizedListbox class="virtualized-demo" aria-label={`${size} fonts`} options={options} size={size} selectionMode="multiple" defaultValue={["Fira Code"]} /></div>}</For>;
}
