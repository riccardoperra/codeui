import { Listbox } from "@codeui/kit";

export default function ListboxAnatomy() {
	return (
		<Listbox
			aria-label="Snippet language"
			options={["TypeScript", "Rust", "Python"]}
			selectionMode="single"
			defaultValue={["TypeScript"]}
		/>
	);
}
