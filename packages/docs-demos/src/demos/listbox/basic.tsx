import { Listbox } from "@codeui/kit";
export default function Basic() {
	return <Listbox aria-label="Snippet language" options={["TypeScript", "Rust", "Python"]} selectionMode="single" defaultValue={["TypeScript"]} disallowEmptySelection size="sm" />;
}
