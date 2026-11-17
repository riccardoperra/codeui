import { Listbox } from "@codeui/kit";
import { createSignal } from "solid-js";
export default function Selection() {
	const [selected, setSelected] = createSignal(new Set(["PNG"]));
	return <div>
		<Listbox aria-label="Export formats" options={["PNG", "SVG", "WebP"]} selectionMode="multiple" value={selected()} onChange={setSelected} size="sm" />
		<p>Selected formats: {Array.from(selected()).join(", ") || "None"}</p>
		<Listbox aria-label="Available formats, selection off" options={["PNG", "SVG", "WebP"]} selectionMode="none" size="sm" />
	</div>;
}
