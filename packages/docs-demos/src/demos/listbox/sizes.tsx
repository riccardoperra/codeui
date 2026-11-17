import { Listbox } from "@codeui/kit";
import { For } from "solid-js";
export default function Sizes() {
	return <For each={["xs", "sm", "md"] as const}>{size => <div><p>{size}</p><Listbox aria-label={`${size} languages`} options={["TypeScript", "Rust"]} selectionMode="single" size={size} /></div>}</For>;
}
