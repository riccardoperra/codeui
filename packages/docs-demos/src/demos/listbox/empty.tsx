import { Listbox } from "@codeui/kit";
export default function Empty() {
	return <div><Listbox<string> aria-label="Saved snippets" options={[]} selectionMode="single" /><p>No saved snippets.</p></div>;
}
