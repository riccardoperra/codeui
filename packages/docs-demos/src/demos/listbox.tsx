import { Listbox } from "@codeui/kit";

const languages = ["TypeScript", "Rust", "Python", "Go"];

export default function ListboxDemo() {
	return (
		<Listbox
			aria-label="Language"
			options={languages}
			defaultValue={["TypeScript"]}
			selectionMode="single"
			size="sm"
			bordered
		/>
	);
}
